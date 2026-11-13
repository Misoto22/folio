import type { ExampleCopy } from './examples'

/** Translations of the executable Website examples and their headings. */
export const WEBSITE_EXAMPLES_ZH: Record<string, ExampleCopy> = {
  'SiteShell/01-footer-destinations': { hash: '4fbbcb20', title: "页脚目的地", zh: "出版物页脚将传入的链接组织为具名导航区域。应用负责每个目的地，组件负责间距和层级。" },
  'SiteNavigation/01-navigation-and-preferences': { hash: '5a75dedb', title: "导航与阅读偏好", zh: "导航接收真实链接元素，以及由应用控制的语言偏好。缩窄画布后，可以操作移动端抽屉及其本地化关闭按钮。" },
  'Portfolio/01-editorial-introduction': { hash: '351e2fb3', title: "个人介绍", zh: "简短传记与辅助索引组成同一块介绍区域。文字、基本资料和分类数量都由应用传入。" },
  'PortfolioIndex/01-related-collections': { hash: '7c767f86', title: "相关内容集合", zh: "每个标签将条目和辅助说明放在一起。方向键可切换共用标签栏，不会更改应用路由。" },
  'Collection/01-searchable-records': { hash: '8c66e0be', title: "可搜索的条目", zh: "搜索和分类状态由应用维护，应用将筛选后的条目传入组件。控件提供具名输入框、清空操作和筛选按钮的选中状态。" },
  'Reading/01-article-and-outline': { hash: '07772440', title: "文章与目录", zh: "阅读布局组合了具有语义的发布日期、章节和目录。相邻条目的导航仍是应用提供的普通链接，并保留有意义的标题。" },
  'Contact/01-controlled-correspondence': { hash: 'd0be39ab', title: "受控留言表单", zh: "应用控制每个字段，并在自己的提交工作完成后确认成功。这个本地示例仅在内存中保存草稿，不会发送消息。" },
  'Music/01-recording-and-preview-state': { hash: '4421e267', title: "曲目信息与预览状态", zh: "录音信息和预览状态由应用的播放器通过属性传入。这个示例只切换可见状态，不会加载或播放音频。" },
  'Timeline/01-dated-records': { hash: '407b3a3e', title: "带日期的经历", zh: "时间线条目保留传入的日期、组织和辅助信息。应用在渲染之前决定排列顺序和日期格式。" },
  'Recovery/01-missing-record': { hash: '3a95a44f', title: "缺失条目的恢复入口", zh: "缺失条目状态会说明原因，并给出明确的目的地。恢复链接由应用传入，因此可以使用任意路由方案。" },
  'Media/01-photograph-collection': { hash: '533130da', title: "照片集合", zh: "图库接收链接和图片插槽，同时保留每张作品的方向。示意图代替应用提供的照片，并保留描述清楚的替代文本。" },
  'Media/02-photograph-detail': { hash: 'aba7c6ea', title: "照片详情", zh: "媒体详情保留应用提供的返回链接，并在浏览器子像素取整后仍维持可测得的触控尺寸。" },
  'Metrics/01-a-controlled-range': { hash: '4d43112d', title: "由应用控制的时间范围", zh: "选中的时间范围和已格式化的读数保留在应用状态中。具名面板可以容纳列表、表格或由其他渲染器绘制的图表。" },
  'SearchPalette/01-host-filtered-results': { hash: 'd4ebbcd0', title: "应用筛选的搜索结果", zh: "应用筛选条目并处理选择，搜索面板负责弹窗焦点和键盘导航。关闭后，焦点回到打开面板的按钮。" },
  'Content/01-a-documented-process': { hash: '79a534ee', title: "带代码的操作流程", zh: "步骤序列和代码面板共用同一阅读区域。步骤顺序和高亮代码节点由应用传入，复制操作使用实际渲染的源码文本。" },
  'Actions/01-a-record-action-menu': { hash: '03b6e5a3', title: "条目操作菜单", zh: "无障碍操作菜单将每个选项交给应用回调处理。此条目的已读状态在本地更改，菜单负责焦点管理与关闭。" },
  'Conversation/01-a-local-conversation': { hash: '8a8f8037', title: "本地对话示例", zh: "应用管理问题和已渲染的回答节点，组件负责它们的阅读顺序。这个本地示例只记录问题，不会调用助手服务。" },
  'Workbench/01-portfolio-sections': { hash: 'cdd24010', title: "作品集分区", zh: "双色开篇和两个分区放在同一套 12 栏网格上，并处于 Workbench 预设之中。每个分区的标题占前四栏、内容占其余八栏，因此它们的边缘在整页上对齐。" },
  'Evidence/01-a-recorded-trace': { hash: '9ff99b7b', title: "已记录的活动证据", zh: "示例活动记录将阶段状态、来源资料和可展开的详情分开呈现。标签和测量值由应用传入，不从装饰性进度中推断。" },
}
