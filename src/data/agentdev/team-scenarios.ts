/**
 * 团队指挥室大屏的内置项目场景。
 * project 结构与 team-sim.js 引擎入参一致；defaultSetup 是"一键演示"的推荐团队配置，
 * 大屏上的管理策略（护栏/升级策略）可实时修改后重新运行，观察结局变化。
 */

import type { TeamSetup } from '@/judge/team-sim';

export interface TeamScenario {
  id: string;
  name: string;
  desc: string;
  project: { name: string; tasks: TeamScenarioTask[] };
  defaultSetup: TeamSetup;
}

export interface TeamScenarioTask {
  id: string;
  title: string;
  type: string;
  deps?: string[];
  needsEscalation?: boolean;
  blockReason?: string;
  misuse?: { tool: string };
  reviewFails?: boolean;
}

export const TEAM_SCENARIOS: TeamScenario[] = [
  {
    id: 'website',
    name: '🌐 官网改版 v2',
    desc: '标准五段流水线：需求 → 设计 → 前后端并行 → 联调测试，适合第一次看团队怎么转',
    project: {
      name: '官网改版 v2',
      tasks: [
        { id: 'T1', title: '撰写需求文档', type: 'plan' },
        { id: 'T2', title: '首页视觉设计', type: 'design', deps: ['T1'] },
        { id: 'T3', title: '前端页面开发', type: 'frontend', deps: ['T2'] },
        { id: 'T4', title: '后端接口开发', type: 'backend', deps: ['T1'] },
        { id: 'T5', title: '接口联调测试', type: 'test', deps: ['T3', 'T4'] },
      ],
    },
    defaultSetup: {
      roles: [
        { id: 'pm', name: '项目经理', skills: ['plan'], tools: ['board'] },
        { id: 'de', name: '设计师', skills: ['design'], tools: ['figma'] },
        { id: 'fe', name: '前端工程', skills: ['frontend'], tools: ['code'] },
        { id: 'be', name: '后端工程', skills: ['backend'], tools: ['code'] },
        { id: 'qa', name: '测试工程', skills: ['test'], tools: ['test'] },
        { id: 'rev', name: '评审专家', skills: ['review'], tools: ['review'] },
      ],
    },
  },
  {
    id: 'migration',
    name: '🚚 服务迁移',
    desc: '后端试图越权执行生产部署 —— 看工具白名单如何当场拦截',
    project: {
      name: '服务迁移',
      tasks: [
        { id: 'T1', title: '迁移方案', type: 'plan' },
        { id: 'T2', title: '数据迁出', type: 'backend', deps: ['T1'], misuse: { tool: 'deploy' } },
        { id: 'T3', title: '数据校验', type: 'test', deps: ['T2'] },
        { id: 'T4', title: '切换上线', type: 'ops', deps: ['T3'] },
      ],
    },
    defaultSetup: {
      roles: [
        { id: 'pm', name: '项目经理', skills: ['plan'], tools: ['board'] },
        { id: 'be', name: '后端工程', skills: ['backend'], tools: ['code', 'db'] },
        { id: 'qa', name: '测试工程', skills: ['test'], tools: ['test'] },
        { id: 'op', name: '运维', skills: ['ops'], tools: ['deploy'] },
        { id: 'rev', name: '评审专家', skills: ['review'], tools: ['review'] },
      ],
    },
  },
  {
    id: 'launch',
    name: '🚀 App 3.0 发布',
    desc: '毕业级综合演练：评审打回 + 越权拦截 + 阻塞升级三类异常同场处置',
    project: {
      name: '智码 App 3.0 发布',
      tasks: [
        { id: 'T1', title: '发布方案', type: 'plan' },
        { id: 'T2', title: '新功能开发', type: 'frontend', deps: ['T1'], reviewFails: true },
        { id: 'T3', title: '接口升级', type: 'backend', deps: ['T1'], misuse: { tool: 'deploy' } },
        { id: 'T4', title: '集成测试', type: 'test', deps: ['T2', 'T3'], needsEscalation: true, blockReason: '测试设备被占用' },
        { id: 'T5', title: '灰度发布', type: 'ops', deps: ['T4'] },
        { id: 'T6', title: '发布评审', type: 'review', deps: ['T5'] },
      ],
    },
    defaultSetup: {
      roles: [
        { id: 'pm', name: '项目经理', skills: ['plan'], tools: ['board'] },
        { id: 'fe', name: '前端工程', skills: ['frontend'], tools: ['code'] },
        { id: 'be', name: '后端工程', skills: ['backend'], tools: ['code', 'db'] },
        { id: 'qa', name: '测试工程', skills: ['test'], tools: ['test'] },
        { id: 'op', name: '运维', skills: ['ops'], tools: ['deploy'] },
        { id: 'rev', name: '评审专家', skills: ['review'], tools: ['review'] },
      ],
      policy: { onBlock: 'escalate' },
    },
  },
];
