/**
 * The Display group of the Chinese catalogue — 展示 — and nothing else.
 *
 * `content.ts` is still the module every consumer imports. It keeps
 * `ComponentCopyZh`, the foundations, the page copy and the lookups, and
 * assembles `COMPONENTS_ZH` by spreading these ten files in `GROUPS_ZH`
 * order. Nothing imports this one directly.
 *
 * A group is the unit for the same reason it is in the package's own
 * `agent/catalog/display.mjs`, which this file mirrors slug for slug and in the
 * same order: an entry is prose — an anatomy row and a practice line per part —
 * and ninety-two of them in one file is a file only one hand can be writing at
 * a time. `content.test.ts` fails if the assembly loses a slug or if two of
 * these files claim the same one.
 *
 * Every line here carries a fingerprint of the English it was written from —
 * the `['a1b2c3d4', '……']` in front of the prose, and `hash` on an anatomy row.
 * It is what makes a REWRITTEN English line fail the build rather than leave a
 * Chinese sentence saying what the English no longer says; `content.ts` has the
 * reasoning. Never write one by hand: fix the prose, then regenerate the hash
 * beside it from `agent/catalog/`.
 */

import type { ComponentCopyZh } from '../content'

export const DISPLAY_ZH: Record<string, ComponentCopyZh> = {
  badge: {
    name: '徽章',
    summary: ['28d6d76b', '一个计数或一种状态，用等宽字，所以它读起来像元数据。'],
    when: ['88b8e6ea', '关于某一条记录的一个事实。如果它说的是“这东西是关于什么的”，那是 Tag。'],
    accessibility: [['46723b60', '不可交互。带 onClick 的 badge 是键盘够不到的控件。'], ['f32dfd1f', '状态色都由文字和图标重复表达，所以在单色打印和色盲下含义不丢。']],
    anatomy: [
      { hash: '4407119f', element: '标记盒', description: '那个 <span>：inline-flex，--radius-sm 圆角，12px 等宽字并放宽字距。等宽这张脸就是全部信号——它告诉读者这是元数据，而不是它所在那句话里的一个词。' },
      { hash: 'db6b2dd2', element: '底色', description: 'tone 的填充——neutral 是 --stone，三种状态色分别是 --ok、--warn、--danger 的浅色调，outline 则什么都不填。' },
      { hash: 'a1c7c421', element: '边框', description: '始终画出来，除 outline 外一律透明，所以这个盒子无论哪种 tone 都占着那一像素，运行时换 tone 也不会挪动它旁边的任何东西。' },
      { hash: 'fc063185', element: '内容', description: 'children，彼此之间 6px 间距——所以摆在文字旁边的 StatusDot 或 Kbd，用不着包一层就有了自己的间距。' },
    ],
    practices: [
      ['33201483', '除非这个 badge 说的是一种状态，否则 tone 就留在 neutral：三种状态色是这套系统唯一花掉的彩度，而一个只因为页面想要红色就变红的 badge，正是这套色阶存在要防的那件事。'],
      ['b1b8f4cd', 'badge 本来就落在 --stone 上时，改用 outline——其余每种 tone 都自己填底，而 stone 上的 neutral badge 是一块完全看不见边界的标记。'],
      ['24d9af74', '只放一个计数、一个词，或者一个短状态。它是按一行排的 12px 等宽字，所以塞进去的一个短语，就是用元数据的字脸排出来的散文，还会在一个从没为第二行留过位置的盒子里折行。'],
      ['f06a1589', '一排 badge 是用错组件画出来的 Tag 列表：Badge 没有 active 状态，所以它变成的那条筛选栏，没法显示哪一个筛选面是开着的。'],
      ['dee13f27', 'neutral 的 Badge 和未选中的 Tag 是同一个圆角、同一份内边距、同一种 12px 等宽字，中间只差一级墨色——所以把状态和主题混在一排，读出来就是一长串分不出彼此的标记。'],
      ['1f63a563', '这里没有关闭这回事。写进 children 的 × 是可访问名称里的文字，所以这个 badge 会被念成「beta ×」，而它宣称的那个关闭并不存在。'],
    ],
  },
  tag: {
    name: '标签',
    summary: ['3ab96a5b', '主题标签——一个话题、一项技术、一个筛选面——用 onClick 做筛选，用 onRemove 关掉。'],
    when: ['54e0021e', '若干个并排出现、供人扫读。关于一条记录的一个事实是 Badge。读者能切换或者关掉的那种 chip，就是这个组件加上 onClick 或 onRemove，不是第四个组件。'],
    accessibility: [
      ['2fc3c109', '没给处理函数之前都是纯展示。onClick 会把标记盒变成一个真正的 button，并把 active 带成 aria-pressed，所以焦点圈和按下状态都留在真正画出它们的那个元素上。'],
      ['6004ac0b', '两个控件都是真正的 <button type="button">，而且是兄弟节点，所以 Tab 各自走得到，Enter 和 Space 各自都能触发，两个都不会去提交碰巧套着它们的那个表单。'],
      ['438a9a8d', '传了 onRemove 就必须传 removeLabel，它是这个按钮全部的可访问名称——那个 X 本身是 aria-hidden 的。'],
    ],
    anatomy: [
      { hash: '01d5e5cb', element: '标记盒', description: '那个 <span>：和 Badge 同一个 --radius-sm 圆角、同一份 10px × 4px 内边距、同一种 12px 等宽字，但它自己没有边框。' },
      { hash: '2d3d7aa8', element: '底色', description: '静止时是 --stone，active 之后是 --accent，按 --duration-fast 交叉淡入。accent 是这套系统唯一指向“某个选择”的记号，所以选中就画在它身上。' },
      { hash: '88020003', element: '标签文字', description: 'children，用 --ink-3-aa——那是 AA 的下限，不是某种浅灰——active 之后换成 --accent-foreground。' },
      { hash: '7774189b', element: '移除按钮', description: '只在传了 onRemove 时出现：标签后面一个真正的 <button type="button">，里面是 12px 的 X，名字由 removeLabel 给。画出来的盒子只有 16px，低于 WCAG 2.5.8 的 24px 下限，所以一个内缩的伪元素把命中区域撑到 24——画面不变，标记之间也不会被撑开。' },
      { hash: '2d7010ce', element: '筛选控件', description: '只在传了 onClick 时出现：标记盒本身变成那个 <button>，并把 active 带成 aria-pressed。同时给了 onRemove 时，标签会拆成 X 旁边它自己的按钮——两个兄弟节点，绝不会一个套进另一个——并且把前导内边距一并带走，所以点击目标是一直到 X 为止的整块标记，而不只是那几个字。' },
    ],
    practices: [
      ['c9506e82', '做筛选就用 onClick，不要在外面包一层。标记盒本身就变成那个按钮，所以内边距是点击目标的一部分，焦点圈画在读者看得见的那个形状上——可移除的标记也不会落成一个按钮套着另一个按钮。'],
      ['f1c6783d', '会切换的标记要传 active，不会切换的就别传。aria-pressed 读的正是同一个值，所以 accent 的填充和辅助技术听到的状态不可能各说各话；不传就什么都不播报，而这对一个只做跳转、不做切换的标记来说恰好是对的。'],
      ['ecc7fa21', '筛选栏要留一个能回去的关闭态——active 就是那抹 accent，而一排全都 active 的 tag，把“就是这一个”这个记号平摊给了所有人。'],
      ['5cb76f30', '它根本没有 tone，所以一个 tag 说不出成功或危险。用 className 给它上色，是往系统里手工塞进一个色相，而“被选中”这件事，就只能指望 accent 一个人还读得出来。'],
      ['6c04bd37', '孤零零一个 tag，是一个丢了 tone 的 Badge。这个组件是为一排一排地扫读而造的，而一条记录旁边的单个标记，说的是关于这条记录的一个事实。'],
      ['49b69195', 'removeLabel 里要把对象说出来——「移除 Rust 筛选」，不是「移除」。它和 onRemove 一起是必填的，因为八个标记的控件全叫 Remove，就是八个读屏软件分不清的控件。'],
      ['d13d3490', '别自己在外面套一个 button。套在可移除的标记外面就是按钮里嵌按钮——这是非法标记，解析器会把它拆成兄弟节点，留下一份作者和无障碍树都没预料到的 DOM。那一层包装本来要做的事，就是 onClick。'],
    ],
  },
  kbd: {
    name: '按键',
    summary: ['01de8d56', '键盘上的一个键，就按键来排版。'],
    accessibility: [['ae93215b', '渲染 <kbd>，它带有语义，而加了样式的 <span> 没有。']],
    anatomy: [
      { hash: '726a34d2', element: '键帽', description: '那个 <kbd>：--radius-sm 圆角上一条 --rule-2 细线，min-w-[1.6em] 让单个字符成为一个键帽而不是一根细条，0.8em 的字号让整个键帽跟着周围的文案一起缩放。' },
      { hash: '480360ce', element: '键面字符', description: 'children，原样打印。一个元素一个键——两个键之间那个空格是标记里真实存在的空格，不是组件画出来的分隔符。' },
    ],
    practices: [
      ['9a556db2', '一个键写一个 Kbd。把整组和弦塞进一个盒子——⌘K——得到的是一个装着两个字形的键帽，而那个让单字符成为方块的 min-w-[1.6em]，只会被撑开去装下两个。'],
      ['15d5adb3', '让它从周围取尺寸：它是按 em 排的，所以同一个快捷键印在标题里和印在正文里都对。把它钉死成 px，正是同一个快捷键在同一页上长出三种大小的原因。'],
      ['4e262b5d', '只有字形的键要给 aria-label——⌘、⌥ 和 ⇧ 要么被念成它们的 Unicode 名称，要么干脆被跳过，所以纯用符号写出来的 Mac 快捷键，是一条没有声音的指令。'],
      ['7145272f', 'outline 的 Badge 和 Kbd 在屏幕上几乎一模一样，所以在这两者之间做选择完全是在选含义：<kbd> 说的是读者要按下它，而一个长得像键的 badge，招来的是一次没有任何东西回应的按压。'],
      ['f6476358', '这里没有任何东西会绑定任何东西。这个元素就是排版，所以为一个没有任何处理器在听的快捷键印出来的键，是在为一个页面并不具备的功能写文档。'],
    ],
  },
  avatar: {
    name: '头像',
    summary: ['a6bbd88b', '一个人，画成一个圆；图片没到之前先显示缩写。'],
    accessibility: [
      ['f78ab3aa', 'alt 命名的是那个圆本身，以 role="img" 的形式，所以一个没有照片的头像照样说得出自己是谁。'],
      ['d3e80976', '旁边已经印了名字时，空的 alt 才是对的：那时这个圆干脆不取任何 role，而不是取一个没有名字的 role，于是它整个离开无障碍树。'],
      ['ce1a93a3', '缩写是 aria-hidden 的——挨着一个根节点已经给出的名字念出来，它们只是噪音。'],
    ],
    anatomy: [
      { hash: '753756d5', element: '圆', description: 'Radix 的根节点：--stone 之上一条 --rule 细线，overflow 隐藏，尺寸是三个固定方块之一——28px、36px 或 48px。它带着 role="img"，并把 alt 当作自己的名字，因为它是这里唯一一个始终会渲染的元素。' },
      { hash: 'b11372e5', element: '图片', description: '只在给了 src 时才渲染，object-cover，所以一张竖幅照片是被裁进这个圆，而不是被拉变形。它自己的 alt 是故意留空的——为这个人命名的是外面那个圆，在这里再来一个名字，就是同一个人被念了两遍。' },
      { hash: '54ca5550', element: '缩写', description: 'Radix 的兜底：等宽、大写、--ink-3-aa，并且 aria-hidden。图片加载期间和加载失败之后由 Radix 显示它，所以它不会像手写的 onError 替换那样每次渲染都闪一下。' },
    ],
    practices: [
      ['714c27dd', 'alt 是写给这个人的，不是写给这一行的：无论照片会不会到，那个圆都带着它，所以一份照片可有可无的列表，播报的是每一个人，而不是每隔一个人。'],
      ['d5fe2eef', '传一份自己站得住的缩写：fallback 是必填的，因为可选的那一半是图片，而真实列表里大多数行渲染出来的都是这个元素，不是照片。'],
      ['9bd91b92', '让 Radix 来管这次替换，不要去动 onError——它只在图片确实失败之后才切到兜底，正是这一点让缩写不会在缓存回答之前先闪出一帧。'],
      ['54fc6eff', '头像不是那个控件。sm 是 28px，md 是 36px，都低于 44px 的指针目标下限（WCAG 2.5.8），而根节点是一个没有任何东西让它可聚焦的 <span>——把 onClick 挂上去做出来的账号菜单，既够不到又太小，两样一起占了。'],
      ['30c4b4f4', 'props 里特意没有 children：进这个圆的只有图片和兜底两样东西，而根节点是 overflow-hidden 的，所以放进去的在线状态点，会被那条把它变圆的边界裁掉。'],
    ],
  },
  'status-dot': {
    name: '状态点',
    summary: ['86dd5c88', '状态词旁边的那个点。'],
    accessibility: [['2968853e', '一律 aria-hidden：它重复的是旁边标签已经说过的状态。'], ['e0ed2413', '光晕只在 motion-safe 下运行，要求减少动效的读者看到的是静止的点。']],
    anatomy: [
      { hash: '1b754356', element: '外盒', description: '整个东西所在的那个 aria-hidden <span>——md 下 8px 见方，sm 下 7px，inline-grid 且 shrink-0，所以无论旁边的标签有多长，它在 flex 行里都保持是个圆。' },
      { hash: '10349e94', element: '点', description: '一个绝对定位的实心圆，颜色取 --ok、--warn、--danger 或 --ink-3-aa。它是这个组件里 tone 唯一够得到的部分。' },
      { hash: '764f6f83', element: '光晕', description: '同色的第二圈环，跑 folio-halo 那组 keyframes，只在 pulse 为 true 时存在。它是一个独立元素而不是 box-shadow，因为这套系统里的阴影从来不带模糊。' },
    ],
    practices: [
      ['63db455b', '任何已经尘埃落定的东西都要 pulse={false}。它默认是 true，所以一个表示构建已完成、或者今天不会再变的点，会顶着一圈宣称此刻正在发生什么的光晕。'],
      ['f7afa825', '一旦发现自己在把点和它的标签写在一起，就换成 StatusPill——这一对在每个调用处各拼一次，正是同一个站点上同一种状态长出三种点尺寸和两种脉冲节奏的原因。'],
      ['bd967cd6', '让它直接待在标签旁边那个 flex 行里：让它保持圆形的是 shrink-0，而一个被包进可收缩 div 里的点，只要标签一长就会被压成椭圆。'],
      ['24d431c3', '给这个点加 aria-label 什么也换不来——aria-hidden 照样设着，而一个被隐藏的元素没有名字可给。一个没有可见标签的调用处，是一种任何读屏软件都不会报出来的状态。'],
      ['1b19b409', 'sm 和 md 是 7px 和 8px，差一个像素。那是为了配小一号的字做的视觉微调，不是一套尺寸阶梯，布局里不该有任何东西建立在这一像素之上。'],
    ],
  },
  steps: {
    name: '步骤条',
    summary: ['77454d5f', '一串带编号的步骤，画成一条轨——一件接一件，中间有条线穿过去。'],
    when: ['d93951ec', '流水线、迁移、配方：有先后、没有分叉。一旦出现分叉或者要指向别处，那就是 Diagram；把分叉画成列表等于把它藏起来。'],
    accessibility: [
      ['c853927f', '用 <ol>，因为顺序本身就是内容——一堆 div 说明不了先后。'],
      ['c09535b1', 'aria-current="step" 标出被填充的那一个，这是这里唯一一件读者没法从阅读顺序推出来的事。'],
      ['398f0419', '编号圆点和连接线都是 aria-hidden：那个数字就是列表序号，读屏软件本来就会念。'],
    ],
    anatomy: [
      { hash: '07d3391b', element: '轨', description: '那个 <ol>，带着 --step-size——一个被三条规则同时读取的数字：编号圆点自己的盒子、连接线从哪里开始、以及它对齐在哪个中心上。' },
      { hash: '92cb1265', element: '编号圆点', description: '每一步一个 2rem 的圆，aria-hidden：里面是序号，marker 为 "rule" 时则是一个空的细线节点。当前那一步用 --accent 填充。' },
      { hash: 'ef731fe7', element: '连接线', description: '除最后一项外每一项都画的一条细线，绝对定位，从那个圆点的底一直到该行的底——所以它跨的是两步之间的空隙，而不是从圆点背后穿过去，序列末尾也不会拖出一截尾巴。' },
      { hash: '502cd9b1', element: '步骤标题', description: 'step.title，15px 界面字脸。它是这一步的名字——一个名词，不是对这一步里发生了什么的描述。' },
      { hash: '74bfb749', element: '注解', description: 'step.note，标题下面的一行等宽字：这一步由什么构成、要花多少代价、用到什么。' },
    ],
    practices: [
      ['6ed7653d', '一串状态要用 marker="rule"。「排队中、运行中、已完成」是一种先后，不是一份操作清单，而每一项前面挂一个数字，等于告诉读者这些是要他去执行的步骤。'],
      ['aeb1beaa', '最多只标一步 current：这是整条轨里唯一被说出来、而不是被画出来的事，而两个被填充的圆点，会让这个流程同时出现在两个地方。'],
      ['7556ce3c', '没有标题为这串步骤命名时要传 label——它是这个列表唯一的名字，没有它，这条轨会被播报成五个不属于任何东西的项。'],
      ['0510a41b', '要调这条轨，就在列表上改 --step-size，别去重写圆点的样式：圆点的盒子、连接线的起点和它的居中，读的都是那一个数字，三者只动其一，那条线就会从半空中开始。'],
      ['b1a77ec1', '画在这里的分叉，是读者永远看不见的分叉。连接线只从每一步连到数组里的下一步，别的哪儿都不去，所以两条分支会被压平成四个连续的步骤，而在它们之间做选择这件事，彻底离开了这张图。'],
      ['fcf52a41', 'steps={[]} 渲染出来是 null，不是一条空轨，所以一份被筛得什么都不剩的列表，会留下一个标题孤零零地站在一片空白之上——除非调用处自己去查长度。'],
      ['aad6e677', '这里没有任何东西可以点，而属性是展开到 <ol> 上的，所以一个本来给某一步的 onClick 会落在整个列表上。读者要在其中来回走动的序列，是 Breadcrumb 或者 Tabs。'],
    ],
  },
  'status-pill': {
    name: '状态胶囊',
    summary: ['2df1984c', '一种活着的状态：一个点，加一行大写等宽标签。'],
    accessibility: [
      ['5039b829', 'warning 和 danger 两档由一个视觉上隐藏的严重度词重复表达，因为承载颜色的那个点是 aria-hidden 的，它没有名字可给。'],
      ['d6ce54c0', 'success 和 neutral 保持沉默是故意的：在每一个已经落定的胶囊前面播报一句「OK」，是把噪音记在那两档真正值得打断人的状态账上。'],
      ['7eb5ff90', '不是 live region。读者还停在页面上时翻掉的状态是悄无声息的，除非调用处自己在外面套一个 role="status"。'],
    ],
    anatomy: [
      { hash: '82705a09', element: '胶囊', description: '那个描边的 <span>：--radius-pill、一条 --rule-2 细线、--paper 底色，以及一份刻意不对称的内边距——点之前 10px，标签之后 12px——好让这一对在视觉上居中，而不是在算术上居中。' },
      { hash: 'e6b3c145', element: '点', description: '一个被交了 tone 和 pulse 的 StatusDot。它是 aria-hidden 的，所以 tone 并不是从这里抵达一个看不见颜色的读者。' },
      { hash: '6ef93b91', element: '标签文字', description: 'children，用眉标那套写法——11px 大写等宽字，字距从 0.2em 收回到 0.12em，因为一个胶囊比一条章节眉标要短。' },
      { hash: '2eed02e0', element: '严重度', description: 'warning 和 danger 两档下一个视觉上隐藏的“Warning”或“Error”，好让这两档能通过颜色之外的东西抵达读者——而不是靠一个被隐藏的点上的颜色。success 和 neutral 什么都不加：它们是“没有警报”，而这本来就是读者默认的前提。' },
    ],
    practices: [
      ['b41978b9', '状态还是要写进字里。那个严重度词只到读屏软件为止，别处都到不了——胶囊自己的文字在每一档 tone 下都是 --ink-2，所以在单色屏幕上，警告胶囊里的「Degraded」和中性胶囊里的「Degraded」仍然是同一个胶囊。'],
      ['d109c8d2', '状态一旦落定就 pulse={false}——默认那圈光晕的意思是“此刻”，而一个已归档、已发布的胶囊永远脉动下去，是在告诉读者有什么东西还活着，而其实什么都没有。'],
      ['3f24d50d', '整个胶囊拿去用，不要在调用处拿一个点加一个 span 自己拼：正是这种拼法，让同一个“接受合作”的标记在同一个站点上长出三种点尺寸和两种脉冲节奏。'],
      ['347c1d06', '它不是 live region。这个胶囊就是一个普通的 <span>，所以读者还停在页面上时，状态从 Available 翻成 Degraded 是悄无声息的——如果这次变化本身就是新闻，那么外面那个 role="status" 归调用处管。'],
      ['0bbb006d', '一屏一个，不是一行一个。这个标签是 0.12em 字距的大写眉标——这套系统里最响的小字——而顺着表格排下来的一整列是 Badge 的活，这也正是 Badge 用朴素的 12px 等宽字带着同样那几种状态色的原因。'],
    ],
  },
  'link-arrow': {
    name: '链接箭头',
    summary: ['5ff1cb60', '标记“这条链接会离开本页”的记号。'],
    accessibility: [['68ba86e7', 'aria-hidden，所以它不会在句子中间被念成“东北方向箭头”。'], ['bc7a13f2', '以 em 为单位，跟随它旁边的字号，而不是跟它抢。']],
    anatomy: [
      { hash: 'df3ecdda', element: '记号盒', description: '一个 aria-hidden 的 inline-block <span>，带着 0.22em 的前导间距、0.28em 的基线抬升和 --ink-3-aa。inline-block 在这里两次承重：它拦住带下划线的父元素把那条线画穿字形，同时它也是对齐所依据的那个盒子。' },
      { hash: '96b6ec6c', element: '字形', description: '↗ 本身，0.68em，所以它跟着旁边的字走，而不是跟它抢。以 EXTERNAL_LINK_ARROW 导出，好让不是 React 的界面用上同一个字符。' },
    ],
    practices: [
      ['182155d2', '把它放进 <a> 里面，作为最后一个子节点。放在外面，它就是一个指着某条链接的箭头，而指针差 0.22em 点不到那条链接。'],
      ['1346f093', '界面不是 React 时用 EXTERNAL_LINK_ARROW——一条 Markdown 管线、一张 OG 图、一封邮件——好让这个记号始终是同一个字符，而不是整个站点上三个几乎一样的箭头。'],
      ['8f2e5d51', '落在反白底板上时，用 className 传一个颜色进去：它用的是 --ink-3-aa，那是对着纸色的 AA 下限，压在墨色上几乎看不见。'],
      ['a60a7279', '这个箭头不是那句提示。它是 aria-hidden 的，target="_blank" 也不会被播报，所以一条会开新标签页的链接，得在自己的可访问名称里把这件事说出来——否则这个字形就是所有人拿到的唯一警告，而且前提是看得见。'],
      ['405b94c8', '别把它钉死成 px。是 0.68em 让同一个组件在正文里和在标题里都对；固定成 11px，它在其中一处是对的，在另一处只是一个小点。'],
      ['31ffde41', '别把它挂在索引的每一行上。它标的是“目的地变了”，所以一份每条链接都离开本站的列表，什么都没标出来，还为此每行付掉 0.22em。'],
    ],
  },
  separator: {
    name: '分隔线',
    summary: ['be06bcee', '一条线，三种粗细——单色页面需要它们；断口本身有话要说时，还能往里放字。'],
    when: ['0a8426a6', '细线分行，边线分块，实线压在报头下面。label 把字放进断口里：“或使用以下方式继续”、“更早”。'],
    accessibility: [
      ['373aa620', '默认 role="none"。只是把东西在视觉上分组的线，不应该被念出来。'],
      ['0d9a6cae', '带了 label，字就是内容，两截线是 aria-hidden 的装饰——所以 decorative 不再适用，也不会有谁在这段文字头上再播报一条分隔线。'],
      ['56ad6be3', '竖线上的 label 会被忽略，而不是被悄悄改画成一条横线：一列一像素宽的东西里，没有任何一个位置适合放字。'],
    ],
    anatomy: [
      { hash: '72216b8c', element: '线', description: '一个 <div>。交叉轴上一像素，主轴上 100%，所以它取的是容器的宽——或者高——除此之外什么都不取。' },
      { hash: '3459fb9a', element: '墨色', description: 'weight 唯一改变的东西：块内用 --rule，块与块之间用 --rule-2，报头下面用 --rule-hard。最重的那一档不是更深的灰，它就是 --ink 本身。' },
      { hash: '8515feb6', element: '断口文字', description: 'label，只在横线上有效。它改的是构造，不是样式：那条线被画了两次，文字两侧各一段 aria-hidden 的线，文字本身是 --ink-3-aa 的等宽元数据字，而两段线之间的空隙就是真的空隙。' },
    ],
    practices: [
      ['d32006c6', '竖着的分隔线要给高度。它是 h-full，而面对一个自己没有高度的父元素，这会解析成零——元素渲染出来了，什么位置都不占，读起来像一个没加载出来的组件。'],
      ['f579f71b', '当这条线是唯一把两块内容分开、而读屏用户本该听出这两块是不同东西时，传 decorative={false}：正是它把 role="none" 换成 role="separator"，并顺带设上 aria-orientation。'],
      ['73dd103b', '别凭眼睛挑 weight。这三档是有次序的，所以两行表格之间的一条 hard 线，是在告诉读者这张表到此为止。'],
      ['e9c929ce', '别用 className 手调出第四种灰。三档有名字的粗细就是全部，而这些名字之所以存在，是因为只要有一条线是凭感觉选的，一个单色页面就会漂成五条略有差别的线。'],
      ['a5f6e9fe', '用 label，别拿两个 Separator 加一个 span 去拼“或使用以下方式继续”。那两段线是替你画好的，而且它们都不需要知道自己压在什么底色上。'],
      ['d1ab348d', '别把文字压在一条完整的线上、再用一块背景色去凿出个缺口。那种做法必须被告知自己坐在什么底色上，而 --stone 卡片上一道 --paper 的缺口，读起来就是一个渲染 bug。'],
    ],
  },
  diagram: {
    name: '示意图',
    summary: ['91ef00b5', '一张流程图或架构图，用系统自己的零件画出来。'],
    when: ['c84a0ffc', '在页面里画结构，而不是在终端里。嵌套表示包含，箭头表示相邻两步之间的顺序——需要任意连线的图想要的是一张画，不是这个。'],
    accessibility: [
      ['9e1c4d6b', '一个 role="group" 的 <figure>，由 caption 命名，所以整张图对读者是一个可以整体跳过的东西。'],
      ['6c79ce1b', '箭头是 aria-hidden：辅助技术本来就按文档顺序读节点，用不上一个指向下一个的字形。'],
      ['45a9df06', '服务端渲染出来的标记，不是 canvas——每一个标签都是读屏和搜索引擎读得到的真文字。'],
      ['cf36ef1a', '一份渲染器兑现不了的 spec——一条对不上的 edge、一个重复的 id、带上的 accent、叶子上的 direction——会在开发环境下打印一条具名的警告，因为另一种结局是一张信誓旦旦地画着别的东西的图。'],
    ],
    anatomy: [
      { hash: '62b62773', element: '外框', description: '那个 <figure role="group"> 和它里面的面板：--paper-2 之上、--radius-lg 圆角上的一条 --rule 细线，配上流体内边距和挂着细线滚动条的 overflow-x-auto——所以一张很宽的图是在自己的盒子里滚动，而不是把页面撑宽。' },
      { hash: 'ed15ddeb', element: '叶子板', description: '没有子节点的节点：--paper 上一张带边框的卡片，设了 accent 时则用 --accent 填充。它的标签会在自己内部断行，因为像 TenantMainMiddleware 这样的标识符没有任何断行机会，否则就会撞上板子的边。' },
      { hash: 'cf9e584c', element: '容器带', description: '有子节点的节点：一条带标签的细线——最上一层用墨色，往下用 --rule-2——子节点排在它下面，它自己没有框。整个设计就是这一点：把容器也画成一个盒子，任何嵌到第二层的东西外面就会围上三条边框。' },
      { hash: '3ab0a9db', element: '节点注解', description: 'node.note，一行等宽字，落在带的标签旁边，或者板子的标签下面。一行短句，比名字退后一档。' },
      { hash: 'b9216ad0', element: '连线记号', description: '一条 edge 所指的那两个相邻兄弟节点之间的箭头，下面是这条 edge 的标签。它是 aria-hidden 的，并且在 sm 断点以下转四分之一圈——那时一排节点会堆成一列，箭头必须指向布局实际走的方向。' },
      { hash: '6b75aa00', element: '图注', description: 'spec.caption，印在外框下面——用的是 <div> 而不是 <figcaption>，因为文章样式表会在 layer 之外给 figcaption 上样式，而一条不在 layer 里的规则不管特异性如何都压得过工具类。' },
    ],
    practices: [
      ['89133366', 'edge 要从一个节点写到同一层里紧跟着它的那个节点，而且就按这个顺序写。一条连在不相邻节点之间的 edge、或者一条按 to→from 写反的 edge，画不出箭头——而现在它会在控制台说出来，不再把「在一张看上去已经画完的图里找出缺掉的那个箭头」丢给作者。'],
      ['67659723', 'id 要在整份 spec 里唯一。每条 edge 现在在第一对匹配上的节点那里就被用掉了，所以复用的一对 id 不会再把箭头画两遍——但这个箭头会落在先出现的那一对上，那是一张在断言没人写过的东西的图。'],
      ['287637c0', '给 spec 一个 caption 或者一个 label。这个 figure 的 role="group" 由两者中在场的那个来命名，两个都没有，读者就只被告知这里有一个组，却从来没被告知是关于什么的组。'],
      ['3a439ba1', 'accent 只在叶子板那一支里被读取，所以把它设在一个有子节点的节点上，能编译、能过类型检查，什么也画不出来——容器是一条带，而带没有可以填的底。开发环境下会把这件事说出来，生产构建不会。'],
      ['6de08344', 'direction 只从有子节点的节点上读。设在叶子上会被忽略，因为一个叶子所在的那条轴属于它的父节点——而且和带上的 accent 一样，这件事会在开发环境下被报出来，而不是被悄悄丢掉。'],
      ['48c51ac6', '别在最上一层横着排六个节点。一行在 sm 以下是 flex-col，只有在它之上才是 flex-row，所以一张在桌面上读起来像一条流水线的图，在手机上是六块堆起来的板子和五个箭头。'],
    ],
  },
  'figure-band': {
    name: '数字带',
    summary: ['3ed1def6', '一排被数出来的事实，只用细线分隔，此外什么都没有。'],
    accessibility: [['f40b4a28', '用 <dl>：每个格子是一个词条和它的值，这是一堆 div 表达不了的。']],
    anatomy: [
      { hash: 'dbd9a26f', element: '容器查询外层', description: '包在列表外面的一个普通 <div>，而且必须有：容器查询解析的是某个祖先容器，绝不会是声明容器的那个元素自己。它的 w-full 同样承重——contain: inline-size 计算宽度时不看内容，所以作为一个按内容收缩的 flex 项，它解析成了零，整条带子渲染出来是两列 0px。' },
      { hash: 'd4930b66', element: '带', description: '那个 <dl>：上下各一条 --rule 细线，外层到 @3xl 之前是两列、之后是四列——这是关于这条带子有多宽的判断，不是关于窗口有多宽的判断。' },
      { hash: '4fc1c5bb', element: '格子', description: '一个数字一个 <div>。每一档分栏宽度点名的是那些不开新行的格子，而不是先加一条线再收回去，所以永远不会有一条边被画到最后一列之外。' },
      { hash: 'f2c5870b', element: '词条', description: '那个 <dt>：数值上方的大写等宽眉标。' },
      { hash: '32fac71b', element: '数值', description: '那个 <dd>，用标题字脸排，字号随 scale 取 --fs-lead 或 --fs-sub。' },
      { hash: '51a68ab9', element: '注解', description: '同一个词条下的第二个 <dd>——一段趋势、一个限定，或者第二个事实。' },
    ],
    practices: [
      ['e8aa856b', '给它两个或者四个数字。这个网格在 @3xl 之前是两列、之后是四列，所以三个在两种排法里都留一个洞，五个在带子铺成四列之后留三个洞。'],
      ['98b467fa', '一条给页面做支撑、而不是页面本身的带子，用 scale="sub"：--fs-lead 是横幅标题那一档，所以一个用 lead 排出来的辅助数字，是在和页面自己的主题抢。'],
      ['0bb87a94', '每个数字按它数的那件事来做 key——id 是必填而不是可选，因为它就是 React 的 key，而用下标做 key 的话，列表一重排，下一次渲染的数字就落到了上一个词条底下。'],
      ['3a69a183', '别往 note 里放一个句子。数值和注解是同一个 <dt> 下的两个 <dd>，所以读屏软件会把它们当作同一个词条的两个值来念：「文章：48，今年 +6」讲得通，一个从句讲不通。'],
      ['f8f7d5d1', '别用 className 里的视口断点去设列数。这条带子读的是容器查询，所以写在它上面的 sm:grid-cols-4，在 1440px 窗口里那条 390px 的侧栏中就是错的——而那正是它取代掉的做法。'],
      ['3ec268fe', 'figures={[]} 渲染出来是 null，所以一条被喂了空数组的带子既不留下线，也不留下空状态——如果“什么都没有”本身就是新闻，那得由调用处说出来。'],
    ],
  },
  text: {
    name: '文本',
    summary: ['30d0e091', '这套系统的段落，落在墨色阶的第二级。'],
    when: ['7161cef4', '一个段落，或者一段跑在阅读栏之外的文字。一整列正文是 Article。'],
    accessibility: [
      ['aa7621f4', 'as 只换元素，别的什么都不换，所以标记可以照实说这段内容是什么，而外观不会在底下跟着变。'],
      ['77958964', '每一种 tone 都是过得了 AA 的一级；muted 那一档是 --ink-3-aa，不是半透明的 --ink-3。'],
    ],
    anatomy: [
      { hash: 'c656cb5d', element: '盒子', description: 'as 点名的那个元素——不另说就是 <p>。size、tone 和 margin: 0 都长在它身上，所以块与块之间的间距归容器管，不归段落管。' },
      { hash: '00738ae6', element: '字号档', description: 'size，四档之一：xs、sm、base 和 lead。lead 就是 --fs-item，标题阶梯最下面的一级，也是撑起一篇文章的那句导语。' },
      { hash: '5bb63d32', element: '墨色档', description: 'tone，三档之一，因为墨色阶梯就是三级：body 是 --ink-2，strong 是 --ink，muted 是 --ink-3-aa。' },
    ],
    practices: [
      ['a2cce81a', '正文就别动 tone。默认是 --ink-2，这是故意的：一个段落全用满墨的页面，把阶梯最上面那一级花在了正文上，留给标题的什么都不剩。'],
      ['f165676a', '句子中间的一小段用 as="span"。<p> 套 <p> 不是嵌套——HTML 解析器会把外面那个关掉，你拿到的是两个段落和一份坏掉的排版。'],
      ['8d823853', '标题下面那句导语用 size="lead"，到此为止。它是 --fs-item，和卡片内标题用的是同一档；再大就是一个还没承认自己是标题的标题。'],
      ['8ab3486b', '别在它身上设间距。每一个 Text 都是 margin: 0，所以在一个普通 <div> 里堆起来的一摞本来就没有节奏——把它们放进 Article，或者把间距交给容器，否则每一个页面都会长出自己对“段落间距是多少”的理解。'],
      ['1c068f33', 'tone="muted" 是 --ink-3-aa，绝不是 --ink-3。这两个在纸色上看起来一模一样，却不是同一个 token：--ink-3 是半透明的色调，底下是什么它就吃什么，所以它在页面底色上过得了 AA，在卡片或者代码板上就悄悄不及格。'],
      ['e64b2b77', '别把它调大一号当标题用。读屏软件是靠元素来导航的，而一个 --fs-item 的 <p>，在标题列表里是看不见的。'],
    ],
  },
  heading: {
    name: '标题',
    summary: ['369e757b', '一个标题，元素和字号是两个各自独立的决定。'],
    when: ['da7b08f7', '任何标题。level 跟着文档大纲走，size 跟着设计走，并且默认从 level 推出来。'],
    accessibility: [
      ['61599ff0', 'level 渲染的是真正的标题元素，所以这份大纲是能被导航的，而不只是看得见。'],
      ['9701921c', '两个决定是两个 prop，正是这一点让一个语义上正确的 h3 可以长得像页面标题，而不必把大纲掰弯。'],
      ['9389b266', '带 scroll-margin-top，所以锚点跳过去的标题不会被固定的顶栏盖住（实践中的 WCAG 2.4.7）。'],
    ],
    anatomy: [
      { hash: 'b879e6ea', element: '元素', description: 'level，1 到 6，渲染成对应的 <h1>–<h6>。这就是文档大纲——读屏软件靠它导航——所以它跟着这个标题所开启的那一节走，绝不跟着它想要的字号走。' },
      { hash: '078cb4ba', element: '字号档', description: 'size，取 title、lead、heading、sub、item、label 之一。默认沿着系统的阶梯从 level 推出来，所以只写 level 是对的。' },
      { hash: '0a74ede4', element: '锚点偏移', description: 'scroll-margin-top: var(--scroll-offset)，每个标题都带着，所以一个给了 id、被目录链过去的标题，会停在报头下方，而不是被报头盖住。' },
    ],
    practices: [
      ['40b76b47', '除非大纲和设计真的谈不拢，否则只写 level。默认阶梯是 1→title、2→heading、3→sub、4→item、5 和 6→label——article.css 对渲染出来的 Markdown 用的是同一张对照表，正是这一点让一篇文章和一个组件页读起来像同一份出版物。'],
      ['29d1eb7a', '注意默认阶梯在 level 1 和 2 之间跳过了 lead，所以自己手写 size 时也要跳一档：--fs-lead 比 --fs-heading 是 1.14 倍，读起来像一次渲染事故，而 --fs-title 比 --fs-heading 是 1.86 倍，读起来才是层级。'],
      ['8f592c72', '只要有东西会链到某个标题，就给它一个 id。锚点需要的那个滚动偏移，这个组件已经带着了；页面上别的东西都没有。'],
      ['38a42295', '别为了把标题做大去抬 level。一个页面上两个 <h1> 会让它的大纲没法导航，而 size 就在旁边，一个属性的距离。'],
      ['952ba48a', '别越过 size="title"。阶梯到这里为止，因为一个页面上比它自己那些条目更大的东西，有且只有一个；再大的标题是 className 的地盘，也就是这个页面脱离这套系统的那一刻。'],
      ['71d9ca52', 'size="label" 是 11px、--ink-3-aa 的等宽眉标，不是一个小号的衬线标题——它是 level 5 和 6 该有的样子，把它设在 <h2> 上，会让这一节的标题读起来像元数据。'],
    ],
  },
  code: {
    name: '行内代码',
    summary: ['e8e57fc1', '句子里的一个函数名，或者一个 flag。'],
    when: ['672b01df', '正文当中的行内代码。多行片段是 CodeBlock。'],
    accessibility: [['8bc1267c', '渲染 <code>，辅助技术靠它才知道这一段是字面量而不是正文。']],
    anatomy: [
      { hash: 'ede89da9', element: '标记盒', description: '一个真正的 <code>，--radius-sm 圆角，填 --stone。按 0.85em 而不是像素定尺寸，所以同一个 token 在正文里、图注里和表格单元里都是成比例的。' },
    ],
    practices: [
      ['9857a5d1', '凡是读者会敲出来、或者机器会读进去的东西都用它：一个 flag、一条路径、一个函数、一个环境变量名。等宽这张脸就是“这串字是字面量”的信号。'],
      ['a92829d4', '让它继承尺寸。按 em 排是故意的——钉死成某个像素值，同一个 token 会因为落在哪儿，在同一页上长出三种大小。'],
      ['0074499a', '别塞给它一个多行字符串。它不保留空白，也不画底板，所以那段片段会塌成一行——那是 CodeBlock 的活。'],
      ['0b404a57', '也别拿一个 <span> 调成这个样子去替它。元素本身就是全部意义所在：一个等宽的 span 看起来一模一样，却什么都没告诉读屏软件，而念出来的「pass dash dash force」并不是那句话说的东西。'],
    ],
  },
  'code-block': {
    name: '代码块',
    summary: ['3bd8bdfa', '一段多行片段，摆在 plate 上，并配一条把它带走的路。'],
    when: ['4ef7c190', '任何超过一个词的片段。构建期的高亮器已经跑过就传 html，没跑过就只传 code。'],
    accessibility: [
      ['ca55e108', '会滚动的主体可以被 Tab 到，并且带一个有名字的 role="group"，所以溢出的部分用键盘够得着，Tab 到的时候也会念出它是什么。刻意不用 role="region"：那是地标，一个页面上放两段代码，就会往地标表里塞进两个同名的条目。'],
      ['48ae7969', '复制按钮是一个 iconOnly 的 Button，aria-label 必填，成功后变成“Copied”——状态变化是被播报出来的，不只是被画出来的。'],
      ['5c0bfb78', '在粗指针设备上，复制控件够到了 44px 的指针目标下限，而只靠那条紧凑的带子是够不到的（WCAG 2.5.5）。'],
    ],
    anatomy: [
      { hash: '36e279a1', element: '底板', description: '--radius-lg 圆角上的 --paper-2 盒子，配一条 --rule 细线。它是抬高的一档，不是第二种表面色。' },
      { hash: 'dce74d7e', element: '顶栏', description: '顶上那条带子：起始端是 title，末端是语言标签，再往后是复制按钮。只要里面有东西可放它就在，而且它从来不是一个悬停才出现的东西。' },
      { hash: '2ca3b642', element: '复制按钮', description: '一个 ghost 的 iconOnly Button，把 code——那个字符串，绝不是渲染出来的标记——放进剪贴板，并把自己的可访问名称翻成“Copied”，持续 1.6 秒。' },
      { hash: '45f255d2', element: '主体', description: '一个可聚焦、有名字的 role="group"，两个方向都能滚。之所以可聚焦，是因为一个内部没有任何可聚焦元素的滚动盒子是键盘够不到的：没有东西可以 Tab 过去，于是长行的右半截在没有鼠标时就不存在。用 group 而不用 region，是因为 region 是地标，而一段代码片段不是——一篇文章里三个围栏代码块，就是三个都叫 Code 的地标。' },
      { hash: 'b2e3b9b8', element: '行', description: '在不带高亮的那条路上，每行一个 <span data-line>，各自带着自己的行号和自己的高亮条。行号是它所标那一行的子节点，所以两者不可能分家。' },
    ],
    practices: [
      ['ebee8ea3', '永远要传 code，哪怕已经传了 html。复制按钮复制的就是它：一个去复制渲染后标记的代码块，交给读者的是一堵 span 墙；而一个反过来从 DOM 里刮 textContent 的，离粘贴出一段跑不起来的东西，只差一个不换行空格。'],
      ['3eff21e5', '在构建期做高亮，然后把 html 传进来。一个高亮器是几百 KB 的语法规则，运到浏览器只为重新算出一批从不改变的 span，那会是这个页面上最大的一件东西。'],
      ['009236bd', '很长的片段要给 maxHeight，别让它一路铺下去。主体会滚动，而且可聚焦，所以折叠线以外的内容用键盘照样够得到。'],
      ['de87822d', 'lineNumbers 和 highlightLines 在类型上就被排除在 html 那一支之外，两边都传是编译错误。它们是逐行的结构，而 html 是一整串组件不去解析的不透明字符串——所以这件事写在类型里，而不是让那个属性悄悄什么都不渲染。'],
      ['2bb42070', 'html 就是 dangerouslySetInnerHTML。它是给你自己的高亮器处理你自己的源码之后的产物用的；读者写的 markdown 要作为字符串走 code，在那里它渲染成文字，不可能被误执行。'],
      ['b96b9db3', '别为了把顶栏收拾干净就关掉 copyable。正是这个按钮让读者不必再去手动框选一条折了行的命令，而在触屏上，手动框选就是这次交互的绝大部分。'],
    ],
  },
  markdown: {
    // 名字取「渲染」而不是照抄 Markdown：中文里这个词本来就是 Markdown，
    // 侧栏印成「Markdown Markdown」等于没翻。这里说的是它做的那件事。
    name: 'Markdown 渲染',
    summary: ['9a9e4256', '一段 Markdown 字符串，用这套系统的组件渲染出来。'],
    when: ['17774f43', '不是这边写的内容——一条评论、一份 README、一个模型的回答。来自你自己管线的可信 HTML 是 Article。'],
    accessibility: [
      ['20a2d0fe', 'headingLevelStart 一次挪动整份文档，所以嵌进去的内容保持一份合法的大纲，而不是从 h1 重新来过。'],
      ['59aa42b4', '每个标题都拿到一个稳定的、保留原文字符的 id，并按文档顺序去重，所以目录能链进去。'],
      ['eac5df1e', 'href 的协议不是 http、https、mailto 或 tel 的链接会渲染成纯文本——javascript: 永远不会变成一个控件。'],
      ['66e2910c', '通往别的站点的链接带着 rel="noreferrer nofollow"，所以一个不可信的作者既花不掉这个页面的权重，也没法从 Referer 里读出它的 URL。这一条不可配置；markExternalLinks 加的是那个看得见的站外箭头，默认关闭。'],
      ['dda907ab', '格式不对或者空的字符串渲染成什么都没有，而不是抛错——读者写出来的内容，本来就常常是这样。'],
    ],
    anatomy: [
      { hash: '8ff21f0f', element: '片段', description: '它渲染出来的东西。这里没有包装元素，因为 Article 的节奏靠的是直接子元素选择器——夹在两者之间的任何东西，包括 display: contents，都会让每一个段落丢掉自己的间距。' },
      { hash: '3baab803', element: '解析器', description: '默认是 parseMarkdown：ATX 标题、段落、围栏代码、引用块、嵌套列表、分隔线，以及行内的强调、加粗、代码、链接、图片和转义。原始 HTML 是被丢掉而不是被渲染，所以这条路上根本没有 dangerouslySetInnerHTML。' },
      { hash: '2230a859', element: '节点', description: '这套系统自己的组件：Heading、Text、Code、CodeBlock 和 Separator。正是它们让这段内容自己就有样式，而不是只有落在阅读栏里才有。其中有一个不是纯服务端的——围栏代码渲染成 CodeBlock，那是一个带 useState、useEffect 和两个图标的 "use client" 组件，所以含代码的内容会顺带把一个客户端组件带进来。' },
      { hash: 'fd8ec23c', element: '标题 id', description: '从每个标题自己的文字生成 slug，任何文种都行，并在文档内用 -2、-3 去重。以 slugify 导出，所以目录不必回头从 DOM 里读，就能算出同样的 id。' },
    ],
    practices: [
      ['561bfa02', 'headingLevelStart 要设成“这段内容所在标题的下一级”。Markdown 是当作一份文档写的，所以它的 # 就是 <h1>；扔进一个已经有 <h1> 的页面，那就是两个一级标题和一份谁都没法导航的大纲。'],
      ['62043b0e', '把它放进 Article 里——一条评论或者一个回答用 <Article as="div">，一份文档用 <Article>。Markdown 造出这些节点，Article 是它们所在的那一栏，也是唯一给它们间距的东西，这同时也是 Markdown 自己不渲染任何元素的原因。'],
      ['6f3648d2', '一个页面上有两份文档时要传 idPrefix。否则两份都会来认领 #installation，而一个片段链接会落在浏览器先找到的那一个上。'],
      ['fad36ca0', '需要表格、脚注或者任务列表，就用 parse 把你自己的解析器带进来。这个包故意不带任何解析器依赖：markdown-it 压缩后是 110.7 kB，而这个包在它的体积预算里只剩 38.9 kB。'],
      ['31c9c4a4', '别递给它 HTML。它解析的是 Markdown；一串标签会被渲染成这些标签本身的文字，这是安全的答案，却不是你要的那个——可信的 HTML 属于 Article。'],
      ['8fa8c4c0', '没有承载它的容器就别指望有节奏，也别想用一个 gap 把它买回来。每个节点都是 m-0 渲染进一个光秃秃的片段，而散文的间距本来就不均匀——article.css 给标题上方 2.25em、下方 0.75em，正是这一点让它和它所引出的那个段落坐在一起。容器上一个统一的 gap 复制不出这个；<Article as="div"> 可以。'],
      ['9f6841cb', '别以为整个 GFM 都在。表格、脚注、任务列表、setext 标题、引用式链接和硬换行都不在内置解析器的范围里，写了其中任何一个，你悄无声息拿到的是一个段落。'],
    ],
  },
  timestamp: {
    name: '时间戳',
    summary: ['f33348bf', '一个日期或一个时间，按这套系统渲染它们的唯一方式渲染。'],
    when: ['8fae1a32', '屏幕上任何一个时刻。另一条路是在调用处写 toLocaleString()，一个产品的一屏上凑齐四种日期格式就是这么来的。'],
    accessibility: [
      ['6c68423f', 'datetime 属性从第一次渲染起就带着精确的 ISO 时刻，所以读机器值的辅助技术从不依赖某个 effect 跑没跑过。'],
      ['28129d5e', '看得见的文字在挂载后变一次，机器值从头到尾不变，播报出来的值和解析出来的值因此始终一致。'],
      ['10d051ae', '解析不了的值渲染成一个破折号，而不是浏览器那句原样的“Invalid Date”——那是工程的残渣，不是该摆到读者面前的东西。'],
    ],
    anatomy: [
      { hash: '7083ef0f', element: '元素', description: '一个 <time>，它的 datetime 从第一次渲染起就是完整的 ISO 时刻，而且从不改变，所以任何解析这段标记的东西都能拿到精确的那一刻，无论那个 effect 跑没跑过。' },
      { hash: 'd89317b4', element: '首屏', description: 'UTC 日历日期，直接从 ISO 字符串上切下来，Intl 连边都不沾。服务端渲染的是它，客户端注水时渲染的也是它——两边是从同一串字符算出来的，所以不可能对不上。' },
      { hash: '8aaace16', element: '本地读法', description: '挂载之后在一个 effect 里应用，那时才有一个可以“本地”于他的读者：相对写法用 numeric 为 "auto" 的 Intl.RelativeTimeFormat，绝对写法用 dateStyle 为 medium 的 Intl.DateTimeFormat。' },
      { hash: 'abcf0971', element: '无效值', description: '任何东西都解析不了的值，渲染成一个 --ink-3-aa 的破折号，根本不出现 <time>，因为一个写不出 datetime 的元素不是一个时刻。' },
    ],
    practices: [
      ['5400ee71', '记录列表就把 format 留在 auto。间隔在 relativeWithin 以内时它读作相对时间——默认是一周——超出之后换成日历日期，而后者既是更有用的那个事实，也是那个不再变的事实。'],
      ['0f6f3ae2', '传那个时刻，不要传格式化好的字符串。Date、ISO 字符串或者纪元毫秒数都行，三者最后都变成同一个 ISO 的 datetime 属性。'],
      ['07fc9610', '列表需要走秒时，从上面重新渲染。它每次挂载只格式化一次，这是故意的：一百行各自挂一个定时器、只为让“3 分钟前”始终属实，是一笔没人要求过的开销。'],
      ['13f2771b', '别指望服务端渲染出来的 HTML 里有相对时间。首屏特意画的是 UTC 日期——爬虫、静态导出和读标记的测试看到的都是 2026-01-14，只有一个挂载完的浏览器才看得到“3 小时前”。'],
      ['e58e8b10', '别在它旁边用 toLocaleString 另格式化一个日期。只要有一次页面渲染发生在构建服务器上，这两个就会对不上，而这正是这个组件所围绕的那种注水不一致。'],
      ['125edf4b', '别拿它表示时长。它渲染的是相对此刻的一个时刻；“2 分 14 秒的构建耗时”是一段长度，不是一个时刻，它属于一个普通字符串。'],
    ],
  },
}
