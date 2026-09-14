/**
 * The Surfaces group of the Chinese catalogue — 容器 — and nothing else.
 *
 * `content.ts` is still the module every consumer imports. It keeps
 * `ComponentCopyZh`, the foundations, the page copy and the lookups, and
 * assembles `COMPONENTS_ZH` by spreading these ten files in `GROUPS_ZH`
 * order. Nothing imports this one directly.
 *
 * A group is the unit for the same reason it is in the package's own
 * `agent/catalog/surfaces.mjs`, which this file mirrors slug for slug and in the
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

export const SURFACES_ZH: Record<string, ComponentCopyZh> = {
  article: {
    name: '长文',
    summary: ['00774b5f', '长文阅读面——Markdown 能产出的一切，都套上这套系统的字体、颜色和线。'],
    when: ['067ea649', '一篇文章、一条更新日志、一份文档。不是给界面文案用的：卡片里的一段话就是一段话，这是一整列有自己节奏的正文。'],
    accessibility: [
      ['25963585', '默认渲染成 <article>，所以整篇内容是读者可以直接跳到的地标。'],
      ['077fa8f5', '每个标题都带 scroll-margin，锚点跳过去时不会被固定的顶栏盖住。'],
      ['039bbb45', '样式是不分层引入的，所以在文章里它们赢过组件的分层工具类——正是这一点让一个 Markdown 段落把外边距让给文章的节奏。'],
    ],
    anatomy: [
      { hash: '6d0254d2', element: '正文栏', description: 'as 给什么就渲染什么——article、section 或 div——并打上 data-folio-article，article.css 里的每一条规则都限定在它上面。46rem 的行宽，自己不带任何行内外边距，所以父容器把它放哪它就在哪。' },
      { hash: '296f8732', element: '块', description: '直接子元素，节奏就住在这里：每个块上方留白，标题上方更多，第一个块上方没有。往下多包一层的块就落在这条规则之外，也就拿不到它的间距。' },
      { hash: '09cdf26d', element: '渲染好的 HTML', description: 'html，用 dangerouslySetInnerHTML 写进去。给了它，children 就完全不渲染——信任边界在产出这个字符串的那条管线上，因为这里没有任何东西会在半路拦下一个 script 标签。' },
      { hash: '99fb5461', element: '导语', description: 'p.lead——那段引言，--fs-item 字号、满值 --ink。由作者或管线标出来，绝不靠推断：样式表不会把碰巧排在最前面的那一段提拔上来。' },
      { hash: '8fec0b53', element: '超宽的块', description: 'figure、table 和 .folio-wide 是仅有的三样获准越出行宽的东西，因为六列的表格和一张有主体的图，在 46rem 下都读不成。' },
    ],
    practices: [
      ['31d61bb7', '居中要自己来。它设的是行宽，不是布局——没有 auto 外边距，所以在宽页面上它会一直贴着行首那一侧，直到某个父容器把它居中。'],
      ['524d4ca3', '每个块都要是直接子元素：节奏是用子选择器写的，所以在一串段落外面套一个 <div>——哪怕是 display:contents 的，它去掉的是盒子而不是节点——会让这些段落全部丢掉自己的间距。'],
      ['a9a35379', '让管线把宽表格包进 .folio-table-scroll。表格本来就获准越出行宽，自己又没有可滚动的容器，所以八列顶开的是整个页面的横向滚动。'],
      ['f32e96b7', '在字符串到达之前就做净化，并把做净化的那道边界标出来：html 是当作 innerHTML 设进去的，所以一个没净化就走到这个属性的 CMS 字段，就是一处排好了行宽的存储型 XSS。'],
      ['8c026010', '不要同时传 html 和 children——html 赢，children 被丢掉。现在开发环境下会把这件事说出来，可 html="" 仍然算 html，所以一条什么都没渲染出来的管线，会连带把 children 一起拖下水。既有正文又有组件的文章，是前后排的两个 Article，不是一个装下两者。'],
      ['80f0460e', '不要指望嵌进来的组件的工具类在文章里还站得住：article.css 是不分层引入的，无论特异性如何都赢过 Tailwind 的 @layer utilities，所以只要这些规则也设了同一个属性，组件那边就被覆盖。非要保住某个属性的组件，得用内联样式，或者换一个样式表够不到的标签。'],
      ['8f73d175', '不要嵌到六级标题：h5 和 h6 被设成了等宽大写的 11px 眉题，而不是更小一号的标题，所以文档恰好是在最需要层级的那个深度上丢掉了字体层级。'],
    ],
  },
  card: {
    name: '卡片',
    summary: ['4fd4338c', '一块有边界的表面，下面没有阴影。'],
    when: ['3de1b9e7', '需要读作“浮起来”的卡片是 plate，它靠反色分离，而不是靠模糊。'],
    anatomy: [
      { hash: '52a2f097', element: '盒子', description: '一个 <div>，--radius-lg 的圆角，三种底选一种：outline 是页面底色上的一条细线，也是默认；plate 是唯一那块反色的特写面；flat 完全没有边框，给那种网格本身已经在单元格之间画好线的卡片。它不带任何内边距，并且会按自己的圆角裁剪。' },
      { hash: 'c89fde82', element: '头部', description: 'CardHeader——细线之上的一行两端对齐，px-5 py-4：标题贴行首，一个标记或一个动作贴行尾。' },
      { hash: '48dbc3da', element: '标题', description: 'CardTitle，用编辑用的衬线体、--fs-item 字号。除非 as 另有说法，否则是 <h3>；它读的是 --card-title 而不是直接读 --ink，正是这一点让它在 plate 把这个变量改指到别处时仍然看得清。' },
      { hash: '469d37d8', element: '正文', description: 'CardBody——放内容的那口井，p-5、--ink-2、放松的行高。' },
      { hash: '54999fda', element: '页脚', description: 'CardFooter——细线之下安静的一条，等宽的元信息、--ink-3-aa，放元数据或者一个次要动作。' },
    ],
    practices: [
      ['0d1445ce', 'CardTitle 上要传 as：h3 只有在一个自带 h2 的 section 里才对，别处几乎都不对，否则十二张卡片的网格就是十二个 h3，上面没有任何标题可以归属。'],
      ['375fba45', 'plate 里要用 CardTitle，不要自己写标题——plate 把 --card-title 改指到 --on-feature，而一个直接读 --ink 的标题在那块底上算出来是 1.25:1：看不见，而且偏偏只在那个以“长得不一样”为职责的变体上看不见。'],
      ['f046a58e', '不用那些子部件时，内边距要自己加：盒子自己一点都没有，所以直接扔进去的子元素会贴着边框。'],
      ['123613c6', '刻意要探出边界的卡片要传 overflow-visible——一个钉在边上的标记、一个压过描边的控件。盒子默认就裁剪，因为一张磨了圆角却不裁剪的卡片，会让出血图把自己的直角盖在卡片的圆角上。'],
      ['21d838f9', '带 onClick 的 Card 就是一个带 onClick 的 div——不可聚焦、不会被播报、键盘够不到。把一个真正的控件放进去、让它铺满，这样被播报的是一个按钮，而整张卡片仍然是那个可点区域。'],
      ['4d88a7f2', '一屏上 plate 不要花第二次：它是系统唯一那块反色的表面，而一整条都是 plate 的区块，已经没有底色可供它反过来。'],
    ],
  },
  'app-shell': {
    name: '应用外壳',
    summary: ['ca6c32a4', '桌面上两栏，手机上一栏加抽屉。'],
    accessibility: [
      ['2596c8ba', '抽屉除了点遮罩，也能用 Escape 关闭，所以键盘用户不会被困在里面。'],
      ['4ac7c5d3', '遮罩是 <button>，因为带 onClick 的 div 既够不到也不会被播报。'],
      ['358f51cf', 'md 以下，关上的抽屉带着 inert，所以里面的链接是退出了 Tab 顺序、也退出了无障碍树，而不只是被挪到屏幕外。md 以上它从不带 inert：在那里，侧栏就是这个页面的导航栏。'],
      ['2e684f96', '两种关法都把焦点送回开关按钮。留在 inert 子树里的焦点会被浏览器直接扔掉，而遮罩更糟——它自己就是那个被聚焦的元素，然后它卸载了。'],
    ],
    anatomy: [
      { hash: '2e904340', element: '框架', description: '根节点：--paper 底上 min-h-svh，手机上一栏，md 及以上是 15rem 的侧栏加一栏 1fr 的内容。它只是那个网格，别的什么都不是——没有内边距，也没有行宽。' },
      { hash: 'c4f50f59', element: '侧栏', description: '一个由 sidebarLabel 命名的 <aside>，15rem 宽。桌面上是一列静态的网格列；手机上是一个固定定位的抽屉，从阅读起始的那一侧滑出来，所以在从右到左的文档里它是从右边来的。' },
      { hash: 'f3c213cc', element: '品牌位', description: 'brand，放在侧栏顶部一行 3.5rem 高、下面压一条细线的位置——和顶栏同高，所以两条线在栏与栏的交界处接得上。不传它，导航就从最顶上开始，那条线也没有了。' },
      { hash: '7497d31d', element: '导航', description: '一个由 navLabel 命名的 <nav>，默认叫「Primary」，装的是 sidebar 属性。会滚的是它，用的是 scroll-slim，所以长过这一栏的列表，是在一个纹丝不动的品牌位下面走。' },
      { hash: 'f6d019c3', element: '顶栏', description: '一条粘性的 3.5rem 页头，--paper/85 加背景模糊，下面一条细线，先装开关再装 topbar。传不传，它都渲染。' },
      { hash: '54b65d2a', element: '抽屉开关', description: '一个 44px 的按钮，只在手机上出现，在 Menu 和 X 之间换图标，带着 aria-expanded 和指向侧栏的 aria-controls。它唯一的名字是 openLabel 或 closeLabel。' },
      { hash: '9454d8d0', element: '遮罩', description: '一个铺满屏幕、由 closeLabel 命名的 <button>，只在抽屉开着时挂载，md 及以上隐藏。' },
      { hash: 'fd76a68e', element: '内容井', description: 'contentAs——默认是 <main>——按 --w-page 居中，两侧 --page-pad，上下 py-8。行宽和页面内边距都是外壳的，所以再自己加一层的子元素，是把第二道行宽套进第一道里面。' },
    ],
    practices: [
      ['71921dfe', '外壳渲染在另一个页面里时要传 contentAs="div"——文档里的预览、截图用的架子。一份文档只能有一个 main，多出来的第二个会让辅助技术回答不了“内容在哪”。'],
      ['57f03f09', '一个页面可能装下两个外壳时，两个地标都要命名：sidebarLabel 和 navLabel 是区分两个 complementary 的唯一办法，也是非英语应用让读者读得懂地标名称的唯一办法。'],
      ['d8bc7fed', 'openLabel 和 closeLabel 要跟着其他文案一起翻译——那个开关里只有图标、没有文字，所以在应用的每一个页面上，这两个字符串就是它全部的可访问名称。'],
      ['363cd169', '整个侧栏都放进 sidebar 属性，让那个 nav 去滚：自己搭这一栏、把品牌位塞在里面，长列表就会把品牌位一起带出屏幕顶部。'],
      ['fe8bf0da', '不要把关上的抽屉当成已经卸载：md 以下它是被平移出屏幕并标上 inert，不是被移除，所以里面每一样东西照样渲染、照样跑自己的副作用——一个会自己量尺寸的导航项，量的是一个谁也看不见的盒子。'],
      ['fffae907', '不要以为不传 topbar 就没有那条栏：页头照渲染不误，所以一个上面没东西可放的外壳，照样要付出 3.5rem 和一条横贯页面的线。'],
      ['aeb09e8b', '不要再给 children 套一层自己的 max-width 和页面内边距——那口井两样都已经加过了，内容最后落在“中间的中间”。'],
    ],
  },
  'page-header': {
    name: '页面开头',
    summary: ['f3624487', '一个页面的开头：这一页是什么，以及什么在限定它。'],
    when: ['c37c0622', '一条路由自己那一栏的最上面。AppShell 是页面外面的那个框；这个是框里面的第一样东西。'],
    accessibility: [
      ['ae1812f9', '标题默认是一个 h1，所以无论外面那层外壳在做什么，这个页面在标题列表里都有名字；而当这个开头并不属于这份文档时，level 会把它挪走。'],
      ['332c9b24', '那个 <header> 就是这一页的 banner 地标，也是按地标导航的读者最先跳到的地方。'],
    ],
    anatomy: [
      { hash: '89cef44b', element: '页头', description: '一个 <header>，因此也是这一页的 banner 地标。一列内容，下面压一条细线，线下面留 24px——自己不带上边距，所以页面从哪里开始由外壳决定。' },
      { hash: 'a72034c2', element: '路径', description: 'breadcrumb，在所有东西的最上面，收的是已经渲染好的 Breadcrumb 而不是它的 items——每一节仍然由调用处自己接到路由上。外面那个框已经钉了一条路径时就不传。' },
      { hash: '3f7dad90', element: '眉标', description: 'eyebrow，等宽小字，--ink-3-aa，在标题上方，绝不在下方。可以是页面编号，也可以是这一页所属的板块。' },
      { hash: '384b92e0', element: '标题', description: 'title，经 Heading 渲染，字号 --fs-heading；除非 level 另有说法，否则是一个 h1。字号从不跟着层级走：在大纲的每一档上，一个页面开头都站在一块工作界面上方，而不是站在一份「主题就是标题本身」的文档上方。' },
      { hash: '68e15bbd', element: '控件位', description: 'actions，和标题同基线，靠行内末端。放的是「说明标题指的是哪一段」的控件——时间范围、范围切换——不是作用在那些记录上的控件。' },
      { hash: 'd1e2779c', element: '说明', description: 'description，在标题下面，按 --measure-record 收住行宽，这样它保持在一个读得下去的宽度，而它上面那一排照样占满整幅。' },
    ],
    practices: [
      ['4f8821b7', '时间范围选择器放这里，不要放在表格上方。它限定的是标题——它说的是这一页讲的是档案里的哪一段——而放到线下面，它就变成一条工具栏，和页面开头那一横排争起来。'],
      ['1996b6e1', '外壳已经钉住一条路径时，就不要传 breadcrumb。一屏上两条路径，是对「我在哪」的两个回答，而读者两条都会去看。'],
      ['dbba2dd1', '不要在一个页面上渲染两个 level 1 的开头。每一个都是 h1，所以就标题导航而言，第二个就是第二份文档；而放在一个已经有自己 h1 的页面里的预览或模板，正是 level 要解决的场景。'],
      ['d113927f', '不要把第二条结论塞进 description。一句话说明这一页是干什么的就够了；一个会变的数字属于线下面，放在那些跟它可比的数字旁边。'],
    ],
  },
  calendar: {
    name: '日历',
    summary: ['b65350cb', '一个月，画成一格一格的天。'],
    when: ['649a9bee', '单独用来看范围或排期；放进 DatePicker 里用来选一天。'],
    accessibility: [
      ['5b7a9ae7', '方向键走一天，Page 键走一个月，Home 和 End 到这一周的两端。'],
      ['b68a8fcc', '“今天”是描边，“选中”是填充——一个是日历自身的事实，一个是读者做的选择，两者不能长得一样。'],
      ['1885e8fc', '年和月是一整面按钮，不是原生的 select：平台给的一百年列表是在滚动而不是在选择，而且样式由操作系统决定。'],
      ['9d92b6dd', 'Tab 在打开的面板里循环。面板是不透明的，日期网格还挂在它下面，所以一个走出去的 Tab 会把读者放到一个他看不见的日子上——而且越过了那个持有 Escape 处理逻辑的月份标题。'],
      ['076b30ec', '默认前后各十年。生日需要更宽的范围，用 startMonth 去要。'],
    ],
    keyboard: [['e6051b97', '移动一天。'], ['69e23773', '移动一周。'], ['36f40457', '移动一个月。'], ['01791dc9', '跳到本周的第一天或最后一天。'], ['96a633b1', '选中当前聚焦的那一天。']],
    anatomy: [
      { hash: '16a4118b', element: '日期网格', description: '这个月：一行等宽的星期名，下面每天一个 36px、胶囊圆角的按钮，多数月份五行，有些月份六行。相邻月份的日子照样画出来、只是压暗，而不是留成窟窿。' },
      { hash: 'd78b2aa9', element: '月份标题', description: '「September 2026」是一个带 aria-expanded 的按钮，不是两个下拉——日期本来就是这么说出口的，而拆开会在一行 250px、还得塞下两个箭头的地方放进四个控件。' },
      { hash: 'd0323c6a', element: '月份箭头', description: '库自带的 nav，被抬出文档流、以同样的 36px 高度铺在月份标题这一行上，所以两个箭头正好落在月份名的两头。选择面板打开时两个都退场：改月份有两条路、其中一条还藏在面板后面，就是多了一条。' },
      { hash: 'dc59b6b9', element: '年月选择面板', description: '一个 role="dialog"，画在日期网格原来的位置上，而不是盖在它上面——十二个月排成 3×4，最多二十四个年份排成 4×6，尺寸和它替下去的那张网格完全一样。打开时焦点移进来，Tab 在里面循环；Escape 关掉它，并把焦点送回月份标题。' },
      { hash: '37cc734b', element: '日期标记', description: '今天是一圈描边，选中是一块填充。在区间里，淡底铺在单元格上，填充落在两端那两个按钮上，正是这一点让区间读起来是一条两头圆的带子——也让只有一天、两端重合的区间照样是圆的。' },
    ],
    practices: [
      ['e9a8a9c7', 'locale 要传，别指望页面的 lang：月份标题是 Intl 按 locale.code 格式化出来的，兜底是 en-US，所以在这个属性设上之前，一个法语日历说的是「September」。'],
      ['13586c50', '通过 classNames 覆盖某个槽位时，要把库自己的类名加回去——你的是替换掉我们的，而我们那份带着下游每个选择器都依赖的 .rdp-* 钩子。覆盖 root 时漏掉 rdp-root，就把那个钩子从树上摘掉了。'],
      ['7ae99171', '标注可用性要走 classNames 的槽位，不要去给日期按钮加样式：淡底属于单元格，标记属于按钮，而加在按钮上的背景会把区间那个圆头压平。'],
      ['9161127a', '把范围放宽之前，先知道代价：年份网格一次翻 24 个，所以默认前后各十年正好一页、不用翻，而一个宽到能选生日的范围，意味着读者要一页一页翻到 1974。'],
      ['3681ba05', '选择面板上的那圈文字要和 locale 一起翻。locale 只管到月份名就到头了，所以一个设好了这个属性的法语日历，在 CalendarLabels 那几个属性传进来之前，两个面板和四个箭头叫的仍然是「Month and year」「Previous year」和「Earlier years」。'],
      ['fedc8490', '不要用宽度类去把它撑开：它是 w-fit，列宽固定在 36px，所以 w-full 只是替掉了 w-fit，同一张网格照旧贴在一个更宽的盒子的行首那一侧。'],
      ['674c1067', '不要把它切成固定高度。网格多数月份五周、有些月份六周，而选择面板是按网格取的尺寸、自己没有高度——照着一个五周的月份量出来的盒子，会把第六周裁掉。'],
      ['932e115d', '不要用 components 去替掉 MonthCaption：年月选择面板就住在我们这个里面，所以自定义的标题会让读者只剩两个箭头，一次挪不过一个月。'],
    ],
  },
  'scroll-area': {
    name: '滚动区域',
    summary: ['44c95711', '一个会滚动的盒子，滚动条在哪都长一样。'],
    when: ['835994ed', '有边界的面板——很长的选项列表、一段日志。页面级或正文滚动用 scroll-slim 工具类更轻，也不需要组件。'],
    accessibility: [
      ['ca45a09d', '视口保持可聚焦。一个内容本身不可聚焦的滚动区域没有 Tab 停靠点，折线之外的一切对没有鼠标的人等于不存在。'],
      ['eaab86d4', 'label 必填，因为一个没有名字的键盘停靠点只会播报“group”。'],
      ['a49ae4cd', '除非调用方去收窄 orientation，否则两个轴都会滚，所以比盒子宽的内容仍然够得到，而不是在没有滚动条的情况下被裁掉。'],
    ],
    keyboard: [['9b542320', '把焦点移进这个区域——没有鼠标时，这一步才让它能滚。'], ['3d74d9ec', '滚动它。']],
    anatomy: [
      { hash: '475b8be8', element: '根节点', description: '那个有边界的盒子，className 也落在它上面。它是 overflow-hidden，自己没有尺寸，所以你在这里给的高度，是决定到底有没有东西会滚的唯一因素。' },
      { hash: 'd9b87cd9', element: '视口', description: '真正在滚的那个元素，也是带着 role="region"、tabIndex 0 和 label 的那个。Radix 在它上面把平台的滚动条藏起来，并把没有配滚动条的那个轴设成 overflow: hidden。它是定位过的，所以绝对定位的后代会跟着内容一起走，而不是一动不动地悬在上面。' },
      { hash: 'f30c8b00', element: '滚动条', description: '每个方向一根：8px 的轨道，--rule-2 的胶囊滑块，touch-none——手指滚的是内容，不是这根条。只有指针在区域里时才画出来，停止滚动约 600ms 后淡出。' },
      { hash: '80629fde', element: '直角', description: '两根滚动条交汇处那个小方块，只有 orientation="both" 时才存在——而那正是默认值。' },
    ],
    practices: [
      ['8597e81e', '要给它一个高度。不给，根节点就和内容一样高，永远不会溢出，这个组件给页面添的就只有一个键盘停靠点。'],
      ['0325ecb3', '只有在“裁掉另一个轴”正是你的本意时，才去收窄 orientation。两个轴默认都会滚，因为没有配滚动条的那个轴被设成了 overflow: hidden——越过那条边的东西不只是没有标记，是任何按键、任何手势都够不到，而内容明明好端端地渲染着。'],
      ['759f665d', '内容正好齐着边界收尾时要传 type="always"：平台的滚动条被藏了，我们这根又要等指针进来才画，所以静止时屏幕上没有任何东西说这个盒子会滚。'],
      ['180e58ac', '不要在它上面再造一套拖动滚动的交互——滑块是刻意设成 touch-none 的，视口是一个真正的溢出容器，所以触摸拖动、惯性和滚轮本来就归平台管，行为也正是读者预期的那样。'],
      ['394caa07', '不要在同一个轴上把一个套进另一个里：内层视口会一直吃掉滚轮事件，直到自己滚到头，所以想滚外层列表的读者，滚动的是内层那个。'],
    ],
  },
  'description-list': {
    name: '描述列表',
    summary: ['9a478d5d', '一条记录的各个字段，用真正的 <dl>，不是一堆 div 拼的网格。'],
    when: ['7b9466ce', '正面看一条记录——详情页、摘要面板。从上往下看好几条记录，那是 Table。'],
    accessibility: [
      ['82362955', '真正的 <dl>、<dt> 和 <dd>，读屏软件靠它才知道一个标签命名的是它旁边那个值。'],
      ['beb38844', '每一对包在一个 <div> 里，规范允许 <dl> 里出现它，辅助技术也会直接读穿过去。'],
      ['cc919fdb', '空列表渲染成 null，而不是一个空的 <dl>，所以不会有谁去播报一个一项都没有的列表。'],
    ],
    anatomy: [
      { hash: '000f1434', element: '列表', description: '那个 <dl>。配对关系是靠这个元素承载的：一堆 div 拼的网格长得一模一样，告诉读屏软件的却是“两列互不相干的文字”。' },
      { hash: 'f6c25d6f', element: '一对', description: '包住每组 dt/dd 的一个 <div>，HTML 规范允许它出现在 <dl> 里，正是为了让一对能作为一个整体来排版。细线画在它上面，所以那条线横穿整行，而不是在列间距处断掉。' },
      { hash: '65a93090', element: '名称', description: 'item.term，渲染成 <dt>、--ink-3-aa。在行式布局里，它在 sm 及以上占一栏 12rem，往下就改成上下堆叠，因为手机上一栏 12rem 的标签，只给值留下大约八个字符的宽度。' },
      { hash: 'e701b951', element: '描述', description: 'item.description，渲染成 <dd>、--ink-2，浏览器默认的外边距被清掉。它收的是节点而不是字符串，所以一个值可以是 Badge、一个链接或者一个 Timestamp。' },
      { hash: '72233f7b', element: '细线', description: 'divided，默认开：除最后一对外，每一对下面一条 --rule。放进 Card 里就关掉它，Card 自己已经有边了。' },
    ],
    practices: [
      ['dbef9c12', 'items 为空时，就让它什么都不渲染。它返回的是 null，不是一个带边框的空盒子，所以上层页面可以自己去显示一个 EmptyState，而不是围着空无一物画一圈细线。'],
      ['25c00510', '值是一个状态或一个链接时，就往 description 里放元素——它是 <dd>，所以 Badge、一个 <a> 或者一个 Timestamp 本来就该待在那儿，不用拿一串文字去假装。'],
      ['d2db557b', '行会增删或重排时，每个 item 都要传 id。不传就拿下标当 key，这对一个记录页渲染的固定字段列表是对的，对一个会变形的列表就是错的。'],
      ['dd3fd884', '不要拿它去展示好几条记录。每个 dt 都会沿着页面重复一遍，而对照两条记录的读者只能把两边都记在脑子里——Table 的列标题存在的意义，就是免掉这件事。'],
      ['e84489ac', '窄侧栏里不要用 layout="row"。它只在 sm 断点上折叠，而那是视口的断点、不是容器的——一个 20rem 的面板里塞一栏 12rem 的标签，值就没地方了。那种地方用 layout="stacked"。'],
    ],
  },
  toolbar: {
    name: '工具栏',
    summary: ['6829cd52', '贴在工作区边缘的那条动作栏。'],
    when: ['fcec024c', '表单滚动时仍然要够得着的那几个动作，或者一个列表上方的筛选条。不是页面头部——那是 AppShell。'],
    accessibility: [
      ['9fa82256', 'label 必填，它就是这个 group 的可访问名称，所以一个同时有筛选条和动作条的页面播报出来的是两个不同的东西。'],
      ['2e7f1ee1', '每个控件都保留自己在 Tab 顺序里的位置，因为这条栏刻意不去声明 role="toolbar"，也就不去认它那份“只占一个 Tab 停靠点”的约定。'],
      ['2e5ba7fd', '底是不透明的，所以栏上的控件对比度永远是对着 --paper 算的，而不是对着此刻正从背后滚过去的随便什么东西。'],
    ],
    keyboard: [['4885e6f9', '依次走到每一个控件——这条栏本身不是一个停靠点。']],
    anatomy: [
      { hash: 'de27d705', element: '栏', description: '一个由 label 命名的 <div role="group">，在 --z-sticky 层级上用一行 flex 装着 children。它不是 role="toolbar"：那个角色承诺的是只占一个 Tab 停靠点、控件之间用方向键走，而这里根本没有实现那套东西。' },
      { hash: '7fdc45ac', element: '底', description: '不透明的 --paper，而且刻意不用模糊。内容是从这条栏底下滚过去的，所以任何半透明都会把表格的最后一行摆到提交按钮背后，两样都变得没法读。' },
      { hash: 'db89699a', element: '边线', description: '在栏所贴的那一侧画一条 --rule-2 细线：贴底就是 border-t，贴顶就是 border-b。position="static" 保留这条线，只去掉粘性。' },
      { hash: '10d95f3b', element: '动作', description: 'children，排在一行 --gap 为 3 的可换行 flex 上。align 决定它们在行内轴上的位置，默认是 end，也就是表单主要动作该在的地方。' },
    ],
    practices: [
      ['7609e7f2', 'label 就写这条栏是什么——「表单动作」「列表筛选」。没有名字的 group 会被播报成“group”，而一个页面上有两条，就把同样的空话播报两遍。'],
      ['d962f82e', '用 position="bottom" 时，要给会滚动的那个祖先一个高度。粘性元素是在自己的滚动容器里粘住的，所以一条栏如果所在的容器和内容一样高，它就没有可粘的东西，只会老老实实待在末尾。'],
      ['f9fd7e19', '只放动作。长出了标题、状态和面包屑的栏就是页头，而一个跟着读者往下走的页头，等于让页面能看见的部分变少了。'],
      ['66e470b0', '不要通过属性把 role="toolbar" 加上去。这个角色是在告诉读屏用户：方向键可以在控件之间移动；而这里没有任何东西实现 roving tabindex，所以那些键什么都不会做，这个承诺就是假的。'],
      ['f7a1e800', '不要为了“让内容透出来”把底做成半透明。会透出来的那点内容，正是读者正想读的那一行，和他正想按的那个按钮。'],
    ],
  },
  'aspect-ratio': {
    name: '宽高比',
    summary: ['12d20bea', '一个盒子，不管里面装什么都保持形状。'],
    when: ['ae85aa98', '高度必须在内容加载之前就知道——否则每来一张图就要重排一次的媒体网格。'],
    accessibility: [
      ['feb60e42', '一个没有 role 的普通盒子：它只约束几何，什么都不说，所以里面的 <img> 留着自己的 alt，无障碍树上不会多出任何东西。'],
      ['64526b12', '在内容到达之前先把高度占住，下面的东西才不会在指针或读者点下去的那一刻从底下挪走。'],
    ],
    anatomy: [
      { hash: 'c298c636', element: '盒子', description: '一个 relative、占满宽度的 <div>，aspect-ratio 是以内联样式挂上去的。用样式而不用类，是因为 Tailwind 只能生成它在源码里逐字读到的东西，而这个值是运行时才到的。' },
      { hash: '472ef666', element: '子元素', description: '每一个直接子元素，都被抬出文档流、拉满整个盒子。比例守得住靠的就是这一点：里面没有任何东西能贡献高度，所以本身没有固有尺寸的内容照样拿到整个盒子。' },
      { hash: 'a2996f72', element: '裁切', description: '直接子级的 <img> 或 <video> 上的 object-cover，所以媒体是填满盒子，而不是在里面留出黑边。不能被裁的内容自己设 object-contain。' },
    ],
    practices: [
      ['d05fa5bd', '凡是图片落地时本来会引起重排的地方，都该用它。那次重排就是 Core Web Vitals 分数在量的布局偏移，而把盒子先占住就是全部的修法。'],
      ['e4b8e1de', '整幅画面都重要时，要在子元素上设 object-contain——logo、图示、截图。默认是裁切，这对照片是对的，对任何边缘本身有含义的东西都是错的。'],
      ['90220dcc', '要给它一个宽度。它是 w-full，所以放进一个自己没有宽度的容器里，它也就没有高度，而一个有比例、没有尺寸的盒子等于不在。'],
      ['2c1c4fbf', '不要在它旁边退回 padding-top 百分比那套老办法。那个百分比是对着宽度解析的，这既是它能成立的原因，也是它作为 flex 子项就失效、还会把元素自己的内边距吃掉的原因。'],
      ['ae241ce8', '不要往里放文字还指望盒子会变高。每个子元素都是绝对定位的，所以比盒子长的段落是被 overflow-hidden 裁掉，而不是把盒子撑开。'],
    ],
  },
}
