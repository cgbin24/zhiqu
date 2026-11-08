import type { LanguageId } from '@/types';

export interface CodeSnippet {
  title: string;
  code: string;
  note?: string;
}

/** 各语言常用代码片段速查 —— 学习时随手查，复制即用 */
export const SNIPPETS: Record<LanguageId, CodeSnippet[]> = {
  javascript: [
    {
      title: '读入与输出（平台沙箱内置）',
      code: `const n = Number(readline());   // 读一行转数字
const arr = readInts();          // 读一行整数数组
console.log("结果:", n, arr);    // 多值空格分隔`,
      note: 'readline / readInts 已自动注入，无需 require',
    },
    {
      title: '数组排序（数字要传比较器）',
      code: `arr.sort((a, b) => a - b);  // 升序
arr.sort((a, b) => b - a);  // 降序
arr.sort();                 // ⚠️ 字符串序！数字会乱`,
    },
    {
      title: 'map / filter / reduce 三件套',
      code: `arr.map(x => x * 2);              // 一一变换
arr.filter(x => x % 2 === 0);     // 筛选
arr.reduce((sum, x) => sum + x, 0); // 聚合求和`,
    },
    {
      title: '字符串常用方法',
      code: `s.split(' ').join('-');   // 分割与拼接
s.slice(1, 4);            // 截取 [1,4)
s.padStart(2, '0');       // 补零："7"→"07"
s.repeat(3);              // 重复
s.charCodeAt(0);          // 字符 → 编码`,
    },
    {
      title: 'Map 与对象计数',
      code: `const cnt = new Map();
for (const x of arr) cnt.set(x, (cnt.get(x) ?? 0) + 1);
// 对象写法：obj[x] = (obj[x] ?? 0) + 1;`,
    },
    {
      title: 'Set 去重',
      code: `const uniq = [...new Set(arr)];
const has = new Set(arr).has(42);`,
    },
    {
      title: '解构交换与多返回',
      code: `[a, b] = [b, a];                 // 交换
function divmod(a, b) { return [a / b | 0, a % b]; }
const [q, r] = divmod(17, 5);    // 3, 2`,
    },
    {
      title: '常用数学',
      code: `Math.floor(x); Math.abs(x);
Math.max(...arr);   // ⚠️ 大数组用 reduce 防参数上限
Number.isInteger(x);`,
    },
  ],
  go: [
    {
      title: '读入（单个/一行多值）',
      code: `var n int
fmt.Scan(&n)                    // 空白分隔自动读
var a, b int
fmt.Scan(&a, &b)                // 一行 "3 7" 也行`,
    },
    {
      title: '读一整行（含空格的字符串）',
      code: `reader := bufio.NewReader(os.Stdin)
s, _ := reader.ReadString('\\n')
s = strings.TrimSpace(s)        // 去掉末尾换行`,
      note: '需要 import "bufio" "os" "strings"',
    },
    {
      title: '输出格式化',
      code: `fmt.Println(a, b)               // 空格分隔 + 换行
fmt.Printf("%d %s %.2f\\n", n, s, f)
fmt.Printf("%02d:%02d\\n", h, m) // 补零`,
    },
    {
      title: '切片操作',
      code: `s := make([]int, 0, n)
s = append(s, 42)
len(s), s[0], s[len(s)-1]
sort.Ints(s)                    // 升序（需 sort 包）`,
    },
    {
      title: 'map 计数',
      code: `cnt := make(map[int]int)
cnt[x]++                        // 零值可直接用
for k, v := range cnt { fmt.Println(k, v) }`,
    },
    {
      title: '遍历三种写法',
      code: `for i := 0; i < n; i++ { }
for i, v := range slice { }     // 下标+值
for { break }                   // 无限循环`,
    },
    {
      title: '字符串处理（strings 包）',
      code: `strings.Fields(s)              // 按空白切分
strings.Split(s, ",")
strings.Join(parts, "+")
strings.Contains(s, "go")`,
    },
    {
      title: '自定义排序',
      code: `sort.Slice(s, func(i, j int) bool {
    return s[i] < s[j]
})`,
    },
  ],
  rust: [
    {
      title: '读入一行并解析',
      code: `let mut line = String::new();
std::io::stdin().read_line(&mut line).unwrap();
let n: i64 = line.trim().parse().unwrap();`,
    },
    {
      title: '一行读多个整数',
      code: `let mut line = String::new();
std::io::stdin().read_line(&mut line).unwrap();
let mut it = line.split_whitespace();
let (a, b) = (it.next().unwrap().parse::<i64>().unwrap(),
              it.next().unwrap().parse::<i64>().unwrap());`,
      note: '也可收集成 Vec：line.split_whitespace().map(|x| x.parse::<i64>().unwrap()).collect::<Vec<_>>()',
    },
    {
      title: '输出格式化',
      code: `println!("{}", x);            // 标准
println!("{:.2}", f);          // 两位小数
println!("{:?}", vec);         // Debug 打印容器
print!("不换行");`,
    },
    {
      title: 'Vec 常用操作',
      code: `let mut v: Vec<i64> = vec![3, 1, 2];
v.push(4);
v.sort();
let sum: i64 = v.iter().sum();
let max = *v.iter().max().unwrap();`,
    },
    {
      title: 'HashMap 计数',
      code: `use std::collections::HashMap;
let mut cnt = HashMap::new();
for x in arr { *cnt.entry(x).or_insert(0) += 1; }`,
    },
    {
      title: '迭代器链',
      code: `let evens: Vec<i64> = (1..=n).filter(|x| x % 2 == 0).collect();
let total: i64 = v.iter().map(|x| x * 2).sum();`,
    },
    {
      title: '字符串 String 与 &str',
      code: `let mut s = String::new();     // 可增长
s.push('a'); s.push_str("bc");
let t: &str = &s[0..2];        // 切片
for c in s.chars() { }         // 按字符遍历`,
    },
    {
      title: 'match 与 if let',
      code: `match opt {
    Some(v) => println!("得到 {}", v),
    None => println!("空"),
}
if let Some(v) = opt { }       // 只关心一种情况`,
    },
  ],
  bash: [
    {
      title: '我在哪 / 有什么',
      code: 'pwd        # 当前目录\nls -la     # 详细列表（含隐藏文件）',
    },
    {
      title: '看文件',
      code: 'cat file.txt        # 全部输出\nhead -n 5 file.txt  # 前 5 行\ntail -n 5 file.txt  # 后 5 行',
    },
    {
      title: '查找内容 grep',
      code: 'grep "关键词" file.txt   # 过滤行\ngrep -n "关键词" file.txt # 带行号\ngrep -i "abc" data.txt   # 忽略大小写',
    },
    {
      title: '统计 wc',
      code: 'wc -l file.txt   # 行数\nwc -w file.txt   # 单词数',
    },
    {
      title: '管道组合',
      code: 'cat data.txt | sort | uniq -c    # 排序后计数去重\ncat log.txt | grep ERROR | wc -l # 组合拳',
    },
    {
      title: '输出重定向',
      code: 'echo "hello" > out.txt   # 覆盖写入\necho "more" >> out.txt   # 追加',
    },
  ],
  kb: [
    {
      title: 'PARA 核心工作流',
      code: 'kb init                 # 初始化五区结构\nkb new 10-projects/x --title "标题"  # 新建笔记\nkb list                 # 浏览全部',
      note: 'Projects/Areas/Resources/Archives 四区 + 收件箱',
    },
    {
      title: '记录与链接',
      code: 'kb tag <slug> 标签名    # 追加标签\nkb link <slugA> <slugB> # 建立双向链接\nkb backlinks <slug>     # 查看反向链接',
      note: '双链是知识网络的骨架',
    },
    {
      title: '检索与发现',
      code: 'kb search 关键词        # 全库搜索\nkb tags                 # 标签统计\nkb stats                # 库存全景',
    },
    {
      title: '迁移与归类',
      code: 'kb move <slug> 20-areas # 移动到指定分区\nkb archive <slug>       # 归档完结内容',
      note: '每月整顿一次，收件箱清零',
    },
  ],
  git: [
    {
      title: '核心工作流（每天最常用）',
      code: 'git status              # 查看当前状态\ngit add .               # 暂存所有改动\ngit commit -m "修复登录报错"  # 提交（说清为什么改）',
      note: 'status → add → commit 三步循环',
    },
    {
      title: '分支操作',
      code: 'git switch -c feat/login   # 新建并切换分支\ngit switch main            # 切回主分支\ngit merge feat/login       # 合并分支',
      note: '一条分支一个功能，写完就合并',
    },
    {
      title: '远程协作',
      code: 'git remote add origin <url>  # 关联远程仓库\ngit push -u origin main      # 首次推送并建立跟踪\ngit pull                     # 拉取同事的更新',
      note: 'push 前先 pull，减少冲突',
    },
    {
      title: '查看历史与差异',
      code: 'git log --oneline      # 一行一条看历史\ngit diff               # 看未暂存的改动\ngit diff --staged      # 看已暂存的改动',
    },
  ],
  prompt: [
    {
      title: '结构化提问五要素骨架',
      code: `## 角色
你是一位熟悉 <技术栈> 的高级工程师。
## 任务
<一句话说清要做什么、交付什么>
## 上下文
<项目结构 / 已有代码 / 报错全文>
## 约束
- 使用 <指定技术栈>，不引入新依赖
- 不要修改 <范围外> 的代码
## 验收标准
- <可检查的完成条件>`,
      note: '五要素：角色 / 任务 / 上下文 / 约束 / 验收',
    },
    {
      title: '「不要做」边界清单',
      code: `## 不要做
- 不要实现登录（下一个 Phase 再做）
- 不要引入额外的状态管理库
- 不要重构范围外的文件`,
      note: '约束发散最有效的一招：明确禁止项',
    },
    {
      title: '有效反馈四段式',
      code: `1. 肯定：方向对了，主体逻辑可用
2. 问题：第 5 行 SQL 缺 WHERE，会全表扫描
3. 期望：加上 user_id 过滤，返回 422 而非 500
4. 上下文：这是 /api/users 的查询接口，QPS 约 200`,
      note: '肯定 → 问题 → 期望 → 上下文',
    },
    {
      title: 'Phase 规约文档骨架',
      code: `## 目标
实现用户注册 API
## 输入输出
POST /api/auth/register
Body: { email, password, name }
200: { token, user }  400: { error }
## 验收
- bcrypt 哈希密码，返回 JWT
- 邮箱重复返回 400
## 不要做
- 不做邮箱验证（Phase 3）`,
      note: '一个 Phase 一份规约，AI 照单执行',
    },
  ],
  cpp: [
    {
      title: 'IO 加速三件套（大输入必加）',
      code: `std::ios::sync_with_stdio(false);
std::cin.tie(nullptr);
// 之后 cin >> 与大量读入快很多`,
    },
    {
      title: '读入与输出',
      code: `int n; std::cin >> n;
std::cout << n << "\\n";        // \\n 比 endl 快
std::string line;
std::getline(std::cin, line);  // 读整行`,
    },
    {
      title: 'vector 常用操作',
      code: `std::vector<int> v;
v.push_back(42);
v.size(); v.back(); v.pop_back();
std::sort(v.begin(), v.end()); // 需 <algorithm>`,
    },
    {
      title: '自定义排序（lambda）',
      code: `std::sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;   // 降序
});`,
    },
    {
      title: 'map / unordered_map 计数',
      code: `std::map<std::string, int> cnt;   // 有序
cnt["apple"]++;
for (auto& [k, v] : cnt) { }      // C++17 结构化绑定
// unordered_map 更快但不保序`,
    },
    {
      title: 'string 常用操作',
      code: `s.size(); s.length();
s.substr(1, 3);            // 截取
s.find("ab");              // 下标，找不到= npos
std::to_string(42);        // 数字 → 字符串
std::stoi(s);              // 字符串 → int`,
    },
    {
      title: '范围 for 与结构化绑定',
      code: `for (int x : v) { }
for (auto& [k, v] : mp) { }  // C++17
for (int i = 0; i < n; i++) { }`,
    },
    {
      title: '常用数学与工具',
      code: `#include <cmath>
std::abs(x); std::sqrt(x);
std::max(a, b); std::minmax(a, b);
std::swap(a, b);`,
    },
  ],
};
