import type { LanguageDef, LanguageId } from '@/types';

/**
 * 语言注册表 —— 可扩展架构的核心：
 * 新增语言 = 增加一个 LanguageDef + 对应章节内容文件，其余零改动。
 *
 * 执行引擎：Godbolt 为主（编译器版本最新），Wandbox 为备。
 */
export const LANGUAGES: LanguageDef[] = [
  {
    id: 'go',
    name: 'Go',
    tagline: '简洁、高效、为并发而生',
    color: '#00add8',
    gradient: 'from-cyan-500 to-sky-400',
    monaco: 'go',
    fileName: 'main.go',
    executor: { godboltId: 'gl1260', wandboxId: 'go-1.23.2' },
    template: `package main

import "fmt"

func main() {
	fmt.Println("Hello, Go Quest!")
}
`,
  },
  {
    id: 'rust',
    name: 'Rust',
    tagline: '无畏并发，内存安全',
    color: '#f74c00',
    gradient: 'from-orange-500 to-amber-400',
    monaco: 'rust',
    fileName: 'main.rs',
    executor: { godboltId: 'r1990', wandboxId: 'rust-1.69.0' },
    template: `fn main() {
    println!("Hello, Rust Quest!");
}
`,
  },
  {
    id: 'cpp',
    name: 'C++',
    tagline: '极致性能，掌控一切',
    color: '#659ad2',
    gradient: 'from-blue-500 to-indigo-400',
    monaco: 'cpp',
    fileName: 'main.cpp',
    executor: { godboltId: 'g162', godboltArgs: '-std=c++20', wandboxId: 'gcc-13.2.0' },
    template: `#include <iostream>

int main() {
    std::cout << "Hello, C++ Quest!" << std::endl;
    return 0;
}
`,
  },
];

export const LANG_MAP: Record<LanguageId, LanguageDef> = Object.fromEntries(
  LANGUAGES.map((l) => [l.id, l]),
) as Record<LanguageId, LanguageDef>;

export function getLang(id: string | undefined): LanguageDef | undefined {
  return LANGUAGES.find((l) => l.id === id);
}
