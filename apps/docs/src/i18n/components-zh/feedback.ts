/**
 * The Feedback group of the Chinese catalogue — 反馈 — and nothing else.
 *
 * `content.ts` is still the module every consumer imports. It keeps
 * `ComponentCopyZh`, the foundations, the page copy and the lookups, and
 * assembles `COMPONENTS_ZH` by spreading these ten files in `GROUPS_ZH`
 * order. Nothing imports this one directly.
 *
 * A group is the unit for the same reason it is in the package's own
 * `agent/catalog/feedback.mjs`, which this file mirrors slug for slug and in the
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

export const FEEDBACK_ZH: Record<string, ComponentCopyZh> = {
  spinner: {
    name: '加载环',
    summary: ['cb715d82', '系统唯一的“正在处理”指示——一个环，永远不是流光。'],
    when: ['6fbaeb7f', '短到不必交代“接下来是什么形状”的等待。再长一点，就该用 Skeleton。'],
    accessibility: [
      ['6ae4af20', 'label 要写明在等什么；三个都写“Loading”的转圈对读屏用户等于什么都没说。'],
      ['848bc32f', 'label={null} 让它闭嘴，用在本身已经会播报操作的控件里。'],
      ['eee589be', '只在 motion-safe 下旋转；静止时前四分之一仍然更深，所以照样读作“还没完”。'],
    ],
    anatomy: [
      { hash: 'e6b5db9f', element: '播报区域', description: '外层那个 span，也是整个组件唯一有声音的部分。只要有 label，它就带着 role="status"；传 label={null}，它就变成一个没有任何 role 的 aria-hidden 盒子。' },
      { hash: '830453c1', element: '环', description: '里层那个 span——一个透明盒子上 14px、18px 或 26px 的边框，也是 size、tone 和 className 唯一够得到的元素。' },
      { hash: '8df68318', element: '领头的四分之一', description: 'border-t：默认 tone 下用 --ink 画，current 下用继承来的颜色画。一个环和一个普通圆圈的差别全在这里——这也是为什么静止的环照样读作「还没完」。' },
      { hash: 'd2c6745a', element: '读屏标签', description: '一个装着 label 的 sr-only span，除非 label 是 null，否则一直在。它在 spinner 挂载时播报一次，之后再也不播。' },
    ],
    practices: [
      ['b020d9e6', '放在任何实色底上的 spinner 都要传 tone="current"：默认是在 --rule-2 的轨道上用 --ink 画那四分之一，而在 primary Button 里，这两个颜色正是它所站的底色。'],
      ['5332917b', '到货这件事要在别处播报。label 只在挂载时念一次，卸载时什么都不说，所以听到「正在加载项目」的读者，永远不会被告知项目已经到了。'],
      ['aeddd676', '只在本身已经说明了这个操作的控件里用 label={null}——它是把整个元素对辅助技术隐藏，而不只是去掉那行字，所以一个被静音、又孤零零站着的 spinner，是一场没有人被告知的等待。'],
      ['7206d5fd', 'label 的默认值就是光秃秃一个「Loading」，所以不写这个属性的 Spinner，交付的正是这个属性本来要避免的那句播报——那个默认值是占位，不是取值。'],
      ['6e8f13c7', 'className 是在 size 和 tone 之后才合并到环上的，所以它把两个都盖掉：<Spinner size="lg" className="size-4" /> 画出来是一个 16px 的环，而那个本职就是指定尺寸的属性，成了输掉的那一个。'],
      ['e3dab00e', '这里没有任何东西会设置 aria-busy——Button 只为它自己的控件设——所以盖在面板上的 spinner，会让那个面板被播报成已就绪，而它的内容还是旧的、按钮还照单全收点击。'],
    ],
  },
  skeleton: {
    name: '骨架屏',
    summary: ['13170433', '页面到来之前，页面的形状。'],
    when: ['32f123f9', '长到读者会以为页面坏了的等待。描述“接下来是什么”的形状，胜过什么都不描述的一个点。'],
    accessibility: [['b5239702', '一个 live region 在外层，里面每个形状都是 aria-hidden。'], ['1901f3f4', '脉冲也只有外层一个，所以整页一起呼吸，而不是各闪各的。']],
    anatomy: [
      { hash: '4afaec26', element: '外框', description: 'SkeletonPage：带着 role="status"、aria-busy="true" 和那唯一一次脉冲的 div。它是唯一会说话、也是唯一会动的部分——里面的形状两样都不做。' },
      { hash: 'ef81ba6b', element: '标签', description: '外框里那句 sr-only 的话，来自必填的 label。每个形状都是 aria-hidden，所以对读屏用户来说，整个加载态就是这一句。' },
      { hash: 'de13a995', element: '填充', description: 'Skeleton 本身：一个 --stone 的矩形，高一行——h-3——而它是个 div，本来就占满宽度。高是这个元素自己唯一没有的那一维，所以基础组件补上的正是这一维；className 里写什么都会把它换掉。' },
      { hash: 'b756d431', element: '线条、块和圆', description: '架在那个填充之上的三个预设。SkeletonLine 是 12px 高的胶囊，宽度由调用处给；SkeletonBlock 只设了 --radius-sm；SkeletonCircle 是固定 36px 的圆。' },
      { hash: '7595ef68', element: '段落', description: 'SkeletonText：默认三行，最后一行 62%，这样它像散文那样收在半行，而不是齐口收成一张表。' },
    ],
    practices: [
      ['d68d65f8', '哪怕只有一条，也要用 SkeletonPage 把形状包起来。role、aria-busy 和脉冲全长在外框上，所以散着用的零件是 aria-hidden、不出声、也完全不动的——一个永远不会有下文的灰矩形。'],
      ['6d63a623', '每一个 Skeleton 都要给出它所替代的那个东西的高度。基础组件会退回一行高，所以忘了给尺寸的块并不是看不见——它是一根 12px 的条，而那个位置马上要落下一块 160px 的板，页面就按这个差值跳一下。'],
      ['bbfb762e', '接替骨架屏的东西要么自己播报，要么接过焦点。这里的 aria-busy 从来不会翻成 false——外框是被卸载，不是被更新——所以等待的结束，就是唯一在说话的那个东西消失了。'],
      ['c188f539', '不要给零件加 animate-pulse。外框已经在动 opacity，子元素上再来一层会和它相乘，于是这个零件的节奏和它所在的形状对不上。理由不在减少动效那一头：keyframes.css 里那条规则是加在 animation-duration 和 transition-duration 上的通用下限，手写的 Tailwind 动画和别的一样会被压掉。data-folio-animated 是组件在声明自己的动效只是装饰，不是把动效取消掉的那个机制。'],
      ['7d5adf97', '不要把一个 SkeletonPage 套进另一个里。每一个都是带着自己那句 sr-only 的 role="status" 区域，所以由两段骨架拼起来的页面，会为同一次等待播报两条加载消息、标记两个区域忙碌。'],
      ['10e768e3', '不要把一份骨架原样搬到另一个页面。无论它替的是什么，SkeletonCircle 都是 36px、SkeletonLine 都是 12px 高，所以照抄过来的头像位和标题位，在真内容落地的那一刻就是两次必然发生的重排。'],
    ],
  },
  progress: {
    name: '进度条',
    summary: ['6b50fe94', '一条会填充的进度条；终点未知时它来回扫。'],
    accessibility: [
      ['ae3bb479', '不传 value 会去掉 aria-valuenow，读屏听到的是“不确定”，而不是一个猜出来的数字。'],
      ['92ac42b5', 'label 必填——一条没有名字的进度条什么也没说。'],
      ['330fe784', '宽度是由 value 和 max 算出来的，正是 Radix 播报成 aria-valuenow 和 aria-valuemax 的那一对，所以画出来的和说出来的不可能对不上。'],
    ],
    anatomy: [
      { hash: '69d8398f', element: '轨道', description: 'Radix 的根节点：4px 高的 --stone、胶囊圆角，带着 role="progressbar" 和由 label 而来的 aria-label。它默认占满宽度，所以扔进哪一栏就取哪一栏的宽度。' },
      { hash: '5cf33c99', element: '填充', description: '指示条，颜色是 --accent，用 width 而不是 translate 定尺寸，所以在从右到左的文档里它同样是从行首长出来的。只有 value 是数字时才存在。' },
      { hash: '760fcf22', element: '扫动条', description: 'value 为 null 时顶替填充的东西：一根四分之一宽的 --accent 条，只靠 transform 在轨道上走，在 rtl 下会镜像，所以它永远不会被读成进度在倒退。在 prefers-reduced-motion 下，它停在画出来的那个位置，而不是把整条轨道填满。' },
      { hash: 'b4d49433', element: '数值行', description: '轨道上方的一行：左边是 label，右边是等宽数字的百分比。只有设了 showValue 且 value 是数字时才渲染——这也是 label 唯一有机会被看见的地方。' },
      { hash: 'df9f488b', element: '竖列', description: '装着数值行和轨道的 flex 容器。className 落在这里；其余所有属性都转发给 Radix 根节点。' },
    ],
    practices: [
      ['7e967113', '任何确定进度的条都要传 showValue。它是唯一能把 label 放上屏幕的东西——不传的话，这个名字就只以 aria-label 的形式存在，看得见的读者面前只剩一条没有名字、也没有数字的 4px 细线。'],
      ['55193517', '估算一旦不再作数，就立刻把 value 切回 null。填充的宽度是按 --duration-slow 过渡的，所以一个往回修的数字会倒着动一遍，读者眼睁睁看着进度自己往回退。'],
      ['238a16d2', 'max 要设成真实的总数，不要自己先换算成百分比。宽度和 aria-valuemax 取自同一个数字，所以画出来的和播报出来的不会各走各的——但超过上限的值照样会被夹住，一个估少了的总数，会让这条进度在剩下的整段操作里停在满格，而不是承认估错了。'],
      ['9d16d911', '不要传一个不是正数的 max。Radix 会拒收它，打印自己的警告，回退到 100，宽度也跟着一起回退——于是 value={40} 画出来、也播报出来的，是一个没有人选定的上限的百分之四十。'],
      ['d8e05d35', '不要把停住的扫动条读成一个位置。在 prefers-reduced-motion 下，它停在轨道的四分之一处，而那正是一条停在 25% 的确定进度条的样子——把两者分开的只有播报，这也正是不传 value 之所以要紧的原因。'],
      ['f571600f', 'className 作用在竖列上，不是轨道上，所以这样传进来的高度工具类只是把外层容器撑高，那条 4px 的进度条还在原地一动不动。'],
    ],
  },
  alert: {
    name: '提示条',
    summary: ['26c1342e', '关于这个页面的一条消息，就地显示。'],
    when: ['4d7d05a1', '读者需要看见、可能需要处理的事。只需要注意一下的，是 Toast。'],
    accessibility: [['74064425', 'danger 是 role="alert"，会打断；其余三种是 role="status"，等读屏说完这句话。'], ['02812e9f', '颜色由图标和文字双重表达。']],
    anatomy: [
      { hash: '56b945a8', element: '区域', description: '外层容器，带着由 tone 决定的 role 和 aria-live，以及那个 tone 的底色。它不可聚焦、也不是地标，所以它是为已经在这里的读者、以及为那次播报而存在的。' },
      { hash: '52959f3d', element: '标记', description: '18px 的 Remix Icon 字形，按 tone 取——RiInformationLine、RiCheckboxCircleLine、RiAlertLine 或 RiCloseCircleLine——aria-hidden，所以它只为看得见的读者把颜色再说一遍。hideIcon 会去掉它。' },
      { hash: 'e2b77a75', element: '标题', description: 'title，一个 --ink 色、中等字重的段落。是 p 而不是标题元素，所以它永远不会出现在读屏软件的标题列表里。' },
      { hash: '1f9eee31', element: '正文', description: 'children，--ink-2 色、宽松行距，只有真的有标题时才和标题拉开间距。' },
      { hash: '91ea3ac4', element: '操作', description: 'action，在正文下方、区域之内——所以它的标签是跟着这条消息一起被念出来的，而不是要读者自己去找的东西。' },
    ],
    practices: [
      ['ca697642', '有话说的时候把 Alert 挂上，没话说的时候卸掉。一个常驻在页面里的区域只在文字变化时播报，所以第二次提交失败若带着同一句话，就是对谁都没播报。'],
      ['a50615a5', '提交失败后要移动焦点——移到 Alert 上，或者移到它点名的那个字段上。这个组件播报完就待在原地，所以键盘用户是站在原处听到那条错误的，之后没有任何路径回到它。'],
      ['424328a9', '重试、链接或者出口要放进 action，不要在正文里描述它。它在 live region 里面，这就是「播报告诉读者该做什么」和「播报只告诉读者出事了」之间的差别。'],
      ['eb62aaf2', 'hideIcon 拿掉的是给颜色做双保险的两样东西之一，而那些带色底只是纸面上 13–16% 的透明度。标记一没，严重程度就只剩一层读者可能根本分辨不出来的淡色，所以文字必须把它直说出来。'],
      ['33c395d7', 'info 是默认值，也是唯一一个有边框、没有色底的 tone——一条 --rule-2 细线里包着 --paper-2，那就是一张卡片。所以不写 tone 的 Alert 看起来像页面陈设，不像一条通知。'],
      ['86a5ce8a', '不要把 Alert 摞成一份流水日志。每一个都是自己的 live region，所以一页五个就是五条播报在抢同一个语音队列；其中若有一个 danger，它的 assertive 足以打断那四条正在解释它的话。'],
    ],
  },
  'empty-state': {
    name: '空状态',
    summary: ['05f2269f', '一个还什么都没有的集合。'],
    when: ['6fe12ff7', '这里没有出错，所以文案说“接下来做什么”，而不是“什么失败了”。'],
    anatomy: [
      { hash: '27bf7f71', element: '外框', description: '一根居中的竖列，上下各 80px 内边距，两侧是 --page-pad。它是视图尺度的，自己不带任何 role，也没有 live region。' },
      { hash: '56404ef8', element: '圆章', description: '可选的 24px Remix Icon 字形，装在一个 56px 的 --stone 圆里，aria-hidden。它是让这根竖列有个起头的装饰，永远不是消息本身。' },
      { hash: 'e7b727b8', element: '标题', description: 'title，用标题字体、--fs-sub 字号，经由 Heading 渲染。level 决定用哪个元素、默认是 2；字号不跟着它走，所以无论哪一级，标题都是 --fs-sub。' },
      { hash: 'bf62e55c', element: '描述', description: 'description，--ink-3-aa 色，宽度封顶 24rem，这样竖列保持居中的同时，行长仍然是可读的。' },
      { hash: '41313143', element: '操作', description: '接下来该做的那一件事，在描述下方 32px 处，也是这个外框提供的唯一可交互元素。' },
    ],
    practices: [
      ['7107c7d1', '这次替换要你自己播报。这个组件没有 role、也没有 live region，所以用它换掉 SkeletonPage，等于拿走了那个说过「正在加载项目」的区域，却没有放任何东西进去——读屏用户停留在它最后听到的那句话上。'],
      ['71e854e8', '要说清楚这是哪一种空。同一个组件既服务于一个全新的集合，也服务于一个被筛选清空的集合；在一个仍然生效的筛选条件上显示「还没有项目」，是在告诉读者他的项目没了。'],
      ['edf81240', 'level 按它上面那个标题来定。默认的 2 用在页面 h1 正下方是对的；放在一个已经有自己 h2 的区块里，就要传 3。定错了，大纲上就多一个洞，而读屏用户正是靠大纲导航的。'],
      ['cb84a9ee', '不要用它来表示请求失败。被告知集合是空的读者会照着做——重新创建一条他本来就有的记录，或者上报一次根本没发生过的数据丢失——而这之后的补救，比一开始就给一个错误页贵得多。'],
      ['80c624a9', '不要把它放进卡片或面板里。上下合计 160px 的内边距是按顶替一整个视图量的，装进一个带边框的盒子里，它读起来就是一个中间破了个洞的盒子。'],
      ['b925ab6f', '不要往 description 里写一整段。它封顶 24rem 且居中，所以长文案会变成一根又窄又参差的竖条，眼睛在读到那句关键的话之前就已经折返了。'],
    ],
  },
  'error-state': {
    name: '错误状态',
    summary: ['950cf486', '一个没能显示出来的页面。'],
    accessibility: [['0a1eead6', '巨大的状态码是 aria-hidden 的；紧随其后的标题用文字说了同一件事。']],
    anatomy: [
      { hash: 'b29b298a', element: '屏', description: '一个至少一屏高的 section，自己铺 --paper 底色，并给页头留出 96px 的净空。它是一个页面，不是一个区块。' },
      { hash: 'c49ae488', element: '状态码', description: 'code，坐在字号阶梯的最顶端，aria-hidden。它是屏幕上最大的东西，也是读屏用户唯一永远听不到的东西。' },
      { hash: '97a44435', element: '标题', description: 'heading，经由 Heading 以 --fs-heading 渲染，也是第一句被念出来的话。level 默认是 1，因为它顶替的是整个页面；字号是固定的，所以被降成 h2 的错误状态，看上去还是原来那么大。' },
      { hash: 'acd084ea', element: '说明', description: 'message，行长为 --measure-record，「发生了什么」的解释写在这里。' },
      { hash: 'd5336410', element: '操作', description: '回去的路。它是必填而不是可选的，也是这一屏上唯一可聚焦的东西。' },
    ],
    practices: [
      ['5265f7a7', '用它顶替页面，而不是放进页面里。它是一整屏，自带底色和顶部净空，所以嵌在一个已经有页头的布局里，它会在首屏之下再添一屏空白。'],
      ['971d48cf', '客户端失败时要播报它，或者把焦点移进去。这里没有 role、也没有 live region，所以一条把整屏换成它的路由，改掉了看得见的读者眼前的一切，却什么也没说。'],
      ['8666fa8a', 'action 要指向一个真实的目的地，而不是浏览历史。读者常常是冷启动、或者顺着一个链接到达错误页的，所以返回会把他送回刚刚失败的那个页面，或者送回什么都没有的地方。'],
      ['3bdc646c', '在一个已经有 h1 的应用外壳里，不要把 level 留在 1。一份文档上两个 h1，会让标题列表再也说不清哪一个才是这个页面——渲染进外壳、而不是顶替外壳的状态，要传 level={2}。'],
      ['b28581bf', '不要把请求 id、调用链或者一整句话塞进 code。它是 --fs-title 加 leading-none，而且 aria-hidden，所以任何长内容都会变成页面上最大的一块，同时又对最可能需要复述它的那位读者完全不可见。'],
      ['40ecf8f7', '只有一个面板失败、页面其余部分还能用时，不要用它。换掉整屏就把读者赖以脱身的导航一起扔了；把 Alert 放进那个面板里，错误和绕过它的路才都还在。'],
    ],
  },
  toast: {
    name: '轻提示',
    summary: ['3495f862', '一次性的确认，在应用根部挂一次。'],
    when: ['ffb653db', '某件事成功了、且不需要回应。Toast 是被时间关掉的，而时间不算确认。'],
    anatomy: [
      { hash: 'd66c703d', element: 'Toaster', description: '唯一的那次挂载，默认在右下角。它把 sonner 的列表渲染进 body 末尾的一个 portal 里——所以主题是内联样式写的：作用域限定在应用内的样式表根本够不到那里。' },
      { hash: '1bdac60a', element: '令牌样式', description: '把 sonner 的 --normal-bg、--normal-text、--normal-border 和 --border-radius 分别指向 --paper、--ink、--rule-2 和 --radius，再加上无衬线字体。--success-* 和 --error-* 这两组也一并设了，但 sonner 只在 richColors 下才读它们。' },
      { hash: '57c0d11a', element: '通知区域', description: 'sonner 自己的 section，aria-live="polite"，名字是「Notifications altKey+KeyT」。它被移出了 Tab 顺序，只能靠那个快捷键到达；而且对每一种 toast 都是 polite——这里没有 assertive 这条路。' },
      { hash: 'ccd33770', element: '单条提示', description: '一条，由 toast() 或它某个带类型的变体推进来，在 sonner 默认的四秒后从 DOM 里移除——这层封装没有改这个默认值。同时最多看得见三条，其余排队。' },
      { hash: '56f1269d', element: '关闭按钮', description: 'sonner 出厂是关的，这里默认是开的。没有它，出口就只剩计时器和滑动手势，而键盘没有滑动手势。' },
    ],
    practices: [
      ['b9134dbf', '有且只挂一个 Toaster。每一次 toast() 调用都会抵达每一个在监听的 Toaster，所以根布局里一个、嵌套布局里再一个，同一条消息就会在两个角上各渲染一遍。'],
      ['bc3cd26e', '凡是超过一句短话的，都要逐条设 duration。这层封装保留了 sonner 四秒的默认值——念出来大约十个词——剩下的内容还没被读到就已经从页面上移除了。'],
      ['bd800365', '消息只写发生了什么。同一时刻只看得见三条，其余的排队等位，所以一个逐条 toast 的循环，最后展示的是最后三条，其余的送达时读者早已走开。'],
      ['49706156', '在 <html> 上设 data-mode，theme 保持不动。sonner 把描述文字的颜色按主题写死了——#3f3f3f，只有在它自己的 dark 主题下才被覆盖——所以一个由 Toaster 并不跟随的属性刷成深色的页面，会把这抹灰放在 --paper 上，对比度大约 1.85:1，每一条带描述的提示都因此丢掉它的下半句。'],
      ['22268fb0', '任何需要读者动手处理的东西都不该放在这里。四秒是一个从没告诉过他的截止时间，而那个按钮在 body 末尾的 portal 里、键盘最后才够得到——放在 toast 里的「撤销」，是一个大多数人接不住的提议。'],
      ['034719cb', '任何需要读者看第二遍的东西同样不该放在这里——错误码、单据号、要拿到别处去输的名字。这里没有历史记录：计时一到，那段文字就离开了 DOM，再也找不回来。'],
      ['0431fdbf', '不要用 toast.error 报告一次失败，就当作已经报告过了。那个区域对每一种类型都是 polite，所以这条失败会排在读屏软件正在念的内容后面，很可能还没轮到就已经被移除了。'],
      ['d35709ba', '不要传 theme="system"。它读的是 prefers-color-scheme，不是 data-mode，所以一个用浅色页面盖过深色操作系统的读者，会在这个页面上收到一条深色的提示——同一个错配，只是方向反了过来。'],
    ],
  },
}
