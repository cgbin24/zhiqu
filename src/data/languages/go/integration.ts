import type { Level } from '@/types';

/** Go · 第六章：跨领域融会贯通（5 关） */
export const GO_INTEGRATION: Level[] = [
  {
    id: 'go-integration-1',
    lang: 'go',
    module: 'integration',
    order: 1,
    title: '词频统计器',
    difficulty: 4,
    xp: 35,
    goals: [
      '综合 strings.Fields + map 完成词频统计',
      '用 sort.Slice 写"次数降序、字典序升序"复合比较器',
      '输出前 k 名并处理 k 超出种类数的情况',
    ],
    brief: `## 综合实战：词频统计

这关把三块知识焊在一起：

1. **strings.Fields** 把一行文本按空白切成单词切片；
2. **map[string]int** 统计词频（不存在则置 1，存在则 ++）；
3. **sort.Slice** 自定义比较器排序输出。

\`\`\`go
freq := make(map[string]int)
for _, w := range strings.Fields(text) {
    freq[w]++
}

sort.Slice(ps, func(i, j int) bool {
    if ps[i].count != ps[j].count {
        return ps[i].count > ps[j].count // 次数多的在前
    }
    return ps[i].word < ps[j].word // 并列按字典序
})
\`\`\`

**并列规则**必须写进比较器，否则 map 的随机遍历会让并列单词的输出顺序抖动 —— 判题就翻车了。

> ⚠️ sort.Slice 不是稳定排序；只要比较器能分出完全确定的先后（本关"次数 + 字典序"即全序），结果就稳定。真需要保序用 sort.SliceStable。`,
    task: `## 任务：词频统计器

读入两行：第一行是一段英文文本（单词以空格分隔），第二行是整数 k。统计词频并输出前 k 名。

**输入**：

- 第 1 行：英文文本
- 第 2 行：整数 k（1 ≤ k ≤ 20）

**输出**：

- 第一行：\`共 <m> 种单词\`（m 为不同单词数）
- 接下来最多 k 行：\`<名次>. <word>: <count>\`，按**次数降序**，并列按**字典序升序**；不足 k 个就输出全部

### 示例

| 输入 | 输出 |
| --- | --- |
| \`the quick brown fox jumps over the lazy dog the fox\`<br>\`3\` | \`共 8 种单词\`<br>\`1. the: 3\`<br>\`2. fox: 2\`<br>\`3. brown: 1\` |
| \`go go go rust go\`<br>\`2\` | \`共 2 种单词\`<br>\`1. go: 4\`<br>\`2. rust: 1\` |`,
    starter: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type pair struct {
	word  string
	count int
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Buffer(make([]byte, 1024*1024), 1024*1024)
	if !sc.Scan() {
		return
	}
	text := strings.TrimSpace(sc.Text())
	if !sc.Scan() {
		return
	}
	kLine := strings.TrimSpace(sc.Text())
	_ = kLine

	// TODO 1: 补 import "strconv" 和 "sort"；strconv.Atoi(kLine) 得到 k
	// TODO 2: freq := map[string]int，用 strings.Fields(text) 统计词频
	// TODO 3: 把 (word, count) 收集进 []pair
	// TODO 4: sort.Slice：次数降序，并列时字典序升序
	// TODO 5: 打印"共 m 种单词"和前 k 名"i. word: count"
	fmt.Println(strings.Fields(text))
}
`,
    solution: `package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

type pair struct {
	word  string
	count int
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Buffer(make([]byte, 1024*1024), 1024*1024)
	if !sc.Scan() {
		return
	}
	text := strings.TrimSpace(sc.Text())
	if !sc.Scan() {
		return
	}
	kLine := strings.TrimSpace(sc.Text())
	k, err := strconv.Atoi(kLine)
	if err != nil {
		return
	}

	freq := make(map[string]int)
	for _, w := range strings.Fields(text) {
		freq[w]++
	}

	ps := make([]pair, 0, len(freq))
	for w, c := range freq {
		ps = append(ps, pair{w, c})
	}
	sort.Slice(ps, func(i, j int) bool {
		if ps[i].count != ps[j].count {
			return ps[i].count > ps[j].count
		}
		return ps[i].word < ps[j].word
	})

	if k > len(ps) {
		k = len(ps)
	}
	fmt.Printf("共 %d 种单词\\n", len(ps))
	for i := 0; i < k; i++ {
		fmt.Printf("%d. %s: %d\\n", i+1, ps[i].word, ps[i].count)
	}
}
`,
    hints: [
      '两行输入都要用 bufio.Scanner 读（骨架已给出）。第二行 strconv.Atoi 转成 k。词频统计三行：`freq := make(map[string]int)` + 循环 `freq[w]++`。',
      'map 无序，必须收集进切片再排序：`sort.Slice(ps, func(i, j int) bool { if ps[i].count != ps[j].count { return ps[i].count > ps[j].count }; return ps[i].word < ps[j].word })`。',
      '输出前先夹住 k：`if k > len(ps) { k = len(ps) }`。首行 `fmt.Printf("共 %d 种单词\\n", len(ps))`，名次行 `fmt.Printf("%d. %s: %d\\n", i+1, ps[i].word, ps[i].count)`（注意序号后是英文句点）。',
    ],
    tests: [
      {
        name: '样例：the fox 三连',
        stdin: 'the quick brown fox jumps over the lazy dog the fox\n3\n',
        expected: '共 8 种单词\n1. the: 3\n2. fox: 2\n3. brown: 1',
      },
      {
        name: '样例：go 四连',
        stdin: 'go go go rust go\n2\n',
        expected: '共 2 种单词\n1. go: 4\n2. rust: 1',
      },
      {
        name: '隐藏：k 超过种类数',
        stdin: 'b a b a c\n5\n',
        expected: '共 3 种单词\n1. a: 2\n2. b: 2\n3. c: 1',
        hidden: true,
      },
      {
        name: '隐藏：单一单词',
        stdin: 'x\n1\n',
        expected: '共 1 种单词\n1. x: 1',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-integration-2',
    lang: 'go',
    module: 'integration',
    order: 2,
    title: 'LRU 缓存',
    difficulty: 5,
    xp: 45,
    goals: [
      '理解 LRU：容量有限，淘汰最久未使用的 key',
      '用 map 存值 + 切片维护使用顺序实现',
      '处理"put 已存在 key 不触发淘汰但要提升新鲜度"',
    ],
    brief: `## LRU 缓存

LRU（Least Recently Used）缓存：容量有限，满了就淘汰**最久没被用过**的 key。两个核心操作：

- **Get(k)**：命中返回值，并把 k 提为"最近使用"；未命中返回 -1。
- **Put(k, v)**：写入/更新 k；若 k 是新 key 且已满，先淘汰最久未用的。

## 实现：map + 顺序表

标准库有现成的 container/list（双向链表），配 map 可以做到 O(1)。数据量小的时候，用 **map 存值 + 切片维护使用顺序**（\`order[0]\` 最久未用、尾部最近使用）更直观：

\`\`\`go
type LRU struct {
    capacity int
    data     map[string]int
    order    []string
}

func (l *LRU) touch(key string) { // 提升到"最近使用"端
    for i, k := range l.order {
        if k == key {
            l.order = append(l.order[:i], l.order[i+1:]...)
            break
        }
    }
    l.order = append(l.order, key)
}
\`\`\`

> ⚠️ 两个易错点：put 已存在的 key **不算新增、不触发淘汰**，但要提升新鲜度；get 命中也要提升。淘汰的是 \`order[0]\`。`,
    task: `## 任务：迷你 LRU

实现简化版 LRU 并处理一串操作：

- \`put k v\`：写入/更新；新 key 且已满时，先打印 \`淘汰 <k>=<v>\`（被淘汰者）再写入
- \`get k\`：命中打印 \`get <k> = <v>\` 并提升新鲜度；未命中打印 \`get <k> = -1\`
- 全部操作后打印 \`最终缓存: <k=v, k=v, ...>\`（**最近使用在前**，逗号+空格分隔；put 不产生输出）

**输入**：

- 第 1 行：容量 c（1 ≤ c ≤ 3）
- 第 2 行：操作数 n（1 ≤ n ≤ 20）
- 后续 n 行：\`put k v\` 或 \`get k\`（k 为不含空格的单词，v 为整数）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`2\`<br>\`6\`<br>\`put a 1\`<br>\`put b 2\`<br>\`get a\`<br>\`put c 3\`<br>\`get b\`<br>\`get a\` | \`get a = 1\`<br>\`淘汰 b=2\`<br>\`get b = -1\`<br>\`get a = 1\`<br>\`最终缓存: a=1, c=3\` |

（put c 时缓存里有 a、b，其中 a 刚被 get 过，最久未用的是 b，淘汰 b。）`,
    starter: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// TODO 1: 设计 LRU 结构：capacity、data map[string]int、order []string（尾部 = 最近使用）
// TODO 2: 实现 Get(key)：命中返回 (值, true) 并提升新鲜度；未命中返回 (0, false)
// TODO 3: 实现 Put(key, val)：新 key 且已满 → 淘汰 order[0] 并打印"淘汰 k=v"
//   更新/写入后把 key 挪到 order 尾部

func main() {
	sc := bufio.NewScanner(os.Stdin)
	readLine := func() string {
		if sc.Scan() {
			return strings.TrimSpace(sc.Text())
		}
		return ""
	}

	capacity, _ := strconv.Atoi(readLine())
	n, _ := strconv.Atoi(readLine())

	// TODO 4: 循环处理 n 条命令：put k v / get k（用 strings.Fields 切分）
	// TODO 5: 最后打印"最终缓存: ..."（从最近使用到最久未用）
	fmt.Println(capacity, n)
}
`,
    solution: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type LRU struct {
	capacity int
	data     map[string]int
	order    []string // order[0] 最久未使用，尾部最近使用
}

func NewLRU(capacity int) *LRU {
	return &LRU{capacity: capacity, data: make(map[string]int)}
}

// touch 把 key 挪到"最近使用"端（尾部）
func (l *LRU) touch(key string) {
	for i, k := range l.order {
		if k == key {
			l.order = append(l.order[:i], l.order[i+1:]...)
			break
		}
	}
	l.order = append(l.order, key)
}

func (l *LRU) Get(key string) (int, bool) {
	v, ok := l.data[key]
	if ok {
		l.touch(key)
	}
	return v, ok
}

func (l *LRU) Put(key string, val int) {
	_, exists := l.data[key]
	if !exists && len(l.order) >= l.capacity && len(l.order) > 0 {
		victim := l.order[0]
		fmt.Printf("淘汰 %s=%d\\n", victim, l.data[victim])
		delete(l.data, victim)
		l.order = l.order[1:]
	}
	l.data[key] = val
	l.touch(key)
}

func (l *LRU) Dump() string {
	parts := make([]string, 0, len(l.order))
	for i := len(l.order) - 1; i >= 0; i-- { // 从最近使用到最久未用
		k := l.order[i]
		parts = append(parts, fmt.Sprintf("%s=%d", k, l.data[k]))
	}
	return strings.Join(parts, ", ")
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	readLine := func() string {
		if sc.Scan() {
			return strings.TrimSpace(sc.Text())
		}
		return ""
	}

	capacity, _ := strconv.Atoi(readLine())
	n, _ := strconv.Atoi(readLine())
	lru := NewLRU(capacity)

	for i := 0; i < n; i++ {
		fields := strings.Fields(readLine())
		switch fields[0] {
		case "put":
			v, _ := strconv.Atoi(fields[2])
			lru.Put(fields[1], v)
		case "get":
			if v, ok := lru.Get(fields[1]); ok {
				fmt.Printf("get %s = %d\\n", fields[1], v)
			} else {
				fmt.Printf("get %s = -1\\n", fields[1])
			}
		}
	}
	fmt.Printf("最终缓存: %s\\n", lru.Dump())
}
`,
    hints: [
      'order 切片两端语义定死：order[0] 最久未用、尾部最近用。touch 三步：找到就删掉、再 append 到尾部。Get 命中和 Put 更新都要 touch。',
      '淘汰只发生在"新 key 且已满"时：victim := order[0]，先打印 `fmt.Printf("淘汰 %s=%d\\n", victim, l.data[victim])`，再 delete 并 `order = order[1:]`。已存在的 key 只更新值 + touch。',
      '最终缓存从尾部往头部遍历（最近使用在前），拼成 `k=v` 用 ", " 连接，打印 `fmt.Printf("最终缓存: %s\\n", ...)`。示例里 put c 淘汰的是 b（a 刚被 get 提新鲜）。',
    ],
    tests: [
      {
        name: '样例：容量 2 淘汰 b',
        stdin: '2\n6\nput a 1\nput b 2\nget a\nput c 3\nget b\nget a\n',
        expected: 'get a = 1\n淘汰 b=2\nget b = -1\nget a = 1\n最终缓存: a=1, c=3',
      },
      {
        name: '样例：容量 3',
        stdin: '3\n6\nput x 10\nput y 20\nput z 30\nget x\nput w 40\nget y\n',
        expected: 'get x = 10\n淘汰 y=20\nget y = -1\n最终缓存: w=40, x=10, z=30',
      },
      {
        name: '隐藏：更新不淘汰',
        stdin: '2\n5\nput a 1\nput a 9\nput b 2\nput c 3\nget a\n',
        expected: '淘汰 a=9\nget a = -1\n最终缓存: c=3, b=2',
        hidden: true,
      },
      {
        name: '隐藏：容量 1',
        stdin: '1\n4\nput k 5\nget k\nput m 6\nget k\n',
        expected: 'get k = 5\n淘汰 k=5\nget k = -1\n最终缓存: m=6',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-integration-3',
    lang: 'go',
    module: 'integration',
    order: 3,
    title: '并发任务池',
    difficulty: 4,
    xp: 40,
    goals: [
      '搭建"固定 worker 数 + 任务 channel + 结果 channel"流水线',
      '用 close(taskCh) 通知收工、WaitGroup 等待退出',
      '用下标回填结果，保证输出顺序与调度无关',
    ],
    brief: `## Worker Pool：固定工人数的流水线

无限开协程会打爆内存，工程上用**固定数量的 worker** 反复从任务 channel 领活：

\`\`\`go
taskCh := make(chan int)
for i := 0; i < workers; i++ {
    go func() {
        for idx := range taskCh { // 有活就干，通道关了就退
            resultCh <- result{idx, ...}
        }
    }()
}
\`\`\`

## 关键三步

1. **派发**：main 把任务下标发进 taskCh；
2. **收工信号**：\`close(taskCh)\`，worker 的 range 随之结束；
3. **汇总**：每个结果带上下标，主协程按 \`outputs[idx]\` 回填 —— 因为**哪个 worker 抢到哪个任务是随机的**，输出顺序必须由下标保证。

这套"任务通道 + 结果通道 + WaitGroup 收尸"是 Go 并发最经典的骨架。

> ⚠️ 结果 channel 带缓冲（容量 = 任务数）可以让 worker 发完就走，避免阻塞；也绝不要在 worker 里打印 —— 顺序会乱。`,
    task: `## 任务：平方加工厂

读入 w 和 n：启动 **w 个固定 worker**，从任务 channel 领取 n 个任务（第 i 个任务的输入是 nums[i]），把结果 ×10 后汇总。结果带下标回填，按任务顺序输出。

**输入**：第一行：w n（1 ≤ w ≤ 8，1 ≤ n ≤ 50）；第二行：n 个整数

**输出**：

1. \`启动 <w> 个 worker 处理 <n> 个任务\`
2. 每个任务一行（按输入顺序）：\`任务<i>: <x> => <x*10>\`
3. \`汇总: <n> 个任务, 结果总和 = <所有结果之和>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`2 5\`<br>\`5 10 15 20 25\` | \`启动 2 个 worker 处理 5 个任务\`<br>\`任务1: 5 => 50\`<br>\`任务2: 10 => 100\`<br>\`任务3: 15 => 150\`<br>\`任务4: 20 => 200\`<br>\`任务5: 25 => 250\`<br>\`汇总: 5 个任务, 结果总和 = 750\` |`,
    starter: `package main

import (
	"fmt"
)

type result struct {
	idx  int
	text string
}

func main() {
	var w, n int
	fmt.Scan(&w, &n)
	jobs := make([]int, n)
	for i := range jobs {
		fmt.Scan(&jobs[i])
	}

	fmt.Printf("启动 %d 个 worker 处理 %d 个任务\\n", w, n)

	// TODO 1: 补 import "sync"；taskCh := make(chan int)，resultCh := make(chan result, n)
	// TODO 2: 启动 w 个 worker：for idx := range taskCh 处理后发送 result{idx, ...}
	// TODO 3: main 把 0..n-1 发进 taskCh 后 close(taskCh)，用 WaitGroup 等 worker 退场
	// TODO 4: 按 outputs[idx] 回填并打印"任务i: x => x*10"（顺序必须与输入一致！）
	// TODO 5: 打印"汇总: n 个任务, 结果总和 = s"
}
`,
    solution: `package main

import (
	"fmt"
	"sync"
)

type result struct {
	idx  int
	text string
}

func main() {
	var w, n int
	fmt.Scan(&w, &n)
	jobs := make([]int, n)
	for i := range jobs {
		fmt.Scan(&jobs[i])
	}

	fmt.Printf("启动 %d 个 worker 处理 %d 个任务\\n", w, n)

	taskCh := make(chan int)         // 任务通道（无缓冲）
	resultCh := make(chan result, n) // 结果通道：带缓冲，worker 发完就走
	var wg sync.WaitGroup

	// 固定数量的 worker：都从同一个任务通道领活
	for i := 0; i < w; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for idx := range taskCh {
				x := jobs[idx]
				resultCh <- result{idx, fmt.Sprintf("任务%d: %d => %d", idx+1, x, x*10)}
			}
		}()
	}

	// 派发任务：发完就 close，worker 的 range 随之结束
	for i := range jobs {
		taskCh <- i
	}
	close(taskCh)
	wg.Wait()
	close(resultCh)

	// 哪个 worker 抢到哪个任务是随机的，输出顺序靠下标回填保证
	outputs := make([]string, n)
	for r := range resultCh {
		outputs[r.idx] = r.text
	}
	for _, line := range outputs {
		fmt.Println(line)
	}

	total := 0
	for _, x := range jobs {
		total += x * 10
	}
	fmt.Printf("汇总: %d 个任务, 结果总和 = %d\\n", n, total)
}
`,
    hints: [
      'worker 是"循环领活"而不是"一人一活"：`go func() { defer wg.Done(); for idx := range taskCh { resultCh <- result{idx, ...} } }()`，启动 w 个。记得补 import "sync"。',
      '收工三连：main 发完所有下标后 `close(taskCh)` → worker 的 range 退出 → `wg.Wait()` → `close(resultCh)`。结果通道带缓冲 `make(chan result, n)`，worker 不会卡在发送上。',
      '顺序保证：worker 只发 result{idx, text}，main 用 `outputs[r.idx] = r.text` 回填，最后按 outputs 顺序打印"任务%d: %d => %d"。汇总 = 所有 x*10 之和。',
    ],
    tests: [
      {
        name: '样例：2 worker 5 任务',
        stdin: '2 5\n5 10 15 20 25\n',
        expected: '启动 2 个 worker 处理 5 个任务\n任务1: 5 => 50\n任务2: 10 => 100\n任务3: 15 => 150\n任务4: 20 => 200\n任务5: 25 => 250\n汇总: 5 个任务, 结果总和 = 750',
      },
      {
        name: '样例：3 worker 3 任务',
        stdin: '3 3\n1 2 3\n',
        expected: '启动 3 个 worker 处理 3 个任务\n任务1: 1 => 10\n任务2: 2 => 20\n任务3: 3 => 30\n汇总: 3 个任务, 结果总和 = 60',
      },
      {
        name: '隐藏：单 worker',
        stdin: '1 4\n9 8 7 6\n',
        expected: '启动 1 个 worker 处理 4 个任务\n任务1: 9 => 90\n任务2: 8 => 80\n任务3: 7 => 70\n任务4: 6 => 60\n汇总: 4 个任务, 结果总和 = 300',
        hidden: true,
      },
      {
        name: '隐藏：全零任务',
        stdin: '4 2\n0 0\n',
        expected: '启动 4 个 worker 处理 2 个任务\n任务1: 0 => 0\n任务2: 0 => 0\n汇总: 2 个任务, 结果总和 = 0',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-integration-4',
    lang: 'go',
    module: 'integration',
    order: 4,
    title: 'JSON 解析器',
    difficulty: 4,
    xp: 35,
    goals: [
      '用 struct tag 声明 JSON 字段映射',
      '用 json.Unmarshal 反序列化到结构体',
      '综合切片遍历求平均分',
    ],
    brief: `## JSON ↔ Go 结构体

encoding/json 是标准库的 JSON 编解码器。用 **struct tag** 声明字段映射：

\`\`\`go
type Player struct {
    Name   string    \`json:"name"\`
    Age    int       \`json:"age"\`
    Scores []float64 \`json:"scores"\`
}

var p Player
err := json.Unmarshal([]byte(text), &p)
\`\`\`

要点：

- 反序列化用 Unmarshal，参数是 []byte 和**结构体指针**；
- tag 不写则默认按字段名匹配（大小写不敏感），显式写出更清晰；
- JSON 数组 → 切片，数字默认解析为 float64（除非结构体字段声明了 int）；
- 解析失败（非法 JSON）返回 err，务必检查。

> ⚠️ 常见坑：Unmarshal 的第二个参数忘了 \`&\`，等于没解析进去；字段不可导出（小写开头）也会被 json 忽略。`,
    task: `## 任务：玩家档案解析

从标准输入读入一行 JSON（形如下例），解析到结构体并输出档案报告。

**输入**：一行 JSON：\`{"name":"...","age":...,"scores":[...]}\`

**输出**（四行）：

1. \`姓名: <name>\`
2. \`年龄: <age>\`
3. \`成绩: <切片 %v 形式>\`
4. \`平均: <平均分, 保留 2 位小数>\`

**输入保证 JSON 合法且 scores 非空。**

### 示例

| 输入 | 输出 |
| --- | --- |
| \`{"name":"Alice","age":20,"scores":[90,85]}\` | \`姓名: Alice\`<br>\`年龄: 20\`<br>\`成绩: [90 85]\`<br>\`平均: 87.50\` |
| \`{"name":"Bob","age":16,"scores":[77.5,88.5]}\` | \`姓名: Bob\`<br>\`年龄: 16\`<br>\`成绩: [77.5 88.5]\`<br>\`平均: 83.00\` |`,
    starter: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Buffer(make([]byte, 1024*1024), 1024*1024)
	if !sc.Scan() {
		return
	}
	line := strings.TrimSpace(sc.Text())

	// TODO 1: 定义 Player 结构体（Name/Age/Scores），用 struct tag 映射 name/age/scores
	// TODO 2: 补 import "encoding/json"；json.Unmarshal([]byte(line), &p)，检查 err
	// TODO 3: 打印姓名、年龄、成绩（%v 打印切片）
	// TODO 4: 计算并打印平均分（%.2f）
	fmt.Println(line)
}
`,
    solution: `package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// struct tag 决定 JSON 字段如何映射到 Go 字段
type Player struct {
	Name   string    \`json:"name"\`
	Age    int       \`json:"age"\`
	Scores []float64 \`json:"scores"\`
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Buffer(make([]byte, 1024*1024), 1024*1024)
	if !sc.Scan() {
		return
	}
	line := strings.TrimSpace(sc.Text())

	var p Player
	if err := json.Unmarshal([]byte(line), &p); err != nil {
		fmt.Printf("JSON 解析失败: %v\\n", err)
		return
	}

	fmt.Printf("姓名: %s\\n", p.Name)
	fmt.Printf("年龄: %d\\n", p.Age)
	fmt.Printf("成绩: %v\\n", p.Scores)

	sum := 0.0
	for _, s := range p.Scores {
		sum += s
	}
	avg := 0.0
	if len(p.Scores) > 0 {
		avg = sum / float64(len(p.Scores))
	}
	fmt.Printf("平均: %.2f\\n", avg)
}
`,
    hints: [
      'struct tag 写在字段后的反引号里：`Name string ` + "`json:"name"`"，其余同理。Scores 用 []float64，JSON 数字数组直接映射。',
      '反序列化：`var p Player; err := json.Unmarshal([]byte(line), &p)` —— 第二个参数必须传 &p。题目保证合法，但 err 分支还是要写。',
      '成绩切片用 %v 打印（[90 85]）。平均分：循环累加 sum，`avg = sum / float64(len(p.Scores))`，用 %.2f 输出（87.5 显示为 87.50）。',
    ],
    tests: [
      {
        name: '样例：Alice',
        stdin: '{"name":"Alice","age":20,"scores":[90,85]}\n',
        expected: '姓名: Alice\n年龄: 20\n成绩: [90 85]\n平均: 87.50',
      },
      {
        name: '样例：Bob 小数分',
        stdin: '{"name":"Bob","age":16,"scores":[77.5,88.5]}\n',
        expected: '姓名: Bob\n年龄: 16\n成绩: [77.5 88.5]\n平均: 83.00',
      },
      {
        name: '隐藏：单项满分',
        stdin: '{"name":"Cindy","age":22,"scores":[100]}\n',
        expected: '姓名: Cindy\n年龄: 22\n成绩: [100]\n平均: 100.00',
        hidden: true,
      },
      {
        name: '隐藏：三项成绩',
        stdin: '{"name":"Dan","age":30,"scores":[60,70,80]}\n',
        expected: '姓名: Dan\n年龄: 30\n成绩: [60 70 80]\n平均: 70.00',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-integration-5',
    lang: 'go',
    module: 'integration',
    order: 5,
    title: '待办事项解析器',
    difficulty: 4,
    xp: 40,
    goals: [
      '逐行读入并解析 add / done / list 命令',
      '用 strings.Cut 分离命令与参数（支持带空格内容）',
      '对非法输入给出确定的反馈（防御式编程）',
    ],
    brief: `## 命令解析器：迷你 REPL

逐行读入命令、解析、执行、反馈 —— 这就是一切 REPL/命令行工具的骨架：

\`\`\`go
cmd, rest, _ := strings.Cut(line, " ") // 按第一个空格切开
switch cmd {
case "add":
    items = append(items, todo{text: rest})
case "done":
    idx, _ := strconv.Atoi(rest) // 记得校验范围！
    items[idx-1].done = true
case "list":
    ...
}
\`\`\`

新工具 strings.Cut（Go 1.18+）：一次返回分隔符前后的两段，比 SplitN 更顺手，且 rest 保留原文（支持带空格的待办内容）。

防御式编程：done 的编号可能越界、list 可能没数据 —— 每种输入都要有确定的输出反馈，程序才像"产品"而不是"脚本"。

> ⚠️ 切片下标从 0 开始，但给用户看的编号从 1 开始 —— 换算处最容易差一。`,
    task: `## 任务：待办事项解析器

读入命令并逐条执行，维护一个待办列表：

- \`add <内容>\`：追加待办（内容可含空格），打印 \`已添加: <内容>\`
- \`done <编号>\`：把第编号项（1 起）标记完成，打印 \`完成: <内容>\`；编号非法或越界打印 \`无效编号: <原始参数>\`
- \`list\`：逐行打印 \`<i>. [ ] <内容>\`（未完成）或 \`<i>. [x] <内容>\`（已完成），i 从 1 起；列表为空打印 \`（空）\`

最后打印 \`共 <n> 项, 已完成 <m> 项\`。

**输入**：第一行 n（命令条数，1 ≤ n ≤ 20）；后续 n 行命令

### 示例

| 输入 | 输出 |
| --- | --- |
| \`4\`<br>\`add 写周报\`<br>\`add 买牛奶\`<br>\`done 1\`<br>\`list\` | \`已添加: 写周报\`<br>\`已添加: 买牛奶\`<br>\`完成: 写周报\`<br>\`1. [x] 写周报\`<br>\`2. [ ] 买牛奶\`<br>\`共 2 项, 已完成 1 项\` |`,
    starter: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type todo struct {
	text string
	done bool
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	readLine := func() string {
		if sc.Scan() {
			return strings.TrimSpace(sc.Text())
		}
		return ""
	}

	n, _ := strconv.Atoi(readLine())
	items := make([]todo, 0, n)

	for i := 0; i < n; i++ {
		line := readLine()
		cmd, rest, _ := strings.Cut(line, " ")
		switch cmd {
		case "add":
			// 已给出示例：追加并打印
			items = append(items, todo{text: rest})
			fmt.Printf("已添加: %s\\n", rest)
		case "done":
			// TODO 2: Atoi(rest) 并校验 1 <= idx <= len(items)
			//   合法 → 标记完成并打印"完成: <text>"
			//   越界 → 打印"无效编号: <rest>"
			fmt.Println("待实现 done:", rest)
		case "list":
			// TODO 3: 逐行打印"i. [x] text"或"i. [ ] text"，空列表打印"（空）"
			fmt.Println("待实现 list")
		}
	}

	// TODO 4: 打印"共 x 项, 已完成 y 项"
}
`,
    solution: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type todo struct {
	text string
	done bool
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	readLine := func() string {
		if sc.Scan() {
			return strings.TrimSpace(sc.Text())
		}
		return ""
	}

	n, _ := strconv.Atoi(readLine())
	items := make([]todo, 0, n)

	for i := 0; i < n; i++ {
		line := readLine()
		cmd, rest, _ := strings.Cut(line, " ")
		switch cmd {
		case "add":
			items = append(items, todo{text: rest})
			fmt.Printf("已添加: %s\\n", rest)
		case "done":
			idx, err := strconv.Atoi(strings.TrimSpace(rest))
			if err != nil || idx < 1 || idx > len(items) {
				fmt.Printf("无效编号: %s\\n", rest)
				continue
			}
			items[idx-1].done = true
			fmt.Printf("完成: %s\\n", items[idx-1].text)
		case "list":
			if len(items) == 0 {
				fmt.Println("（空）")
			}
			for j, it := range items {
				mark := "[ ]"
				if it.done {
					mark = "[x]"
				}
				fmt.Printf("%d. %s %s\\n", j+1, mark, it.text)
			}
		}
	}

	doneCount := 0
	for _, it := range items {
		if it.done {
			doneCount++
		}
	}
	fmt.Printf("共 %d 项, 已完成 %d 项\\n", len(items), doneCount)
}
`,
    hints: [
      'strings.Cut(line, " ") 返回（前段, 后段, 是否切到）：`add 写周报` → cmd="add"、rest="写周报"。rest 是第一个空格之后的全部原文，带空格的内容也不会丢。',
      'done 的防御：`idx, err := strconv.Atoi(strings.TrimSpace(rest))`，err 非 nil 或 `idx < 1 || idx > len(items)` 都打印 `fmt.Printf("无效编号: %s\\n", rest)`。合法时注意下标是 idx-1。',
      'list 行格式：`fmt.Printf("%d. %s %s\\n", j+1, mark, it.text)`，mark 是 "[x]" 或 "[ ]"。空列表单独打印"（空）"（中文全角括号），最后一行统计用两个 %d。',
    ],
    tests: [
      {
        name: '样例：完整流程',
        stdin: '4\nadd 写周报\nadd 买牛奶\ndone 1\nlist\n',
        expected: '已添加: 写周报\n已添加: 买牛奶\n完成: 写周报\n1. [x] 写周报\n2. [ ] 买牛奶\n共 2 项, 已完成 1 项',
      },
      {
        name: '样例：带空格内容',
        stdin: '3\nadd 学习 Go\nlist\ndone 1\n',
        expected: '已添加: 学习 Go\n1. [ ] 学习 Go\n完成: 学习 Go\n共 1 项, 已完成 1 项',
      },
      {
        name: '隐藏：空列表与越界',
        stdin: '4\nlist\nadd A\ndone 5\nlist\n',
        expected: '（空）\n已添加: A\n无效编号: 5\n1. [ ] A\n共 1 项, 已完成 0 项',
        hidden: true,
      },
      {
        name: '隐藏：完成第三项',
        stdin: '5\nadd x\nadd y\nadd z\ndone 3\nlist\n',
        expected: '已添加: x\n已添加: y\n已添加: z\n完成: z\n1. [ ] x\n2. [ ] y\n3. [x] z\n共 3 项, 已完成 1 项',
        hidden: true,
      },
      {
        name: '隐藏：空列表上 done',
        stdin: '2\ndone 1\nadd q\n',
        expected: '无效编号: 1\n已添加: q\n共 1 项, 已完成 0 项',
        hidden: true,
      },
    ],
  },
];
