/**
 * 鸿蒙 ArkTS/ArkUI 在线练习模拟器 —— 课程判题引擎。
 *
 * 把课程教授的 ArkTS 子集解析并真实执行：
 *   struct 组件（@Entry/@Component）、@State/@Prop/@Link/@Provide/@Consume/
 *   @StorageLink 状态装饰器、声明式 build()、属性链、事件、ForEach/LazyForEach、
 *   if/else、@Builder、router 页面栈与生命周期、AppStorage、
 *   Preferences 持久化模拟、http 网络模拟（mock 注入）、普通 class 模型类。
 *
 * execArkTS(source, configJson, scriptJson) →
 *   { ok, error?, logs, dump, renderCounts, storage, pages }
 *
 * 设计原则：
 *  - 完全确定性：同一代码 + 同一交互脚本 → 同一渲染树与日志（判题可复现）
 *  - 真实语法：关卡使用真实 ArkTS 写法（struct / build() / 属性链 / 尾随闭包）
 *  - 语义忠实：状态变更按 V1 粒度重渲染所属结构体；renderCounts 记录每个
 *    struct 的 build 执行次数（仅统计用户代码驱动的渲染），支撑性能教学
 *  - 交互模拟：tap / input 由用例 stdin（JSON 数组）注入
 */

/* ======================= 词法分析 ======================= */

interface Tok { k: 'id' | 'num' | 'str' | 'tpl' | 'punc' | 'op' | 'kw'; v: string; /** 该 token 前是否有换行（ASI 语义还原用） */ nl?: boolean; }

/** 拼接 token 序列：换行边界用 \n 还原，保证多语句体的 ASI 语义正确 */
export function joinToks(toks: Tok[]): string {
  let out = '';
  for (let j = 0; j < toks.length; j++) {
    const s = fmtTok(toks[j]);
    if (j === 0) { out = s; continue; }
    out += (toks[j].nl ? '\n' : ' ') + s;
  }
  return out;
}

const KEYWORDS = new Set(['struct', 'class', 'interface', 'import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'in', 'new', 'this', 'true', 'false', 'null', 'undefined', 'extends', 'implements', 'type', 'enum', 'try', 'catch', 'throw', 'break', 'continue', 'while', 'switch', 'case', 'default', 'do']);

export function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const n = src.length;
  let nl = false;
  const push = (t: { k: Tok['k']; v: string }) => { toks.push({ ...t, nl }); nl = false; };
  while (i < n) {
    const c = src[i];
    if (/\s/.test(c)) { if (c === '\n') nl = true; i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === "'" || c === '"') {
      const q = c; let j = i + 1; let s = '';
      while (j < n && src[j] !== q) { if (src[j] === '\\') { s += src[j + 1]; j += 2; } else { s += src[j]; j++; } }
      push({ k: 'str', v: s }); i = j + 1; continue;
    }
    if (c === '`') {
      let j = i + 1; let s = '`';
      while (j < n && src[j] !== '`') { if (src[j] === '\\') { s += src[j] + src[j + 1]; j += 2; } else { s += src[j]; j++; } }
      s += '`';
      push({ k: 'tpl', v: s }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i; while (j < n && /[0-9._]/.test(src[j])) j++;
      push({ k: 'num', v: src.slice(i, j) }); i = j; continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i; while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const w = src.slice(i, j);
      push({ k: KEYWORDS.has(w) ? 'kw' : 'id', v: w }); i = j; continue;
    }
    if (c === '@') { push({ k: 'op', v: '@' }); i++; continue; }
    const three = src.substr(i, 3);
    const two = src.substr(i, 2);
    if (['===', '!==', '...', '??='].includes(three)) { push({ k: 'op', v: three }); i += 3; continue; }
    if (['=>', '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '?.', '**', '??'].includes(two)) { push({ k: 'op', v: two }); i += 2; continue; }
    push({ k: /[{}()[\];,.:]/.test(c) ? 'punc' : 'op', v: c }); i++;
  }
  return toks;
}

/* ======================= 类型剥离（逻辑体 → 可执行 JS） ======================= */


/** 把教授子集内的 TS 类型注解剥掉，输出可直接执行的 JS（逻辑体专用） */
export function stripTypes(body: string): string {
  let s = body;
  s = s.replace(/\bas\s+[A-Za-z_$][\w$.]*(\s*<[\s\S]*?>)?(\[\])?/g, '');  // as X / as Record<K, V>
  s = s.replace(/([A-Za-z_$][\w$]*)\.<\s*[A-Z][\w.\s,|]*?\s*>\(/g, '$1('); // 调用处泛型 foo<T>(x)
  s = s.replace(/(const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*([^=;\n]+?)(?=\s*=)/g, (_m, a, b) => `${a} ${b}`);
  // 参数/字段注解：name: T → name（类型以大写字母开头或为基本类型，避免误伤小写键的对象字面量；[] 允许空白且对所有分支生效）
  s = s.replace(/([A-Za-z_$][\w$]*)\s*:\s*(number|string|boolean|void|any|object|[A-Z][\w$.]*)(\s*\[\s*\])?((\s*\|\s*(number|string|boolean|void|any|object|null|[A-Z][\w$.]*)(\s*\[\s*\])?)*)(?=\s*[,)=;]|\s*$)/gm, '$1');
  // 返回值注解：): T {  →  ) {   /  ): T =>  →  ) =>
  s = s.replace(/\)\s*:\s*[^{=>;\n]+?(?=\s*(=>|\{|;))/g, ')');
  // 类字段注解（ArkTS 无分号风格，跨行）：`title: string\n` → `title\n`
  s = s.replace(/^(\s*)([A-Za-z_$][\w$]*)\s*:\s*(number|string|boolean|void|any|[A-Z][\w$.]*(\s*\[\s*\])?)\s*$/gm, '$1$2');
  return s;
}

/* ======================= AST / 解析 ======================= */

interface FieldDef { dec: string[]; name: string; initSrc?: string; }
interface MethodDef { name: string; params: string[]; bodySrc: string; bodyRange: [number, number]; isBuilder: boolean; }
interface StructDef {
  name: string;
  dec: string[];
  fields: FieldDef[];
  methods: MethodDef[];
  buildRange?: [number, number];
}
interface ClassDef {
  name: string;
  observed: boolean;
  extendsSrc?: string;
  ctor?: { paramSrc: string; bodyRange: [number, number] };
  methods: { name: string; paramSrc: string; bodyRange: [number, number] }[];
}
interface ParsedFile { structs: StructDef[]; classes: ClassDef[]; }

export class Parser {
  t: Tok[]; i = 0;
  structs: StructDef[] = [];
  classes: ClassDef[] = [];
  constructor(toks: Tok[]) { this.t = toks; }
  peek(k = 0): Tok { return this.t[this.i + k] ?? { k: 'id', v: '' }; }
  next(): Tok { return this.t[this.i++] ?? { k: 'id', v: '' }; }
  /** 跳过一个类型注解：名称链 / [] / 泛型 / 联合 */
  skipType() {
    if (!/^[A-Za-z_$]/.test(this.peek().v)) return;
    this.i++;
    while (this.peek().v === '.') { this.i++; if (/^[A-Za-z_$]/.test(this.peek().v)) this.i++; }
    for (;;) {
      if (this.peek().v === '[' && this.peek(1).v === ']') { this.i += 2; continue; }
      if (this.peek().v === '<') {
        let d = 0;
        do { const t = this.next().v; if (t === '<') d++; else if (t === '>') d--; } while (d > 0 && this.i < this.t.length);
        continue;
      }
      if (this.peek().v === '|') { this.i++; if (/^[A-Za-z_$]/.test(this.peek().v) || /^(number|string|boolean|void|any)$/.test(this.peek().v)) this.i++; continue; }
      break;
    }
  }

  expect(v: string) {
    if (this.peek().v !== v) {
      const ctx = this.t.slice(Math.max(0, this.i - 8), this.i + 4).map((t) => t.v).join(' ');
      throw new Error(`解析错误：期望 '${v}'，实际 '${this.peek().v}' @tok${this.i} [${ctx}]`);
    }
    return this.next();
  }
  /** 从当前位置的 open 开始平衡扫描，返回 [openIdx, closeExclusiveIdx]，i 停进到 close 之后 */
  balanced(open: string, close: string): [number, number] {
    this.expect(open);
    const start = this.i - 1;
    let depth = 1;
    while (this.i < this.t.length && depth > 0) {
      const v = this.t[this.i].v;
      if (v === open) depth++;
      else if (v === close) depth--;
      this.i++;
    }
    return [start, this.i];
  }
  src(range: [number, number]): string { return joinToks(this.t.slice(range[0] + 1, range[1] - 1)); }

  parseFile(): ParsedFile {
    while (this.i < this.t.length) {
      const v = this.peek().v;
      if (v === '@') {
        const decs: string[] = [];
        while (this.peek().v === '@') {
          this.next(); // '@'
          decs.push('@' + this.next().v);
          if (this.peek().v === '(') this.balanced('(', ')'); // 装饰器参数
        }
        const nt = this.peek().v;
        if (nt === 'struct') this.parseStruct(decs);
        else if (nt === 'class') this.parseClass(decs);
        else continue; // 悬空装饰器（如 import 类型），跳过
        continue;
      }
      if (v === 'struct') { this.parseStruct([]); continue; }
      if (v === 'class') { this.parseClass([]); continue; }
      if (v === 'interface') { this.next(); this.next(); if (this.peek().v === '{') this.balanced('{', '}'); continue; }
      this.i++;
    }
    return { structs: this.structs, classes: this.classes };
  }

  parseClass(decs: string[]) {
    this.next(); // class
    const name = this.next().v;
    let extendsSrc = '';
    while (this.peek().v !== '{' && this.i < this.t.length) { extendsSrc += this.peek().v + ' '; this.i++; }
    this.expect('{');
    const cls: ClassDef = { name, observed: decs.includes('@Observed'), extendsSrc: extendsSrc.trim(), methods: [] };
    while (this.peek().v !== '}' && this.i < this.t.length) {
      if (this.peek(1).v === '(') {
        // 构造器 / 方法
        const mname = this.next().v;
        const [ps, pe] = this.balanced('(', ')');
        const paramSrc = this.src([ps, pe]);
        const [bs, be] = this.balanced('{', '}');
        if (mname === 'constructor') cls.ctor = { paramSrc, bodyRange: [bs, be] };
        else cls.methods.push({ name: mname, paramSrc, bodyRange: [bs, be] });
        continue;
      }
      // 字段声明（name: Type; / name: Type = init）—— 仅消费，不进运行时（实例字段由构造器建立）
      const fname = this.next().v;
      void fname;
      if (this.peek().v === ':') {
        this.next();
        this.skipType();
      }
      if (this.peek().v === '=') {
        this.next();
        let depth = 0;
        while (this.i < this.t.length) {
          const tv = this.peek().v;
          if (isOpener(tv)) { depth++; this.i++; continue; }
          if (isCloser(tv)) { if (depth === 0) break; depth--; this.i++; continue; }
          if (depth === 0) {
            if (tv === ';' || tv === ',') break;
            if (tv.startsWith('@')) break;
            if (this.peek().k === 'id' || (this.peek().k === 'kw' && tv !== 'new' && tv !== 'this')) {
              const nt = this.peek(1).v;
              const prev = this.t[this.i - 1]?.v;
              if ((nt === ':' || nt === '(') && prev !== 'new' && prev !== '.') break;
            }
          }
          this.i++;
        }
      }
      if (this.peek().v === ';') this.i++;
      continue;
    }
    this.expect('}');
    this.classes.push(cls);
  }

  parseStruct(decs: string[]) {
    this.next(); // struct
    const name = this.next().v;
    const st: StructDef = { name, dec: decs, fields: [], methods: [] };
    this.expect('{');
    while (this.peek().v !== '}' && this.i < this.t.length) {
      const fdecs: string[] = [];
      while (this.peek().v === '@') {
        this.next(); // '@'
        fdecs.push('@' + this.next().v);
        if (this.peek().v === '(') this.balanced('(', ')'); // 装饰器参数
      }
      const v = this.peek().v;
      if (v === 'build') {
        this.next(); this.expect('('); this.expect(')');
        st.buildRange = this.balanced('{', '}');
        continue;
      }
      // 方法 / @Builder
      if (this.peek(1).v === '(' && v !== '@') {
        const mname = this.next().v;
        const [ps, pe] = this.balanced('(', ')');
        const params: string[] = [];
        for (let j = ps + 1; j < pe - 1; j++) {
          if (this.t[j].k === 'id' && this.t[j].v !== 'string' && this.t[j].v !== 'number' && this.t[j].v !== 'boolean') {
            const prev = this.t[j - 1]?.v;
            if (prev === '(' || prev === ',') params.push(this.t[j].v);
          }
        }
        if (this.peek().v === ':') { this.next(); this.skipType(); } // 方法返回类型
        const [bs, be] = this.balanced('{', '}');
        st.methods.push({ name: mname, params, bodySrc: this.src([bs, be]), bodyRange: [bs, be], isBuilder: fdecs.includes('@Builder') });
        continue;
      }
      // 字段
      const fname = this.next().v;
      if (this.peek().v === ':') {
        this.next();
        this.skipType();
      }
      let initSrc: string | undefined;
      if (this.peek().v === '=') {
        this.next();
        const start = this.i;
        let depth = 0;
        while (this.i < this.t.length) {
          const tv = this.peek().v;
          if (isOpener(tv)) { depth++; this.i++; continue; }
          if (isCloser(tv)) {
            if (depth === 0) break;
            depth--; this.i++; continue;
          }
          if (depth === 0) {
            // 语句边界：分号/逗号/新装饰器/新成员（标识符后跟 ':' 或作为方法名跟 '('）
            if (tv === ';' || tv === ',') break;
            if (tv.startsWith('@')) break;
            if (this.peek().k === 'id' || (this.peek().k === 'kw' && tv !== 'new' && tv !== 'this')) {
              const nt = this.peek(1).v;
              const prev = this.t[this.i - 1]?.v;
              if ((nt === ':' || nt === '(') && prev !== 'new' && prev !== '.') break;
            }
          }
          this.i++;
        }
        initSrc = joinToks(this.t.slice(start, this.i));
      }
      if (this.peek().v === ';') this.next();
      st.fields.push({ dec: fdecs, name: fname, initSrc });
    }
    this.expect('}');
    this.structs.push(st);
  }
}

/* ======================= 组件块解析 ======================= */

interface CDecl {
  kind: 'component' | 'if' | 'foreach' | 'lazyforeach' | 'expr' | 'builder' | 'methodcall';
  name?: string;
  argsSrc?: string;
  bodyRange?: [number, number];
  attrs?: { name: string; argsSrc?: string }[];
  condSrc?: string; elseRange?: [number, number];
  arrSrc?: string; itemParam?: string; indexParam?: string; itemRange?: [number, number]; keySrc?: string;
  exprSrc?: string;
}

export function parseComponentBlock(toks: Tok[], start: number, end: number): CDecl[] {
  const decls: CDecl[] = [];
  let i = start;
  const pk = (k = 0): Tok => toks[i + k] ?? { k: 'id', v: '' };
  const collectArgs = (parts: Tok[]): string => joinToks(parts);
  while (i < end) {
    const v = pk().v;
    if (v === ';') { i++; continue; }
    if (pk().k === 'kw' && v === 'if') {
      i++;
      const cEnd = balancedIdx(toks, i, '(', ')');
      const condSrc = collectArgs(toks.slice(i + 1, cEnd - 1));
      i = cEnd;
      const bEnd = balancedIdx(toks, i, '{', '}');
      const d: CDecl = { kind: 'if', condSrc, bodyRange: [i + 1, bEnd - 1] };
      i = bEnd;
      if (pk().k === 'kw' && pk().v === 'else') {
        i++;
        const eEnd = balancedIdx(toks, i, '{', '}');
        d.elseRange = [i + 1, eEnd - 1];
        i = eEnd;
      }
      decls.push(d);
      continue;
    }
    if ((v === 'ForEach' || v === 'LazyForEach') && pk(1).v === '(') {
      i++; // 定位到 '('
      const openIdx = i;
      const aEnd = balancedIdx(toks, i, '(', ')');
      const argsTok = toks.slice(openIdx + 1, aEnd - 1);
      i = aEnd;
      // 按顶层逗号分片，记录每片的绝对起始（用于 generator 体内 token 区间换算）
      const parts: { toks: Tok[]; start: number }[] = [];
      let cur: Tok[] = [];
      let curStart = 0;
      let d3 = 0;
      for (let j = 0; j < argsTok.length; j++) {
        const t = argsTok[j];
        if (isOpener(t.v)) d3++;
        else if (isCloser(t.v)) d3--;
        if (t.v === ',' && d3 === 0) { parts.push({ toks: cur, start: curStart }); cur = []; curStart = j + 1; continue; }
        cur.push(t);
      }
      parts.push({ toks: cur, start: curStart });
      const arrSrc = joinToks(parts[0]?.toks ?? []);
      const gen = parts[1] ?? { toks: [] as Tok[], start: openIdx + 1 };
      const genTok = gen.toks;
      // genTok: ( item [: T] [, idx [: T]] ) => { body }
      let itemParam = 'item';
      let indexParam = 'index';
      let itemRange: [number, number] | undefined;
      {
        const arrowAt = genTok.findIndex((t) => t.v === '=>');
        const beforeArrow = genTok.slice(0, arrowAt === -1 ? genTok.length : arrowAt);
        const ids = beforeArrow.filter((t) => t.k === 'id' && !['string', 'number', 'boolean'].includes(t.v)).map((t) => t.v);
        itemParam = ids[0] ?? 'item';
        indexParam = ids[1] ?? 'index';
        const braceAt = genTok.findIndex((t) => t.v === '{');
        if (braceAt !== -1) {
          let d = 0; let k = braceAt;
          while (k < genTok.length) {
            if (genTok[k].v === '{') d++;
            else if (genTok[k].v === '}') { d--; if (d === 0) break; }
            k++;
          }
          // gen.start 是 genTok[0] 相对 argsTok 的偏移；换算绝对下标需加 argsTok 基准 (openIdx+1)
          const abs = (rel: number) => openIdx + 1 + gen.start + rel;
          itemRange = [abs(braceAt + 1), abs(k)];
        }
      }
      const keySrc = parts[2] ? joinToks(parts[2].toks).replace(/^\(\s*/, '').replace(/\s*\)\s*=>\s*/, '').trim() : undefined;
      decls.push({ kind: v === 'ForEach' ? 'foreach' : 'lazyforeach', arrSrc, itemParam, indexParam, itemRange, keySrc });
      continue;
    }
    if (/^[A-Z]/.test(v) && pk(1).v === '(') {
      i++;
      const aEnd = balancedIdx(toks, i, '(', ')');
      const argsSrc = collectArgs(toks.slice(i + 1, aEnd - 1));
      i = aEnd;
      let bodyRange: [number, number] | undefined;
      if (pk().v === '{') {
        const bEnd = balancedIdx(toks, i, '{', '}');
        bodyRange = [i + 1, bEnd - 1];
        i = bEnd;
      }
      const attrs: { name: string; argsSrc?: string }[] = [];
      while (pk().v === '.') {
        i++;
        const an = pk().v; i++;
        if (pk().v === '(') {
          const s2 = i + 1;
          const e2 = balancedIdx(toks, i, '(', ')');
          attrs.push({ name: an, argsSrc: collectArgs(toks.slice(s2, e2 - 1)) });
          i = e2;
        } else {
          attrs.push({ name: an });
        }
      }
      decls.push({ kind: 'component', name: v, argsSrc, bodyRange, attrs });
      continue;
    }
    // this . name ( args )：@Builder 调用或普通方法调用
    if (pk().k === 'kw' && v === 'this' && pk(1).v === '.' && pk(2).k === 'id' && /^[a-z]/.test(pk(2).v) && pk(3).v === '(') {
      const name = pk(2).v;
      i += 3;
      const aEnd = balancedIdx(toks, i, '(', ')');
      const argsSrc = collectArgs(toks.slice(i + 1, aEnd - 1));
      i = aEnd;
      decls.push({ kind: name === 'builder' ? 'methodcall' : 'methodcall', name, argsSrc, exprSrc: `this.${name}(${argsSrc})` });
      continue;
    }
    // 表达式语句
    {
      const start2 = i;
      let depth = 0;
      while (i < end) {
        const tv = pk().v;
        if (isOpener(tv)) depth++;
        else if (isCloser(tv)) depth--;
        else if (tv === ';' && depth === 0) { i++; break; }
        i++;
      }
      const exprSrc = collectArgs(toks.slice(start2, Math.min(i, end))).replace(/;\s*$/, '').trim();
      if (exprSrc) decls.push({ kind: 'expr', exprSrc });
      continue;
    }
  }
  return decls;
}

function balancedIdx(toks: Tok[], i: number, open: string, close: string): number {
  let depth = 0;
  while (i < toks.length) {
    const v = toks[i].v;
    if (v === open) depth++;
    else if (v === close) { depth--; if (depth === 0) return i + 1; }
    i++;
  }
  return i;
}

function fmtTok(t: Tok): string { return t.k === 'str' ? `'${t.v.replace(/'/g, "\\'")}'` : t.v; }

/** 括号分类（includes('') 对空字符串 token 恒为 true 的经典陷阱 —— 必须精确比较） */
function isOpener(v: string): boolean { return v === '(' || v === '[' || v === '{'; }
function isCloser(v: string): boolean { return v === ')' || v === ']' || v === '}'; }

/* ======================= 运行时 ======================= */

const ENUM_TABLE: Record<string, Record<string, string>> = {
  FontWeight: { Lighter: 'lighter', Normal: 'normal', Bold: 'bold', Bolder: 'bolder' },
  TextAlign: { Start: 'start', Center: 'center', End: 'end', Justify: 'justify' },
  FlexAlign: { Start: 'start', Center: 'center', End: 'end', SpaceBetween: 'space-between', SpaceAround: 'space-around', SpaceEvenly: 'space-evenly' },
  HorizontalAlign: { Start: 'start', Center: 'center', End: 'end' },
  VerticalAlign: { Top: 'top', Center: 'center', Bottom: 'bottom' },
  ImageFit: { Contain: 'contain', Cover: 'cover', Fill: 'fill', None: 'none', ScaleDown: 'scale-down' },
  ItemAlign: { Start: 'start', Center: 'center', End: 'end', Auto: 'auto' },
  Color: { Red: '#e5484d', Blue: '#3b82f6', Green: '#22c55e', White: '#ffffff', Black: '#000000', Gray: '#9ca3af', Orange: '#f97316', Yellow: '#facc15', Transparent: 'transparent' },
  Curve: { Linear: 'linear', EaseIn: 'ease-in', EaseOut: 'ease-out', EaseInOut: 'ease-in-out' },
  TextOverflow: { Clip: 'clip', Ellipsis: 'ellipsis' },
  TitleMode: { Default: 'default', CenterTitle: 'center-title' },
  ButtonType: { Capsule: 'capsule', Circle: 'circle', Normal: 'normal' },
  BarState: { Off: 'off', Auto: 'auto', On: 'on' },
};

interface RNode {
  type: string;
  props?: Record<string, unknown>;
  attrs: [string, unknown][];
  children: RNode[];
  text?: string;
  onTap?: () => void;
  onInput?: (v: string) => void;
}

interface Inst {
  def: StructDef;
  fields: Record<string, unknown>;
  links: Record<string, { obj: Record<string, unknown>; key: string }>;
  renderCount: number;
  pagePath?: string;
}

interface ArkSimConfig {
  pages?: Record<string, string>;
  entry?: string;
  httpMock?: Record<string, { status?: number; data: unknown }>;
  prefs?: Record<string, unknown>;
  /** 追踪定时器泄漏（tips 章节）：dump 末尾附加 #timers active=N */
  trackTimers?: boolean;
}

export interface ArkInteraction {
  tap?: string | number;
  input?: string | [string, number];
  back?: boolean;
  set?: [string, unknown];
}

export interface ArkResult {
  ok: boolean;
  error?: string;
  logs: string[];
  dump: string;
  renderCounts: Record<string, number>;
  storage: Record<string, unknown>;
  pages: string[];
}

function __linkProxy(obj?: Record<string, unknown>): Record<string, unknown> {
  if (!obj) return {};
  return new Proxy(obj, {
    get: (target, key) => ({ __link: { obj: target, key: String(key) } }),
  });
}

const MUTATING = new Set(['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin']);

/**
 * @State 数组/对象的引用观察包装：
 *  - 渲染与派生计算读取 published 快照（上次整体赋值时的内容）
 *  - push/splice/嵌套属性写等原地变异只作用于 live，不影响快照 —— 界面"不刷新"
 *  - 整体赋值 this.x = 新值 经由 __publish 发布新快照 —— 界面更新
 */
export function wrapState(v: unknown): unknown {
  if (v === null || typeof v !== 'object') return v;
  const holder: { published: unknown; live: unknown } = {
    published: Array.isArray(v) ? [...v] : { ...(v as Record<string, unknown>) },
    live: v,
  };
  return new Proxy(holder, {
    get(t, key) {
      const ks = String(key);
        if (ks === '__isState') return true;
      // __published 仅对数组语义生效：类实例（TaskSource 等）必须走 live 的方法
      if (ks === '__published') return t.published instanceof Array ? t.published : undefined;
      if (ks === '__publish') {
        return (nv: unknown) => {
          t.published = nv === null || typeof nv !== 'object' ? nv : Array.isArray(nv) ? [...nv] : { ...(nv as Record<string, unknown>) };
          t.live = nv;
        };
      }
      if (t.published instanceof Array && MUTATING.has(ks)) {
        return (...args: unknown[]) => (t.live as Record<string, (...a: unknown[]) => unknown>)[key as string](...args);
      }
      const pub = t.published as Record<string | symbol, unknown>;
      if (key in pub) {
        const pv = pub[key];
        if (typeof pv === 'function') return (pv as (...a: unknown[]) => unknown).bind(pub);
        return pv;
      }
      // prototype fallback：方法绑定 live 实例（getAll/getData 等基类方法）
      const lv = (t.live as Record<string | symbol, unknown>)[key];
      if (typeof lv === 'function') return (lv as (...a: unknown[]) => unknown).bind(t.live);
      return lv;
    },
    set(t, key, val) {
      (t.live as Record<string, unknown>)[String(key)] = val;
      return true;
    },
  });
}

function writeVal(container: Record<string, unknown>, key: string, v: unknown) {
  const cur = container[key];
  if (cur !== null && typeof cur === 'object' && (cur as { __isState?: boolean }).__isState) {
    (cur as { __publish: (nv: unknown) => void }).__publish(v);
  } else {
    container[key] = v;
  }
}

const HINT = '（若使用了未支持语法，请检查关卡讲解限定的子集）';

export function execArkTS(source: string, configJson: string, scriptJson: string): ArkResult {
  const logs: string[] = [];
  const renderCounts: Record<string, number> = {};
  try {
    const cfg: ArkSimConfig = JSON.parse(configJson || '{}');
    const script: ArkInteraction[] = JSON.parse(scriptJson || '[]');
    return new ArkSim(source, cfg, logs, renderCounts).run(script);
  } catch (err) {
    if ((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.ARK_DEBUG) console.error('[ARK_DEBUG]', (err as Error).stack);
    return { ok: false, error: `${(err as Error).message}${HINT}`, logs, dump: '', renderCounts, storage: {}, pages: [] };
  }
}

class ArkSim {
  parsed: ParsedFile;
  toks: Tok[];
  logs: string[];
  renderCounts: Record<string, number>;
  appStorage: Record<string, unknown>;
  prefs: Record<string, unknown>;
  provideMap: Record<string, Inst> = {};
  classMap: Record<string, unknown> = {};
  pageStack: Inst[] = [];
  pendingParams: Record<string, unknown> = {};
  timerIds = new Set<number>();
  private timerSeq = 1;
  cfg: ArkSimConfig;
  router: {
    pushUrl: (o: { url: string; params?: Record<string, unknown> }) => void;
    back: () => void;
    replaceUrl: (o: { url: string }) => void;
    getParams: () => Record<string, unknown> | undefined;
    getLength: () => number;
  };
  http: { createHttp: () => { request: (url: string, opts?: Record<string, unknown>, cb?: (e: unknown, d?: unknown) => void) => unknown } };
  preferences: { getSharedPreferences: () => unknown };

  constructor(src: string, cfg: ArkSimConfig, logs: string[], renderCounts: Record<string, number>) {
    this.cfg = cfg;
    this.logs = logs;
    this.renderCounts = renderCounts;
    this.toks = tokenize(src);
    this.parsed = new Parser(this.toks).parseFile();
    this.appStorage = { ...(cfg.prefs ?? {}) };
    this.prefs = { ...(cfg.prefs ?? {}) };
    // 编译文件级 class（模型类）：结构化重建为合法 JS
    for (const cls of this.parsed.classes) {
      const bits = [`class ${cls.name} ${cls.extendsSrc ?? ''}{`];
      if (cls.ctor) bits.push(`constructor(${stripTypes(cls.ctor.paramSrc)}) { ${stripTypes(joinToks(this.toks.slice(cls.ctor.bodyRange[0] + 1, cls.ctor.bodyRange[1] - 1)))} }`);
      for (const m of cls.methods) bits.push(`${m.name}(${stripTypes(m.paramSrc)}) { ${stripTypes(joinToks(this.toks.slice(m.bodyRange[0] + 1, m.bodyRange[1] - 1)))} }`);
      bits.push('}');
      this.classMap[cls.name] = this.compileFn(bits.join('\n'))();
    }
    const sim = this;
    this.router = {
      pushUrl(opts: { url: string; params?: Record<string, unknown> }) {
        const sn = (cfg.pages ?? {})[opts.url];
        if (!sn) throw new Error(`路由目标不存在：${opts.url}（需在关卡 runtime 的 pages 中注册）`);
        sim.pendingParams = opts.params ?? {};
        const inst = sim.createInst(sn, { params: opts.params ?? {} });
        inst.pagePath = opts.url;
        sim.pageStack.push(inst);
        sim.fire(inst, 'onPageShow');
      },
      back() {
        if (sim.pageStack.length > 1) {
          const gone = sim.pageStack.pop()!;
          sim.fire(gone, 'aboutToDisappear');
        }
      },
      replaceUrl(opts: { url: string }) {
        const sn = (cfg.pages ?? {})[opts.url];
        if (!sn) throw new Error(`路由目标不存在：${opts.url}`);
        const inst = sim.createInst(sn, {});
        inst.pagePath = opts.url;
        sim.pageStack[sim.pageStack.length - 1] = inst;
        sim.fire(inst, 'onPageShow');
      },
      getParams() {
        const cur = sim.pageStack[sim.pageStack.length - 1];
        return (cur?.fields.__params as Record<string, unknown> | undefined) ?? sim.pendingParams;
      },
      getLength() { return sim.pageStack.length; },
    };
    this.http = {
      createHttp() {
        return {
          request(url: string, _opts?: Record<string, unknown>, cb?: (e: unknown, d?: unknown) => void) {
            const mock = cfg.httpMock ?? {};
            const hitKey = Object.keys(mock).find((k) => url.includes(k));
            if (hitKey === undefined) {
              const err = { code: 2300025, message: `模拟器未配置该 URL 的 mock：${url}` };
              if (cb) cb(err, undefined);
              return { destroy() { /* noop */ } };
            }
            const data = { responseCode: mock[hitKey].status ?? 200, result: JSON.stringify(mock[hitKey].data) };
            if (cb) cb(undefined, data);
            return { destroy() { /* noop */ } };
          },
          destroy() { /* noop */ },
        };
      },
    };
    this.preferences = {
      getSharedPreferences() {
        // 同步立即执行的 thenable：cb 当拍运行，保证判题确定性（await 语义兼容）
        const thenable = (v: unknown) => ({ then: (cb: (x: unknown) => void) => cb(v) });
        return {
          get(key: string, dflt: unknown) { return thenable(key in sim.prefs ? sim.prefs[key] : dflt); },
          put(key: string, v: unknown) { sim.prefs[key] = v; return thenable(true); },
          flush() { return thenable(true); },
          delete(key: string) { delete sim.prefs[key]; return thenable(true); },
        };
      },
    };
  }

  env(extra: Record<string, unknown> = {}, self?: Record<string, unknown>) {
    const safeExtra: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(extra)) {
      if (/^[A-Za-z_$][\w$]*$/.test(k)) safeExtra[k] = v; // 过滤非法标识符键
    }
    return {
      ...this.classMap,
      ...safeExtra,
      router: this.router,
      AppStorage: {
        setOrCreate: (k: string, v: unknown) => { this.appStorage[k] = v; },
        get: (k: string) => this.appStorage[k],
        has: (k: string) => k in this.appStorage,
      },
      http: this.http,
      preferences: this.preferences,
      promptAction: { showToast: (m: { message?: string } | string) => { const msg = typeof m === 'string' ? m : m?.message ?? ''; this.logs.push(`[Toast] ${msg}`); } },
      hilog: {
        info: (...a: unknown[]) => this.logs.push(`[HILOG I] ${a.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ')}`),
        debug: (...a: unknown[]) => this.logs.push(`[HILOG D] ${a.map(String).join(' ')}`),
        warn: (...a: unknown[]) => this.logs.push(`[HILOG W] ${a.map(String).join(' ')}`),
        error: (...a: unknown[]) => this.logs.push(`[HILOG E] ${a.map(String).join(' ')}`),
      },
      FontWeight: ENUM_TABLE.FontWeight, TextAlign: ENUM_TABLE.TextAlign, FlexAlign: ENUM_TABLE.FlexAlign,
      HorizontalAlign: ENUM_TABLE.HorizontalAlign, VerticalAlign: ENUM_TABLE.VerticalAlign,
      ImageFit: ENUM_TABLE.ImageFit, ItemAlign: ENUM_TABLE.ItemAlign, Color: ENUM_TABLE.Color,
      Curve: ENUM_TABLE.Curve, TextOverflow: ENUM_TABLE.TextOverflow, ButtonType: ENUM_TABLE.ButtonType,
      TitleMode: ENUM_TABLE.TitleMode, BarState: ENUM_TABLE.BarState,
      console: { log: (...a: unknown[]) => this.logs.push(a.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ')) },
      setTimeout: (_fn: () => void, _ms?: number) => { const id = this.timerSeq++; return id; },
      setInterval: (_fn: () => void, _ms?: number) => { const id = this.timerSeq++; this.timerIds.add(id); return id; },
      clearTimeout: (id: number) => { this.timerIds.delete(id); },
      clearInterval: (id: number) => { this.timerIds.delete(id); },
      Math, JSON, Date, Number, String, Boolean, Array, Object, parseInt, parseFloat, isNaN,
      BasicDataSource,
      ...(self ? { self } : {}),
      $this: __linkProxy(self as Record<string, unknown>),
    };
  }

  /** 编译一段 JS（类/表达式公用） */
  compileFn(js: string): () => unknown {
    const env = this.env();
    const names = Object.keys(env);
    const vals = Object.values(env);
    return () => {
      const f = new Function(...names, `"use strict"; return (${js});`);
      return f(...vals);
    };
  }

  /** 实例的 this 上下文：字段 + 方法绑定（供模板串/表达式里的 this.xxx() 调用） */
  selfWithMethods(inst: Inst): Record<string, unknown> {
    const sim = this;
    return new Proxy(inst.fields, {
      get(t, key) {
        const k = String(key);
        const m = inst.def.methods.find((x) => x.name === k);
        if (m && !m.isBuilder) {
          return (...args: unknown[]) => {
            const argObj: Record<string, unknown> = {};
            m.params.forEach((p, i2) => { argObj[p] = args[i2]; });
            return sim.runBody(inst, m.bodySrc, argObj);
          };
        }
        return t[k];
      },
      set(_t, key, val) {
        sim.setField(inst, String(key), val);
        return true;
      },
    });
  }

  /** 求值表达式（this 绑定实例字段容器） */
  evalExpr(inst: Inst, src: string, extra: Record<string, unknown> = {}): unknown {
    const js = stripTypes(src);
    const self = this.selfWithMethods(inst);
    const env = this.env({ $$: inst.fields, ...extra }, self);
    const names = Object.keys(env);
    const vals = Object.values(env);
    try {
      const fn = new Function(...names, `"use strict"; return (${js});`);
      return fn.call(self, ...vals);
    } catch (err) {
      throw new Error(`表达式求值失败【${js.slice(0, 90)}】→ ${(err as Error).message}`);
    }
  }

  /** 执行语句体（this 绑定实例字段容器） */
  runBody(inst: Inst, bodySrc: string, extra: Record<string, unknown> = {}): unknown {
    const js = stripTypes(bodySrc);
    const self = this.selfWithMethods(inst);
    const env = this.env(extra, self);
    const names = Object.keys(env);
    const vals = Object.values(env);
    try {
      const fn = new Function(...names, `"use strict";${js}`);
      return fn.call(self, ...vals);
    } catch (err) {
      throw new Error(`执行失败【${js.slice(0, 120)}】→ ${(err as Error).message}`);
    }
  }

  /** 状态写入：@Link/@StorageLink 双向回写 */
  setField(inst: Inst, key: string, v: unknown) {
    const link = inst.links[key];
    if (link) {
      writeVal(link.obj as Record<string, unknown>, link.key, v);
      inst.fields[key] = (link.obj as Record<string, unknown>)[link.key];
    } else {
      writeVal(inst.fields as Record<string, unknown>, key, v);
    }
  }

  fire(inst: Inst, name: string) {
    const m = inst.def.methods.find((x) => x.name === name);
    if (m) this.runBody(inst, m.bodySrc);
  }

  createInst(structName: string, init: { props?: Record<string, unknown>; params?: Record<string, unknown> }): Inst {
    const def = this.parsed.structs.find((s) => s.name === structName);
    if (!def) throw new Error(`未定义的结构体：${structName}`);
    const inst: Inst = { def, fields: {}, links: {}, renderCount: 0 };
    for (const f of def.fields) {
      if (f.initSrc !== undefined) {
        const v = this.evalExpr(inst, f.initSrc);
        inst.fields[f.name] = f.dec.includes('@State') ? wrapState(v) : v;
          }
    }
    if (init.props) {
      for (const [k, v] of Object.entries(init.props)) {
        if (typeof v === 'object' && v !== null && '__link' in (v as object)) {
          const link = (v as { __link: { obj: Record<string, unknown>; key: string } }).__link;
          inst.links[k] = link;
          inst.fields[k] = (link.obj as Record<string, unknown>)[link.key];
        } else {
          inst.fields[k] = v;
        }
      }
    }
    if (init.params) inst.fields.__params = init.params;
    for (const f of def.fields) {
      if (f.dec.includes('@Provide')) this.provideMap[f.name] = inst;
      if (f.dec.includes('@StorageLink')) {
        if (!(f.name in this.appStorage)) this.appStorage[f.name] = inst.fields[f.name];
        inst.fields[f.name] = this.appStorage[f.name];
        inst.links[f.name] = { obj: this.appStorage as Record<string, unknown>, key: f.name };
      }
    }
    // @Consume：从已注册的 @Provide 取（渲染顺序保证父先于子创建）
    for (const f of def.fields) {
      if (f.dec.includes('@Consume')) {
        const src = this.provideMap[f.name];
        if (!src) throw new Error(`@Consume ${f.name}：未找到对应的 @Provide（需先在父组件中 @Provide 同名状态）`);
        inst.links[f.name] = { obj: src.fields as Record<string, unknown>, key: f.name };
        inst.fields[f.name] = (src.fields as Record<string, unknown>)[f.name];
      }
    }
    this.fire(inst, 'aboutToAppear');
    return inst;
  }

  renderStruct(inst: Inst, counted = true): RNode {
    if (!inst.def.buildRange) throw new Error(`结构体 ${inst.def.name} 缺少 build()`);
    if (counted) {
      inst.renderCount++;
      this.renderCounts[inst.def.name] = (this.renderCounts[inst.def.name] ?? 0) + 1;
    }
    const decls = parseComponentBlock(this.toks, inst.def.buildRange[0] + 1, inst.def.buildRange[1] - 1);
    const root: RNode = { type: '__root__', attrs: [], children: [] };
    this.interpretBlock(inst, decls, root.children, {}, counted);
    return root;
  }

  interpretBlock(inst: Inst, decls: CDecl[], children: RNode[], extra: Record<string, unknown> = {}, counted = true) {
    for (const d of decls) {
      if (d.kind === 'methodcall') {
        // @Builder 调用 → 内联渲染；普通方法 → 执行
        const bld = inst.def.methods.find((m) => m.isBuilder && m.name === d.name);
        if (bld) {
          const argParts: string[] = [];
          let curArg = '';
          let dArg = 0;
          for (const ch of d.argsSrc ?? '') {
            if ('([{'.includes(ch)) dArg++;
            else if (')]})'.includes(ch)) dArg--;
            if (ch === ',' && dArg === 0) { argParts.push(curArg.trim()); curArg = ''; continue; }
            curArg += ch;
          }
          if (curArg.trim()) argParts.push(curArg.trim());
          const argObj: Record<string, unknown> = {};
          bld.params.forEach((p, i2) => { argObj[p] = argParts[i2] !== undefined ? this.evalExpr(inst, `(${argParts[i2]})`, extra) : undefined; });
          const sub = parseComponentBlock(this.toks, bld.bodyRange![0] + 1, bld.bodyRange![1] - 1);
          this.interpretBlock(inst, sub, children, { ...extra, ...argObj }, counted);
        } else {
          this.runBody(inst, d.exprSrc ?? '', extra);
        }
        continue;
      }
      if (d.kind === 'expr') { this.runBody(inst, d.exprSrc ?? '', extra); continue; }
      if (d.kind === 'if') {
        const cond = this.evalExpr(inst, d.condSrc ?? 'false', extra);
        if (cond) {
          const sub = parseComponentBlock(this.toks, d.bodyRange![0], d.bodyRange![1]);
          this.interpretBlock(inst, sub, children, extra, counted);
        } else if (d.elseRange) {
          const sub = parseComponentBlock(this.toks, d.elseRange[0], d.elseRange[1]);
          this.interpretBlock(inst, sub, children, extra, counted);
        }
        continue;
      }
      if (d.kind === 'foreach' || d.kind === 'lazyforeach') {
        const raw = this.evalExpr(inst, d.arrSrc ?? '[]', extra);
        // IDataSource 形态（getAll / totalCount+getData）或数组
        let items: unknown[] = [];
        if (Array.isArray(raw)) items = raw;
        else if (raw !== null && typeof raw === 'object') {
          const pub = (raw as { __published?: unknown[] }).__published;
          if (pub !== undefined) items = pub;
        }
        else {
          const o = raw as { getAll?: () => unknown[]; totalCount?: () => number; getData?: (i: number) => unknown };
          items = o.getAll ? o.getAll() : Array.from({ length: o.totalCount?.() ?? 0 }, (_x, ix) => o.getData!(ix));
        }
        items.forEach((item, ix) => {
          const sub = parseComponentBlock(this.toks, d.itemRange![0], d.itemRange![1]);
          this.interpretBlock(inst, sub, children, { ...extra, [d.itemParam!]: item, [d.indexParam!]: ix }, counted);
        });
        continue;
      }
      if (d.kind === 'component') {
        // 结构体实例化（自定义子组件）
        if (this.parsed.structs.some((s) => s.name === d.name)) {
          const args = d.argsSrc ? (this.evalExpr(inst, `(${d.argsSrc})`) as Record<string, unknown>) : {};
          const props: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(args)) {
            if (k.startsWith('$') && typeof v === 'object' && v !== null && '__link' in (v as object)) {
              props[k] = v;
            } else {
              props[k] = v;
            }
          }
          const childInst = this.createInst(d.name!, { props });
          const node = this.renderStruct(childInst, counted);
          children.push({ type: d.name!, attrs: [], children: [node] });
          continue;
        }
        // @Builder 调用
        const bld = inst.def.methods.find((m) => m.isBuilder && m.name === d.name);
        if (bld) {
          const args = d.argsSrc ? (this.evalExpr(inst, `(${d.argsSrc})`) as Record<string, unknown>) : {};
          const sub = parseComponentBlock(this.toks, bld.bodyRange![0] + 1, bld.bodyRange![1] - 1);
          this.interpretBlock(inst, sub, children, { ...extra, ...args }, counted);
          continue;
        }
        // ArkUI 内置组件
        const node: RNode = { type: d.name!, attrs: [], children: [] };
        if (d.argsSrc && d.argsSrc.trim()) {
          const val = this.evalExpr(inst, `(${d.argsSrc})`, extra);
          if (val !== undefined) {
            node.props = typeof val === 'object' && val !== null ? val as Record<string, unknown> : { value: val };
          }
        }
        if (d.bodyRange) {
          const sub = parseComponentBlock(this.toks, d.bodyRange[0], d.bodyRange[1]);
          this.interpretBlock(inst, sub, node.children, extra, counted);
        }
        for (const a of d.attrs ?? []) {
          const val = a.argsSrc !== undefined ? (a.argsSrc.trim() === '' ? undefined : this.evalExpr(inst, a.argsSrc, extra)) : true;
          if (a.name === 'onClick' && a.argsSrc) {
            const stripped = stripTypes(a.argsSrc);
            const mBody = stripped.match(/^\s*(?:\(\s*\w*\s*\)|\w+)\s*=>\s*([\s\S]*)$/);
            const body = mBody ? mBody[1] : stripped;
            const cap = () => this.runBody(inst, body, extra);
            node.onTap = cap;
          } else if ((a.name === 'onChange' || a.name === 'onSubmit') && a.argsSrc) {
            const stripped = stripTypes(a.argsSrc);
            const m = stripped.match(/^\s*\(\s*(\w+)[^)]*\)\s*=>\s*([\s\S]*)$/);
            if (m) {
              const [, param, body] = m;
              node.onInput = (v: string) => this.runBody(inst, body, { ...extra, [param]: v });
            }
          } else {
            node.attrs.push([a.name, val]);
          }
        }
        children.push(node);
        continue;
      }
    }
  }

  run(script: ArkInteraction[]): ArkResult {
    const cfg = this.cfg;
    const entryPath = cfg.entry ?? Object.keys(cfg.pages ?? {})[0] ?? 'pages/Index';
    const entryStruct = (cfg.pages ?? {})[entryPath] ?? 'Index';
    const inst = this.createInst(entryStruct, {});
    inst.pagePath = entryPath;
    this.pageStack.push(inst);
    this.fire(inst, 'onPageShow');
    for (const step of script) {
      const cur = this.pageStack[this.pageStack.length - 1]!;
      if (step.set) {
        const [k, v] = step.set;
        this.setField(cur, k, typeof v === 'string' ? v : JSON.parse(JSON.stringify(v)));
        this.renderStruct(cur, true); // 状态变更 → 触发重渲染（计入 renderCounts）
        continue;
      }
      if (step.tap !== undefined) {
        const tree = this.renderStruct(cur, false);
        const btns: RNode[] = [];
        const walk = (n: RNode) => { if (n.onTap) btns.push(n); n.children.forEach(walk); };
        walk(tree);
        let target: RNode | undefined;
        if (typeof step.tap === 'number') target = btns[step.tap];
        else target = btns.find((b) => (textOf(b) ?? '').includes(String(step.tap)));
        if (!target) throw new Error(`交互失败：找不到可点击节点「${step.tap}」（当前可点击：${btns.map(textOf).map((x) => `"${x}"`).join('、') || '无'}）`);
        target.onTap!();
        this.renderStruct(this.pageStack[this.pageStack.length - 1]!, true); // 状态变更 → 重渲染
        continue;
      }
      if (step.input !== undefined) {
        const tree = this.renderStruct(cur, false);
        const inputs: RNode[] = [];
        const walk = (n: RNode) => { if (n.onInput) inputs.push(n); n.children.forEach(walk); };
        walk(tree);
        const [value, idxRaw] = Array.isArray(step.input) ? step.input : [step.input, 0];
        const idx = typeof idxRaw === 'number' ? idxRaw : 0;
        const target = inputs[idx];
        if (!target) throw new Error(`交互失败：找不到输入框 #${idx}（共 ${inputs.length} 个输入框）`);
        target.onInput!(value as string);
        this.renderStruct(this.pageStack[this.pageStack.length - 1], true);
        continue;
      }
      if (step.back) { this.router.back(); continue; }
    }
    const top = this.pageStack[this.pageStack.length - 1]!;
    const tree = this.renderStruct(top, false);
    const lines: string[] = [];
    const walkDump = (n: RNode, depth: number) => {
      const text = n.type === '__root__' ? undefined : textOf(n);
      const props = n.props ?? {};
      const propParts = Object.entries(props)
        .filter(([k]) => k !== 'value')
        .map(([k, v]) => `${k}=${attrStr(v)}`);
      const attrs = [...propParts, ...n.attrs.map(([k, v]) => `${k}=${attrStr(v)}`)];
      const attrPart = attrs.length > 0 ? ` (${attrs.join(', ')})` : '';
      lines.push(`${'  '.repeat(depth)}${n.type}${text !== undefined ? ` "${text}"` : ''}${attrPart}`);
      n.children.forEach((c) => walkDump(c, depth + 1));
    };
    walkDump(tree, 0);
    const counts = Object.entries(this.renderCounts).map(([k, v]) => `${k}=${v}`).join(', ');
    lines.push(`#renders ${counts}`);
    if (cfg.trackTimers) lines.push(`#timers active=${this.timerIds.size}`);
    lines.push(`#prefs ${JSON.stringify(this.prefs)}`);
    const pages = Object.entries(cfg.pages ?? {}).map(([p, s]) => `${p}→${s}`);
    return { ok: true, logs: this.logs, dump: lines.join('\n'), renderCounts: this.renderCounts, storage: this.prefs, pages, error: undefined };
  }
}

function textOf(n: RNode): string | undefined {
  // 仅文本承载型组件回显内容；容器/结构体不回显（避免把整棵子树拼成一坨）
  const TEXT_BEARING = new Set(['Text', 'Button', 'TextInput', 'TextArea', 'Span', 'ListItem', 'Radio', 'Checkbox', 'Toggle']);
  const v = (n.props as Record<string, unknown> | undefined)?.value;
  if ((TEXT_BEARING.has(n.type) || n.type === 'TextInput') && (typeof v === 'string' || typeof v === 'number')) return String(v);
  const childText = n.children.map((c) => textOf(c) ?? '').filter(Boolean).join('');
  return childText || undefined;
}

function attrStr(v: unknown): string {
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  return JSON.stringify(v);
}

/* ======================= IDataSource 教学垫片 ======================= */

/** LazyForEach 数据源基类（课程关卡继承它实现 IDataSource 契约） */
export class BasicDataSource {
  private listeners: (() => void)[] = [];
  private arr: unknown[] = [];
  totalCount(): number { return this.arr.length; }
  getData(idx: number): unknown { return this.arr[idx]; }
  getAll(): unknown[] { return this.arr; }
  registerListener(l: () => void) { this.listeners.push(l); }
  notifyReload() { this.listeners.forEach((l) => l()); }
  pushItem(item: unknown) { this.arr.push(item); this.notifyReload(); }
  setAll(items: unknown[]) { this.arr = [...items]; this.notifyReload(); }
}
