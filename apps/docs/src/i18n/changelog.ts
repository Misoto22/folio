import { fingerprint } from './api-hash'
import type { Locale } from './locales'

/**
 * The changelog, in Chinese.
 *
 * KEYED BY THE FINGERPRINT OF THE ENGLISH, which is the whole design. The
 * changelog is assembled from `CHANGELOG.md`, so a translation of it is a copy
 * the original can move out from under — and the file is written by whoever
 * shipped the change, in English, at a moment when nobody is thinking about
 * this catalogue.
 *
 * With the English's own fingerprint as the key, drift cannot produce a lie: an
 * entry that is reworded stops matching and the page falls back to the English
 * it no longer has a translation for. That is the right failure. `api.ts` pairs
 * a hash with each entry and a test enforces it, because a doc comment is
 * edited by the same person in the same commit; a changelog line is not, and a
 * build that fails on every changeset would be a build people route around.
 *
 * `changelog.test.ts` therefore gates two things and not a third. It fails on
 * an ORPHAN — a translation whose English exists neither in the changelog nor
 * in a pending `.changeset/*.md`, which is certainly a mistake rather than a
 * backlog — and on the LATEST release being short a line, because a release the
 * page leads with reading half in English is worse than one that reads wholly
 * in English. An older release missing a line is neither; it falls back and
 * stays readable.
 *
 * THE CHANGESET HALF OF THAT IS WHAT MAKES A RELEASE POSSIBLE AT ALL, and it is
 * the case the original design did not anticipate. `CHANGELOG.md` is written by
 * the Version Packages pull request, so the strings first exist there and this
 * file is first found wanting on that pull request's `verify` — which, since the
 * release App opens it, is a check that runs and blocks the auto-merge. A
 * missing line is therefore a release that does not happen, rather than one that
 * happens half in English. But a translation written BEFORE the bump has no
 * changelog entry behind it yet and would read as an orphan, and it cannot be
 * parked on the release branch either: the changesets action force-pushes
 * `changeset-release/main` and rebuilds it from scratch whenever `main` moves.
 *
 * A translation written before its release ships is not an orphan — it is
 * early, and the changeset is the proof, because `.changeset/*.md` holds
 * exactly the text `changeset version` is about to turn into changelog entries.
 * So translate a release from its changesets, onto `main`, before the bump.
 * Text in no release and in no changeset is still an orphan, which is what
 * keeps this a gate. See `docs/releasing.md`.
 */
const ZH: Record<string, string> = {
  [fingerprint("Add reusable website compositions for navigation, portfolios, archives, reading, media, forms, search, metrics and conversations.")]: "新增网站组合组件，涵盖导航、作品集、内容列表、阅读页、媒体、表单、搜索、统计和对话界面。",
  [fingerprint("The separate `@misoto22/design/website` entry owns presentation and accessible interactions. Hosts supply localized labels, router links, content and service state; chart engines remain in the optional charts entry.")]: "独立的 `@misoto22/design/website` 入口统一负责界面呈现与无障碍交互。使用方提供本地化文案、路由链接、内容和服务状态；图表引擎仍由可选的 charts 入口单独引入。",
  [fingerprint("The portable `website.css` entry and compiled stylesheet share the canonical tokens. Offline documentation includes every family and its server and client exports.")]: "独立的 `website.css` 与编译后的完整样式共用同一套设计变量。离线文档覆盖所有新增组件组及其服务端、客户端导出。",
  // ─── unreleased ───
  [fingerprint(
    "`StepSequence` now draws the core `Steps` rail, and `ClipboardButton` shares `CodeBlock`'s copy state, including what a refused clipboard write does.",
  )]: '`StepSequence` 现在直接用核心 `Steps` 的流程轨道绘制，`ClipboardButton` 也与 `CodeBlock` 共用同一套复制状态，包括剪贴板写入被拒绝时的处理。',
  [fingerprint(
    'The website rail was a second implementation of the same figure — marker, connector, name and note — at its own sizes. It now renders through the same internal rail item as `Steps`, so its markers are the core 2rem circles with sans counters and the anchor no longer sets its label in medium weight. Host counters, tags, the caption, `data-anchor` and the ARIA list roles that keep article prose from restyling it are unchanged, and the anchor is still not announced as the current step.',
  )]: '网站版流程轨道原本是同一种图形的第二套实现——标记、连接线、名称和注释——而且尺寸自成一套。现在它与 `Steps` 通过同一个内部轨道条目渲染，所以标记变成核心的 2rem 圆形、编号改用无衬线字体，锚点步骤的名称也不再使用中等字重。应用提供的编号、标签、说明文字、`data-anchor`，以及让文章正文样式不去改写它的 ARIA 列表角色都保持不变，锚点仍然不会被播报为当前步骤。',
  [fingerprint(
    'Both copy controls confirm for 1600ms from the latest accepted write. A refused write now clears any confirmation still showing instead of leaving it up, and names the refusal once in development as `CLIPBOARD_WRITE_REJECTED`.',
  )]: '两个复制控件都会从最近一次被浏览器接受的写入起确认 1600 毫秒。写入被拒绝时，现在会清除仍在显示的确认状态，而不是继续显示成功；在开发环境中还会以 `CLIPBOARD_WRITE_REJECTED` 提示一次原因。',
  [fingerprint(
    '`CalendarHeatmap` — a year of daily readings as a week-by-week grid, built from the dates rather than from the order of the array.',
  )]: '`CalendarHeatmap`——一年的每日读数，画成一周一列的网格，而且是按日期搭出来的，不是按数组顺序。',
  [fingerprint(
    '`Heatmap` draws named rows and columns and knows nothing about dates, so every consumer wrote the calendar on top of it and none of them wrote it the same way twice. What that costs is not effort but correctness: given a bare list of counts, one missing Tuesday shifts every reading after it by a cell, and the result is a plausible picture of a year that did not happen.',
  )]: '`Heatmap` 画的是有名字的行和列，对日期一无所知，于是每个使用方都在它上面自己写一遍日历，而且没有两次写法相同。这件事付出的代价不是工时，而是正确性：给一串光秃秃的计数，少了一个星期二，它后面的每一条读数都会挪一格，结果是一张看上去很像样、却根本没发生过的一年。',
  [fingerprint(
    "**A day with no entry is a gap, not a zero.** \"Nothing happened\" and \"nothing was recorded\" are different readings, and a grid that draws them alike invites the reader to explain an outage that was a hole in collection. `null` renders as a dashed outline and announces \"no data\"; zero is the palest cell on the ramp.",
  )]: '**没有对应项的那一天是空缺，不是零。** 「什么都没发生」和「什么都没记录下来」是两条不同的读数，而把它们画成一样的网格，是在请读者去解释一次其实只是采集断了的故障。`null` 渲染成一圈虚线轮廓并播报「无数据」；零则是色阶上最淡的那一格。',
  [fingerprint(
    'Every bound is a UTC midnight parsed out of `YYYY-MM-DD`, because a local-time calendar drawn in two timezones is two different calendars and the disagreement is exactly one day wide — small enough to survive review, large enough to move a reading into the wrong week.',
  )]: '每一个边界都是从 `YYYY-MM-DD` 按 UTC 零点解析出来的，因为一张按本地时间画的日历，在两个时区里就是两张不同的日历，而两者的分歧正好是一天宽——小到能混过评审，大到足以把一条读数挪进错误的那一周。',
  [fingerprint(
    '`Heatmap.formatValue` now receives the cell as well as the number. It is what makes `describe(value, date)` possible at all: two days with the same count are two different readings, and the row and column a cell is announced with are a weekday and a month spanning five weeks. Existing callers are unaffected — the parameter is additional and a one-argument formatter still satisfies the type.',
  )]: '`Heatmap.formatValue` 现在除了那个数字，还会拿到这一格本身。正是它让 `describe(value, date)` 成为可能：两天数目相同，是两条不同的读数，而一格被播报时带的行和列，是一个星期几加上一个横跨五周的月份。已有的调用方不受影响——这个参数是加上去的，一个只收一个参数的格式化函数照样满足类型。',
  [fingerprint(
    '`Metric` — the stat tile that sits four across on a console: a label, a monospaced figure, a status tone and a free slot under the number.',
  )]: '`Metric`——控制台上一排四个的那种读数小块：一个标签、一个等宽数字、一个状态色调，以及数字下面一个自由槽位。',
  [fingerprint(
    '**`BigNumber` was the only figure in the set and it is the wrong size for four of them.** It is one headline in the editorial face with a delta under it, for the ONE number a view is about, and it needs the charts entry. A dashboard whose tiles have to be a `<div>` because the delta does not apply is a dashboard with two tile designs in it, which is what every console built on this package had.',
  )]: '**这套系统里表示数字的只有 `BigNumber`，而一排四个要的不是那个尺寸。** 它是一条编辑体的标题、下面挂一个 delta，给的是「整个视图就讲这一个数字」的场合，而且要用 charts 入口。一个因为 delta 用不上、只好把某些小块写成 `<div>` 的仪表盘，是一个装着两种小块设计的仪表盘——而每一个建在这个包上的控制台，都正是这样。',
  [fingerprint(
    'The figure is monospace and tabular by construction rather than by a prop. Four tiles in a row are read down the column as much as along it, and proportional digits put the same magnitude at two different widths — which is a comparison the reader came for and cannot make.',
  )]: '数字用等宽加表格数字，是按构造定下来的，不是靠某个属性。一排四个既是横着读的，也是顺着这一列往下读的，而比例数字会把同一个量级排成两个宽度——那正是读者来做、却做不成的那个对比。',
  [fingerprint(
    "`asChild` is how a tile becomes a link, and it is `Slottable` underneath rather than a bare `Slot`: a bare one hands the child the props and leaves it holding its own content, so `<a href=\"…\" />` would render a correctly styled empty box and nothing would say so. The whole plate becomes the link, which also means the link's accessible name is every word in the tile, read in order.",
  )]: '一个小块靠 `asChild` 变成链接，而底下用的是 `Slottable` 而不是光秃秃的 `Slot`：光秃秃的那个只把属性交给子元素，内容仍旧是子元素自己的，于是 `<a href="…" />` 会渲染出一个样式完全正确的空盒子，而且没有任何地方会提一句。整块板变成那个链接，这也意味着链接的可访问名称就是这块板里每一个词按顺序读一遍。',
  [fingerprint(
    '`PageHeader` — a page opening, with the order of its parts fixed: the trail, the kicker, the title, the controls that qualify it, and the sentence under them.',
  )]: '`PageHeader`——一个页面的开头，各部分的顺序被固定下来：路径、眉标、标题、限定它的那些控件，以及它们下面那句话。',
  [fingerprint(
    'The system had `Heading` for a heading and `Breadcrumb` for a trail and nothing that said how a page STARTS, so every application invented the arrangement — and the eyebrow landed above the title on one screen and below it on the next. Two consoles built on this package had two different answers, which is one more than a design system is for.',
  )]: '系统里有 `Heading` 管标题、`Breadcrumb` 管路径，却没有任何东西规定一个页面该怎么「开始」，于是每个应用都自己发明一套排法——眉标在这一屏落在标题上面，在下一屏落在标题下面。两个建在这个包上的控制台给出了两个不同的答案，而这比一套设计系统该允许的多了一个。',
  [fingerprint(
    '**Where the range picker goes is the argument.** It sits beside the title, above the rule, because it does not act on the records: it says which slice of them the title refers to. Below the rule it becomes a toolbar competing with whatever strip the page starts with, which is where every application had put it.',
  )]: '**真正要争的是时间范围选择器摆在哪。** 它在标题旁边、在线的上面，因为它并不作用于那些记录：它说的是标题指的是其中哪一段。放到线下面，它就变成一条工具栏，和页面开头那一横排争起来——而每个应用原本正是把它放在那里的。',
  [fingerprint(
    "The title is an `h1` by default because a page has one name, and a shell that owns the document's heading has taken the page's own name away from it; `level` moves it for the case where the opening is not the document's, which is a preview canvas or a template inside a page that already has an `h1`. The SIZE does not move with it: `--fs-heading` at every level, rather than `Heading`'s own level-1 default of `--fs-title`, because a page opening stands over a working screen and moving one down the outline is a fact about the document rather than a request for smaller type.",
  )]: '标题默认是 `h1`，因为一个页面只有一个名字，而一个把文档标题据为己有的外壳，是把这一页自己的名字拿走了；`level` 是给「这个开头并不属于这份文档」那种情况用的——一块预览画布，或者一份放在已经有 `h1` 的页面里的模板。字号不跟着动：在每一个层级上都是 `--fs-heading`，而不是 `Heading` 在 level 1 上默认的 `--fs-title`，因为一个页面开头站在一块工作界面上方，而把它挪到大纲更深处，是关于这份文档的事实，不是「请把字号调小」的请求。',
  [fingerprint(
    '`data-accent` is a shipped theme axis now — `ink`, `clay`, `forest`, `cobalt`, `moss` and `plum`, each re-pointing one token the whole system reads.',
  )]: '`data-accent` 现在是随包发布的一项主题轴——`ink`、`clay`、`forest`、`cobalt`、`moss`、`plum`，每一个都只是把整套系统都在读的那一个 token 指到别处。',
  [fingerprint(
    "**The site could show it and no consumer could have it.** Five accents lived in the documentation app's own `globals.css`, so a page on ui.misoto22.com demonstrated a re-pointing that no installed copy of the package could reproduce — while `SKILL.md`, `rules/tokens.md` and the emitted `llms.txt` each said in so many words that no such attribute existed. All three were right about the package and wrong about what the reader had just been shown.",
  )]: '**这个网站能演示它，而任何使用方都拿不到。** 五个主色一直住在文档站自己的 `globals.css` 里，于是 ui.misoto22.com 上的页面演示的那次重新指向，任何一份已安装的包都复现不了——与此同时 `SKILL.md`、`rules/tokens.md` 和生成的 `llms.txt` 都白纸黑字地写着没有这个属性。三处说的关于包本身都没错，关于读者刚刚看到的东西则全错。',
  [fingerprint(
    '`moss` is the sixth and it is the one the axis was moved for: a green-grey with almost no chroma left in it, for a dense working screen where the accent has to mark a choice without becoming the loudest thing on the page.',
  )]: '`moss` 是第六个，也是这项轴之所以被搬上来的那一个：一种几乎没剩下多少彩度的绿灰，给的是密集的工作界面——那里主色要能标出「被选中」，又不能成为整页最响的东西。',
  [fingerprint(
    "Every value carries a light hex, a dark hex and a collapse to `CanvasText` under forced colours. The last of those is not politeness — a browser remaps an element's own colours and does not reach inside an SVG or a `color-mix()`, and `[data-accent='moss']` matches an element directly, so it outranks anything `:root` merely offers. Without the restatement a reader in Windows High Contrast who had chosen an accent kept it.",
  )]: '每个值都带三样东西：亮色的 hex、暗色的 hex，以及在强制颜色模式下坍缩到 `CanvasText`。最后这一样不是客气——浏览器只会重映射元素自身的颜色，够不到 SVG 内部，也够不到 `color-mix()`；而 `[data-accent=\'moss\']` 是直接匹配到元素上的，因此压得过 `:root` 仅仅提供的任何值。少了这次重述，Windows 高对比度下选过主色的读者就会一直保留着它。',
  [fingerprint(
    "Nothing is authored twice. `scripts/theme-axes.mjs` reads the axis out of the selectors that define it, so the skill, the offline agent documentation and the site's index gained the row because the CSS exists. The one thing a selector cannot say — that an unset accent is `ink` rather than the ancestor's — is the line `catalog.mjs` still authors.",
  )]: '没有任何东西被写两遍。`scripts/theme-axes.mjs` 从定义这项轴的选择器里把它读出来，所以 skill、离线的 agent 文档和站点索引多出这一行，只是因为那段 CSS 存在。选择器唯一说不出来的那件事——没设置时的主色是 `ink`，而不是祖先元素的那个——才是 `catalog.mjs` 仍然要手写的那一行。',
  [fingerprint(
    "Restore the collection filter hit area and the chart's two-pixel focus ring on public websites.",
  )]: '恢复公共网站中内容筛选的触控范围，以及图表的两像素键盘焦点环。',
  [fingerprint(
    'Media-detail return controls now keep a 44px touch target.',
  )]: '媒体详情的返回控件现在保持 44px 触控目标。',
  [fingerprint(
    'Media-detail return controls now retain a 44px touch target after browser subpixel rounding.',
  )]: '媒体详情的返回控件现在即使经过浏览器子像素取整，也能保持 44px 触控目标。',
  [fingerprint(
    'A 0.25px safety margin prevents a declared 44px target from measuring just under 44px in a real browser layout.',
  )]: '额外的 0.25px 安全余量可避免声明为 44px 的触控目标在真实浏览器布局中测得略小于 44px。',
  [fingerprint(
    'Media page compositions accept `headingLevel` when they are embedded inside an existing document outline.',
  )]: '媒体页面组合在嵌入已有文档大纲时可通过 `headingLevel` 指定标题层级。',
  [fingerprint(
    'The default remains an `h1` for standalone pages, while an embedded composition can use the heading level that follows its host section.',
  )]: '独立页面仍默认使用 `h1`；嵌入式组合则可使用紧跟宿主区块的标题层级。',
  [fingerprint(
    'The layout receives a host-owned link, so direct semantic children need their own target instead of inheriting density from the host.',
  )]: '布局接收由使用方提供的链接，因此直接的语义子元素需要拥有自己的触控目标，而不应继承使用方的紧凑密度。',
  [fingerprint(
    'Question cards expose their heading as a named region and restore a 44px submit target.',
  )]: '问答卡片会以标题命名自己的区域，并恢复 44px 的提交触点。',
  [fingerprint(
    "The question prompt is a distinct conversation invitation inside a larger portfolio or archive. Its heading now names the section landmark, so assistive technology can find that invitation directly. The circular submit control keeps its compact shape while restoring the package's documented 44px interactive target.",
  )]: '问答提示是作品集或档案中的一处独立对话入口。它的标题现在会为该区域命名，让辅助技术能够直接找到这处邀请。圆形提交控件保留紧凑外观，同时恢复设计包文档约定的 44px 交互触点。',
  [fingerprint(
    'Sheet close actions provide a 44px target across every edge.',
  )]: '抽屉关闭操作在每个方向上都提供 44px 的触控目标。',
  [fingerprint(
    "The close icon remains small, while its reachable surface now meets the same 44px target used by the rest of the package's mobile controls.",
  )]: '关闭图标保持紧凑，而可触达的表面现在与包中其他移动端控件一样，达到 44px 的目标。',
  [fingerprint(
    'Website fields retain a 16px type size on phones, and keyboard-focused charts now show the system focus ring.',
  )]: '网站表单在手机上保持 16px 字号，键盘聚焦图表时也会显示系统焦点环。',
  [fingerprint(
    'Compact controls keep their desktop density. Only editable collection, question-card and command-palette fields expand to the mobile-safe text size, while a direct Recharts surface rule protects its keyboard focus treatment from chart defaults.',
  )]: '紧凑控件保留桌面端密度；只有内容列表、问答卡和命令面板中的可编辑字段会放大到移动端安全字号，同时 Recharts 图表表面会用直接规则避免图表默认样式覆盖键盘焦点反馈。',
  [fingerprint(
    'Every icon in the package is a Remix Icon glyph now, and the brand marks lucide dropped come back with them.',
  )]: '包里的每一个图标现在都是 Remix Icon 的字形，而被 lucide 删掉的那些品牌图标，也跟着一起回来了。',
  [fingerprint(
    '`lucide-react` is gone from `dependencies` and `@remixicon/react` replaces it, across all thirty-four components that draw one. The names change with it — `Check` is `RiCheckLine`, `X` is `RiCloseLine`, `Settings` is `RiSettings3Line` — but no export of this package\'s own changes, so an app that never imported an icon directly sees only different glyphs.',
  )]: '`lucide-react` 从 `dependencies` 里去掉了，换成 `@remixicon/react`，涉及会画图标的全部三十四个组件。名字也跟着换——`Check` 是 `RiCheckLine`，`X` 是 `RiCloseLine`，`Settings` 是 `RiSettings3Line`——但这个包自己的导出一个都没变，所以一个从来没有直接 import 过图标的应用，看到的只是字形不一样了。',
  [fingerprint(
    'BRAND MARKS ARE THE REASON. lucide removed every one of them, and a design system that cannot draw a GitHub octocat without redrawing somebody\'s trademark in a house stroke is a design system that pushes that decision onto its consumers. This site had already paid it: the mark in its own masthead was a hand-drawn path in a file of its own, and that file is deleted. Remix Icon ships `RiGithubFill`, `RiTwitterXFill`, `RiDiscordFill`, `RiSlackFill`, `RiFigmaFill` and a couple of hundred more, each in a Fill and a Line.',
  )]: '换的理由是品牌图标。lucide 把它们一个不剩地删了，而一套要画 GitHub 章鱼猫就只能把别人的商标按自家描边风格重画一遍的设计系统，等于把这个决定推给了它的消费者。这个站点已经为此付过账：它顶栏上的那个标记，是单独一个文件里的一条手绘路径，现在那个文件删掉了。Remix Icon 提供 `RiGithubFill`、`RiTwitterXFill`、`RiDiscordFill`、`RiSlackFill`、`RiFigmaFill`，还有两百来个，每个都有 Fill 和 Line 两种。',
  [fingerprint(
    'Three things change for a consumer, and all three are visible rather than silent.',
  )]: '对消费者来说有三处变化，而且三处都是看得见的，不是无声的。',
  [fingerprint(
    '`--ico-stroke` IS REMOVED. A Remix glyph is a filled path on a 24px grid, so there is no weight to set and nothing for the token to name; a token that documents a knob the system no longer has is worse than no token. `--ico-s`, `--ico-m` and `--ico-l` are unchanged, and so is every size the package draws at.',
  )]: '`--ico-stroke` 被删掉了。Remix 的字形是 24px 网格上的填充路径，没有粗细可设，也就没有东西留给这个 token 去命名；一个记录着系统已经不再拥有的旋钮的 token，比没有这个 token 更糟。`--ico-s`、`--ico-m` 和 `--ico-l` 没有变，包里画图标用的每一个尺寸也都没有变。',
  [fingerprint(
    '`LucideIcon` becomes `RemixiconComponentType` in the props that take an icon COMPONENT — `NavItem.icon`, `EmptyState.icon`, `DropdownMenuItem.icon`, `ContextMenuItem.icon`, `CommandItem.icon`, and the chart toolbar\'s. Both are `ComponentType`s over an SVG\'s props, so a lucide icon passed to one still type-checks and still renders; the name in the reference is what moved.',
  )]: '在那些收「图标组件」的属性上，`LucideIcon` 变成了 `RemixiconComponentType`——`NavItem.icon`、`EmptyState.icon`、`DropdownMenuItem.icon`、`ContextMenuItem.icon`、`CommandItem.icon`，以及图表工具栏的那个。两者都是架在 SVG 属性之上的 `ComponentType`，所以把一个 lucide 图标交给它，类型仍然过得去，也仍然渲染得出来；变的是参考手册上的那个名字。',
  [fingerprint(
    'AND `aria-hidden` IS NOW WRITTEN RATHER THAN INHERITED. lucide stamped `aria-hidden="true"` onto any icon it had not been handed an `aria-` prop or a role for. `@remixicon/react` adds nothing and spreads what it is given straight onto the `svg`, so every decorative glyph in the package carries the attribute at its own call site — thirty-nine of them, added in this change. Anything drawing its own icons should check the same thing on upgrade: nothing fails, the icon simply starts being announced.',
  )]: '还有一件：`aria-hidden` 现在是写出来的，不是继承来的。lucide 会给任何没被交给 `aria-` 属性或 role 的图标盖上 `aria-hidden="true"`。`@remixicon/react` 什么都不加，只把收到的东西原样摊到 `svg` 上，所以包里每一个装饰性字形都在它自己的调用处带着这个属性——这次一共补了三十九处。任何自己画图标的地方，升级时都该检查同一件事：不会报错，只是那个图标开始被念出来了。',
  [fingerprint(
    "A chart's empty state stays where its plot was, instead of pinning to the top of a taller figure.",
  )]: '图表的空状态会留在绘图区原来的位置，而不再顶到一个更高的 figure 的上沿。',
  [fingerprint(
    '`ChartEmpty` sizes itself 16:9 and stops at `max-h-[26rem]`, which is right for a card that grows to its content and short of a figure the page has given a fixed height — a dashboard tile, a cell in a grid. The box was then shorter than the figure holding it, so the words landed near the top while the plot they stand in for had filled the whole cell, and the same chart read at two different heights depending on whether it had data. The container it replaces is `flex-1` and `justify-center`; this was neither. An auto margin is the smaller of the two available fixes: it absorbs the free space when there is any and does nothing when there is none, so a chart that sizes to its own content keeps exactly the shape it had.',
  )]: '`ChartEmpty` 按 16:9 给自己定尺寸，并在 `max-h-[26rem]` 处打住。这对一张跟着内容长大的卡片是对的，对一个被页面给定了固定高度的 figure——仪表盘的一块瓦片、网格里的一格——就不够高了。于是这个盒子比装着它的 figure 矮，文字落在靠上的位置，而它所替代的绘图区本来是把整格填满的；同一张图表，有数据和没数据读起来是两个高度。它替下来的那个容器是 `flex-1` 加 `justify-center`，而它两样都不是。自动外边距是两种改法里较小的那一种：有空余时它吃掉空余，没有空余时它什么也不做，所以按自身内容定尺寸的图表，形状分毫未变。',
  [fingerprint(
    "The `warm` and `cool` surfaces keep their rules dark now — both set `--rule` and `--rule-2` once, so every border on a dark page rendered near-white.",
  )]: '`warm` 和 `cool` 这两个表面，现在在深色下也把线条留在暗处——它们的 `--rule` 和 `--rule-2` 只写了一遍，于是深色页面上的每一条边框都渲染成了近白色。',
  [fingerprint(
    "**The dark block restated the grounds and not the rules.** Each surface moves five tokens on the light ground and only three of them came back in dark, so `#e8e4da` and `#e4e9ee` kept resolving over `#12110f` and `#0c0e11` — 14.86:1 and 15.82:1 against the surface's own paper, where the neutral dark rule sits at 1.42:1. Measured in a console built on this package: 33 routes, up to 174 near-white borders on one page. `glass` restates both and was never affected.",
  )]: '**深色那个块重述了底色，没有重述线条。** 每个表面在浅色底上移动五个 token，到了深色只回来三个，于是 `#e8e4da` 和 `#e4e9ee` 继续解析在 `#12110f` 和 `#0c0e11` 上——对着这两个表面自己的纸色，是 14.86:1 和 15.82:1，而中性的深色线条坐在 1.42:1。在一个基于这个包搭起来的控制台上量过：33 条路由，单页最多 174 条近白色边框。`glass` 把两条都重述了，从来没有中招。',
  [fingerprint(
    "The replacements are built the way `tokens.css` builds its own, the system's near-white at an alpha over whatever ground is under it, and at the SAME alphas — 0.14 and 0.26 — because the alpha is what a rule's weight is. What moves is the near-white: `#f4f4f2` held at its own lightness and turned onto the surface's dark hue, 84.6° for warm and 258.4° for cool, at the chroma that surface's light `--rule` carries. Composited on each surface's own dark paper the two land at 1.45 / 2.19 and 1.42 / 2.17 against the root's 1.42 / 2.16.",
  )]: '替换上去的值，是照 `tokens.css` 自己的做法搭出来的——系统的近白色，以一个透明度压在底下无论什么底色上——而且用的是「同一组」透明度，0.14 和 0.26，因为透明度就是一条线条的分量。变的是那个近白色：把 `#f4f4f2` 按住它自己的明度，转到该表面的深色色相上，暖色 84.6°、冷色 258.4°，彩度取该表面浅色 `--rule` 所带的那一档。合成到各自的深色纸面上，这两条落在 1.45 / 2.19 和 1.42 / 2.17，对着根节点的 1.42 / 2.16。',
  [fingerprint(
    "The tint is not decoration. A light warm rule carries MORE chroma than the ground it separates — C 0.0111 at `--stone` against 0.0185 at `--rule-2` — and the root's neutral near-white inverts that on the dark ground: at 26% it washes the tint out, leaving warm's heaviest rule at C 0.0075 over a `--stone` of C 0.0103, the least warm thing on a warm page.",
  )]: '这层色偏不是装饰。浅色下的暖色线条，彩度比它所分隔的那层底色「更高」——`--stone` 是 C 0.0111，`--rule-2` 是 0.0185——而根节点那个中性近白色，在深色底上把这件事反了过来：在 26% 处它把底色的色偏冲淡，让暖色最重的那条线落到 C 0.0075，压在一层 C 0.0103 的 `--stone` 上，成了一张暖色页面上最不暖的东西。',
  [fingerprint(
    "The test asks this per TOKEN now rather than per block, because a dark block existing is not a dark block being complete — which is the whole of what the surface axis was checking, and both of these had one.",
  )]: '测试现在是按「每个 token」问，而不是按每个块问，因为一个深色块存在，不等于这个深色块是完整的——而后者正是表面这根轴原本检查的全部，偏偏这两个表面都有一个块。',
  // ─── 0.10.0 ───
  [fingerprint(
    'The chart palette gains a third value, and forced colours gets its ramp back.',
  )]: '图表调色板多了第三个取值，而强制颜色模式拿回了它那条色阶。',
  [fingerprint(
    '`data-chart-palette` had two answers — `mono` and `chroma` — and neither one was "our accent is not ink". A consumer whose buttons, pills and rules had all re-pointed off `--clay` still got eight greys in every chart, and the only way out was the thing the axis exists to prevent: hand-picked hexes in a `colors` config. `accent` derives all eight names from `--clay` instead, so it works for an accent nobody here has seen.',
  )]: '`data-chart-palette` 只有两个答案——`mono` 和 `chroma`——而没有一个是「我们的强调色不是墨色」。一个把按钮、药丸和线条统统重新指向 `--clay` 的消费者，在每一张图表里拿到的仍然是八级灰，而唯一的出路，恰恰是这根轴存在的意义所要避免的那件事：在 `colors` 配置里手挑一堆十六进制值。`accent` 改为从 `--clay` 推导出全部八个名字，所以它对一个这里从没见过的强调色也管用。',
  [fingerprint(
    'It pins the LIGHTNESS and inherits the hue, because separation and contrast are carried almost entirely by lightness — eight even steps across L 0.173–0.640 on paper and L 0.967–0.530 on the dark ground, both bounds set by the weakest hue rather than the prettiest. Measured across all 360 hues at maximum chroma: adjacent-pair separation ΔE 26.7 light / 25.0 dark (OKLab ×100, against a floor of 15), minimum contrast 3.11 on both grounds. `--series-1` sits mid-band, so a one-series chart paints within ΔE 2 of the accent itself rather than in the accent\'s darkest possible shade, and ink stays available as `--series-2`. What it is NOT is a categorical palette: one hue laddered eight ways is guesswork at eight series, and `chroma` is still the answer for a reader comparing categories.',
  )]: '它钉住的是「明度」，色相则继承下来，因为区分度和对比度几乎全靠明度承载——纸上是 L 0.173–0.640 之间八个均匀的台阶，深色底上是 L 0.967–0.530，两端的边界都由最弱的那个色相定，而不是最好看的那个。在最大彩度下把全部 360 个色相都量过：相邻两级的区分度，浅底 ΔE 26.7、深底 25.0（OKLab ×100，下限是 15），最小对比度在两种底色上都是 3.11。`--series-1` 落在色带中部，所以单序列图表画出来跟强调色本身相差在 ΔE 2 以内，而不是落在强调色最深的那一档，同时墨色仍然留给 `--series-2`。它「不是」一套分类调色板：一个色相拉成八级，到了八个序列就是猜；读者要比较类别，答案仍然是 `chroma`。',
  [fingerprint(
    'Separately, and older than this: `tokens.css` collapses the ramp to `CanvasText` under `forced-colors`, and it writes that on `:root` — which any palette attribute then outranks, because an element matching `[data-chart-palette]` directly beats a value it merely inherits from the root, and beats it on source order at the root itself. A reader in Windows High Contrast who was on `chroma` kept getting the eight hues, which is the setting being ignored rather than honoured. The ramp is restated after the palettes, at the specificity the dark blocks use.',
  )]: '另外还有一件，而且比这件更早：`tokens.css` 在 `forced-colors` 下会把整条色阶塌成 `CanvasText`，而它写在 `:root` 上——于是任何调色板属性都压得过它，因为一个直接匹配 `[data-chart-palette]` 的元素，胜过它仅仅从根节点继承来的值，即便在根节点自己身上，也靠源码顺序取胜。一个用 Windows 高对比度、又选了 `chroma` 的读者，拿到的还是那八个色相——这是设置被忽略，而不是被尊重。这条色阶现在改到调色板之后重述一遍，用的是深色块所用的那个特异度。',
  [fingerprint(
    'A chart with a brush gets its plot back.',
  )]: '带 brush 的图表拿回了它的绘图区。',
  [fingerprint(
    'The brush is rendered as the chart container\'s FOOTER, and the footer branch dropped the plot\'s whole shape: no `aspect-video` — correct, since sizing the outer box 16:9 pays for the footer out of the plot\'s share — but also no `min-h`, which was not. So a brushed chart had a plot with no intrinsic height at all, and in any container that sizes to its content the plot measured zero and only the brush\'s own 56px survived. The page showed a scrubber with nothing above it to scrub. Recharts says so out loud — "width(-1) and height(-1) of chart should be greater than 0" — into a console nobody reads, which is why it stood.',
  )]: 'brush 是作为图表容器的「页脚」渲染的，而页脚那条分支把绘图区的整套形状都丢掉了：没有 `aspect-video`——这是对的，因为把外框按 16:9 定尺寸，等于让页脚从绘图区的份额里扣——但连 `min-h` 也没有，这就不对了。于是一张带 brush 的图表，它的绘图区根本没有固有高度，在任何按内容定尺寸的容器里，绘图区量出来是零，只有 brush 自己那 56px 活了下来。页面上就是一条拖拽条，上头没有任何可拖的东西。Recharts 其实明说了——「width(-1) and height(-1) of chart should be greater than 0」——只是说进了一个没人看的控制台，所以它就这么一直立着。',
  [fingerprint(
    'The shape moves down one element instead of being dropped: with a footer, the plot carries `aspect-video max-h-[26rem] min-h-[13rem]` and the footer sits under it. `AreaChart`, `BarChart`, `LineChart` and `ComposedChart` are all affected — every chart that takes a `Brush`.',
  )]: '这套形状不是被丢掉，而是往下挪了一个元素：有页脚时，绘图区带上 `aspect-video max-h-[26rem] min-h-[13rem]`，页脚坐在它下面。`AreaChart`、`BarChart`、`LineChart` 和 `ComposedChart` 都受影响——每一张接受 `Brush` 的图表。',
  [fingerprint(
    '`--control-lh`: every control is now the height its token claims.',
  )]: '`--control-lh`：现在每一个控件都真的是它的 token 所声称的那个高度。',
  [fingerprint(
    '`--control-h-sm` is 36px and an `sm` Button measured 39. `md` said 44 and measured 46; `lg` said 48 and measured 50. `min-height` is a floor, and a floor only binds while the box is under it — the box being the line, the padding and the border. The padding was already scaled per density for exactly this reason, with a comment saying so. The LINE was not: it inherited the body\'s 1.6 reading leading, which no control asked for, and 20.8 + 16 + 2 clears 36 on its own.',
  )]: '`--control-h-sm` 是 36px，而一个 `sm` 的 Button 量出来是 39。`md` 说 44，量出来 46；`lg` 说 48，量出来 50。`min-height` 是一条下限，而下限只在盒子低于它的时候才咬得住——盒子等于行高加内边距加边框。内边距早就按密度分级缩放过了，正是为了这个原因，旁边还写着注释说明。「行高」没有：它继承了正文那个 1.6 的阅读行距，没有任何控件要过它，而 20.8 + 16 + 2 光靠自己就越过了 36。',
  [fingerprint(
    'So every text button in the system was two to three pixels taller than the number documenting it, and the documentation said 36 and 44. The Button page still says "sm is 36px at the default density"; it is now true.',
  )]: '所以这套系统里每一个文字按钮，都比记录它的那个数字高出两到三个像素，而文档写的是 36 和 44。Button 那一页现在仍然写着「默认密度下 sm 是 36px」；现在这句话是真的了。',
  [fingerprint(
    '`--control-lh: 1.2` is the missing term, declared beside the padding it belongs with, and `tokens.test.ts` now runs the arithmetic — line plus padding plus border against the height token, at every size, on both densities.',
  )]: '`--control-lh: 1.2` 就是缺掉的那一项，声明在它本该待着的内边距旁边，而 `tokens.test.ts` 现在会把这道算术跑一遍——行高加内边距加边框，对上高度 token，每一个尺寸、两种密度都算。',
  [fingerprint(
    '`Kbd` carried the same literal `1.6`. Everything about it tracks its context in `em` — "so it tracks whatever type it sits beside" — except the leading, which was pinned at the reading value, so a keycap inside a control stood proud of the label next to it. That is what kept the documentation site\'s search field at 39px after the button itself was fixed, and what made it the one control in the masthead taller than the four beside it.',
  )]: '`Kbd` 身上带着同一个写死的 `1.6`。它其余的一切都用 `em` 跟着上下文走——「这样它就跟着它旁边的字号走」——唯独行距被钉死在阅读用的那个值上，于是一个嵌在控件里的键帽，会比它旁边的标签高出一截。这正是按钮本身修好之后、文档站的搜索框仍然停在 39px 的原因，也是它成为顶栏里唯一比旁边四个都高的那个控件的原因。',
  [fingerprint(
    'Example headings reach the Chinese site.',
  )]: '示例标题终于到得了中文站。',
  [fingerprint(
    '`generate.mjs` derives them from the filename — `02-fill-variants` becomes `fill variants` — so they are not prose anyone wrote, are not in `messages.ts`, and are not JSX for `untranslated-chrome.test.ts` to find. Three mechanisms guard the site\'s Chinese and none of them can see a string the BUILD makes. So the contents rail on `/zh` listed `default`, `brush` and `value labels` under 示例 for as long as the site has existed, and every check passed.',
  )]: '`generate.mjs` 是从文件名推出它们的——`02-fill-variants` 变成 `fill variants`——所以它们不是任何人写下的文句，不在 `messages.ts` 里，也不是 `untranslated-chrome.test.ts` 找得到的 JSX。守着这个站中文的三套机制，没有一套看得见由「构建」造出来的字符串。于是 `/zh` 上的目录栏，在「示例」下面列着 `default`、`brush` 和 `value labels`，站点存在了多久它就这样多久，而每一道检查都通过。',
  [fingerprint(
    '`ExampleCopy` gains a `title`, and `exampleTitle()` reads it. No fingerprint, for the reason `ComponentCopyZh.name` has none: there is no English author to drift away from, and renaming the file renames the key, which already fails.',
  )]: '`ExampleCopy` 多了一个 `title`，`exampleTitle()` 会读它。不带指纹，理由跟 `ComponentCopyZh.name` 不带指纹是同一个：这里没有一个英文原文可供漂移，而重命名文件就等于重命名键，那件事本来就会失败。',
  [fingerprint(
    'The catalogue is translated a group at a time. Charts and Data are done — 88 headings — and the test guards it two ways: a finished group may not regress, and the untranslated remainder may only get smaller.',
  )]: '目录是一组一组翻的。Charts 和 Data 已经完成——88 个标题——而测试从两头守着：翻完的组不许倒退，没翻的余量只许变小。',
  [fingerprint(
    'An example\'s own knobs move out of the specimen and into the canvas toolbar.',
  )]: '示例自己的旋钮从样品里挪了出来，进了画布工具条。',
  [fingerprint(
    'A chart example that lets a reader switch the tooltip\'s ground had two different things on the card: the chart, which is what the page is about, and two pill groups, which are the demo\'s scaffolding. Drawn together they read as one composition and the scaffolding won — it sat on top, it was the only thing with a filled ground, and at 36px it was the system\'s smallest control against a 26px toolbar two pixels above it. A reader looking for what `BarChart` renders found a settings panel.',
  )]: '一个让读者切换 tooltip 底色的图表示例，卡片上放着两样不同的东西：图表，也就是这一页真正要讲的；以及两组药丸按钮，也就是这个演示的脚手架。画在一起，它们读起来是一个整体构图，而赢的是脚手架——它压在上面，是唯一有填充底色的东西，而且 36px 的它，是这套系统里最小的控件，紧挨着上方两个像素处那条 26px 的工具条。一个想看 `BarChart` 画出什么的读者，看到的是一块设置面板。',
  [fingerprint(
    '`ExampleControls` portals them up one band, beside LTR/RTL and the density switch, at the same chrome scale — the same strip height, to the pixel. The example\'s own code does not change: wiring state to a prop is the lesson in several of these, so the controls stay where they were written and only the canvas draws them elsewhere. `generate.mjs` unwraps the element out of the printed snippet, the way it already drops `export function Example` and the relative imports, so the code a reader copies is byte-for-byte what it was.',
  )]: '`ExampleControls` 把它们传送到上面那一条带里，跟 LTR/RTL 和密度开关并排，用同一档 chrome 尺度——条高一致，精确到像素。示例自己的代码不变：把 state 接到一个 prop 上，正是这几个示例里要教的东西，所以控件仍然写在它原来的地方，只是画布把它画到了别处。`generate.mjs` 会把这个元素从印出来的代码片段里剥掉，就像它本来就会去掉 `export function Example` 和那些相对导入一样，所以读者复制走的代码，逐字节地还是原来那一份。',
  [fingerprint(
    'Twenty-four chart examples move. The four where a `ToggleGroup` IS the specimen — its own three examples and `Field`\'s group-naming one — stay put.',
  )]: '二十四个图表示例挪了位。有四个里 `ToggleGroup` 本身「就是」样品——它自己的三个示例，加上 `Field` 那个讲分组命名的——原地不动。',
  [fingerprint(
    'Separately, the tooltip knobs in `BarChart`\'s interaction example now say what they do: both move the floating panel and nothing else on the card, and `frosted` is the plot showing THROUGH that panel, so it reads where the panel crosses a bar and nowhere else. Over the white ground it is white at 75% over white, which is white — a knob that appeared not to work.',
  )]: '另外，`BarChart` 交互示例里的那几个 tooltip 旋钮，现在会把自己在干什么说清楚：它们只挪动那块浮层，卡片上别的什么都不动；而 `frosted` 是绘图区「透过」那块浮层显出来，所以它只在浮层压过柱子的地方读得出来，别处读不出来。在白色底上，那是 75% 的白压在白上，结果还是白——一个看上去不起作用的旋钮。',
  [fingerprint(
    '`--bar-h`: the band across the top of an application, as one number.',
  )]: '`--bar-h`：横在应用顶部的那条带，收拢成一个数字。',
  [fingerprint(
    'It was five literals in two packages, and they disagreed. `AppShell` said `h-14` and the documentation site said `h-16` — the same role, 56px in the component this system ships and 64px on the site documenting it. A sixth, `SidebarHeader`\'s `min-h-14` floor, is what accidentally kept the rail\'s head level with the masthead beside it, and what would have stopped it staying level the moment either moved. `--scroll-offset` was a seventh: "a masthead plus a line of air", written as `88px`, a number derived by hand from whichever of the two answers its author had on screen.',
  )]: '它原来是分散在两个包里的五个字面量，而且互相不一致。`AppShell` 说 `h-14`，文档站说 `h-16`——同一个角色，在这套系统发出去的组件里是 56px，在记录它的那个站点上是 64px。还有第六个，`SidebarHeader` 的 `min-h-14` 下限，是它偶然让导航栏的头跟旁边的顶栏齐平的，也是它会在两者任一挪动的那一刻让齐平消失的。`--scroll-offset` 是第七个：「一条顶栏加一行空气」，写成 `88px`，一个由人手从当时屏幕上那两个答案里挑一个推出来的数字。',
  [fingerprint(
    'Derived rather than typed. A bar is a row of controls and the air around them, so it is the control it seats plus six pixels above and below — the same twelve `--sidebar-w-icon` adds to a rail\'s collapsed width, for the same reason. A bar can no longer be set to a height its own controls do not fit in, and `--scroll-offset` is now `calc(var(--bar-h) + 1.5rem)`, so a bar that moves takes every anchored heading with it.',
  )]: '现在是推导出来的，不是敲进去的。一条顶栏就是一排控件加上它们周围的空气，所以它等于它所安放的那个控件，上下各加六个像素——正是 `--sidebar-w-icon` 给导航栏收起宽度加的那十二个，理由也一样。一条顶栏再也不能被设成一个连自己的控件都装不下的高度，而 `--scroll-offset` 现在是 `calc(var(--bar-h) + 1.5rem)`，于是顶栏一动，所有锚定标题都跟着动。',
  [fingerprint(
    'WHICH control depends on the pointer. A bar is chrome: its controls are `sm`, the density this system documents as a deliberate below-the-floor size for a mouse. A finger is not a mouse, so on a coarse pointer they grow to the 44px target WCAG 2.5.5 asks for and the bar grows with them. 48px comfortable and 42px compact with a pointer; 56px and 48px with a finger.',
  )]: '至于是「哪一个」控件，取决于指针。顶栏属于 chrome：它的控件是 `sm`，也就是这套系统明确记录为「为鼠标而刻意低于下限」的那一档。手指不是鼠标，所以在粗指针下它们会长到 WCAG 2.5.5 要求的 44px 目标，顶栏也跟着长。鼠标下是宽松 48px、紧凑 42px；手指下是 56px 和 48px。',
  [fingerprint(
    'Declared on the root, which is load-bearing rather than incidental: a `var()` inside a custom property is substituted where the property is DECLARED, so `--control-h-md` resolves once and every descendant inherits the same answer — including a rail that pins its own `data-density`, which is what keeps a compact rail\'s head level with a comfortable page\'s bar.',
  )]: '声明在根节点上，而这一点是承重的、不是顺手的：自定义属性里的 `var()` 是在该属性被「声明」的地方代换的，所以 `--control-h-md` 只解析一次，而每一个后代继承到的都是同一个答案——包括一条钉死了自己 `data-density` 的导航栏，这正是让紧凑导航栏的头跟宽松页面的顶栏保持齐平的原因。',
  [fingerprint(
    'The documentation site\'s masthead loses 16px in the process — 64px down to 48px on a desktop, unchanged at 56px on a phone. It was seating 39px of content in 64px of bar, and holding a further 8px for a 44px target that only exists when the pointer is a finger.',
  )]: '文档站的顶栏在这个过程中瘦了 16px——桌面端从 64px 降到 48px，手机端仍是 56px。它原本是把 39px 的内容安在一条 64px 的栏里，还额外为一个只在指针是手指时才存在的 44px 目标留了 8px。',
  [fingerprint(
    'Hovering a rail no longer emboldens the section under the pointer.',
  )]: '划过导航栏，不会再把指针底下那一整节加粗了。',
  [fingerprint(
    'The fill follows the pointer while the pointer is in the list, and the three declarations that do it land on every row. Two are no-ops on a row that is not current — it has no fill and no ink to give up. `font-normal` was not: it is an absolute weight rather than an undo, so in a rail whose base face is lighter than 400 — the White Reset\'s own sidebar runs at 300 — every row got HEAVIER the moment the pointer arrived. Selecting one row appeared to embolden its whole section, which is the opposite of a highlight that follows the pointer.',
  )]: '指针在列表里的时候填充跟着指针走，而做这件事的三条声明会落到每一行上。其中两条对一个非当前行是空操作——它既没有填充也没有墨色可让。`font-normal` 不是：它是一个绝对字重而不是一次撤销，所以在一条基础字体比 400 更细的导航栏里——归白自己的侧栏跑在 300——指针一到，每一行反而「变重」了。选中一行看上去把它整节都加粗了，而那恰恰是「跟着指针走的高亮」的反面。',
  [fingerprint(
    'The weight is now scoped to `aria-current="page"`, which is the only row that has a weight to give up. The fill and the ink still relax on every row, because there the class says what it means.',
  )]: '字重现在收窄到 `aria-current="page"` 上，那是唯一一行有字重可让的。填充和墨色仍然在每一行上放松，因为在那里，这个类名说的就是它的意思。',
  [fingerprint(
    '`AreaChart 面积图` becomes `AreaChart - 面积图`.',
  )]: '`AreaChart 面积图` 变成 `AreaChart - 面积图`。',
  [fingerprint(
    'Both halves are names — the export identifier and the Chinese one — and a space between two names reads as one name that changed script half way through. The dash says they are two labels for the same thing, which is what they are. The order does not move: the English is the import, and it stays first.',
  )]: '两半都是名字——导出标识符，和中文那个——而两个名字之间的一个空格，读起来像是一个名字写到一半换了文字系统。这道短横说明它们是同一样东西的两个标签，而它们本来就是。顺序不变：英文是 import，它留在前面。',
  [fingerprint(
    '`RadarChart.Radar` fills again instead of handing the SVG `NaN`.',
  )]: '`RadarChart.Radar` 又能填充了，而不是把一个 `NaN` 递给 SVG。',
  [fingerprint(
    'The default fill opacity follows `--chart-fill` through a `calc()`, so it reads on both grounds without the component knowing which one it is on. That value is a string, and the dimming factor was applied to it in JS — `\'calc(…)\' * 1` is `NaN`, which React writes to `fill-opacity` after warning once in the console. Every unselected radar therefore lost its fill, on every render, since the default path never went through a number at all.',
  )]: '默认填充不透明度是通过一个 `calc()` 跟着 `--chart-fill` 走的，于是它在深浅两种底色上都读得出来，而组件自己并不需要知道当前在哪一种上。问题是那个值是字符串，而变暗系数是在 JS 里乘上去的——`\'calc(…)\' * 1` 等于 `NaN`，React 会在控制台警告一次之后把它写进 `fill-opacity`。于是每一条未被选中的雷达线都丢了填充，每一次渲染都是如此，因为默认那条路径压根就没经过一个数字。',
  [fingerprint(
    'The factor multiplies inside the `calc()` now. A number passed as `fillOpacity` still scales the way it always did.',
  )]: '现在这个系数是乘在 `calc()` 内部的。作为 `fillOpacity` 传进来的数字，仍然照它一直以来的方式缩放。',
  [fingerprint(
    'A gate walks every chart\'s rendered attributes and fails on any `NaN`, because nothing else would have noticed: jsdom has no layout, and the hidden table each chart carries still read correctly the whole time.',
  )]: '现在有一道关卡会遍历每一张图表渲染出来的属性，遇到任何 `NaN` 就失败——因为别的东西都不会发现：jsdom 没有布局，而每张图表随身带的那张隐藏表格，自始至终读起来都是对的。',
  // ─── 0.9.0 ───
  [fingerprint(
    '`Sidebar` is a drawer where a column will not fit, and a page has a side to sit on.',
  )]: '`Sidebar` 在放不下一整列的地方变成抽屉，而页面有一条边可以让它靠。',
  [fingerprint(
    'Five things the rail could not do, and one of them was the reason every application built on it wrote a second navigation by hand.',
  )]: '导航栏做不到的五件事，其中一件正是每个基于它搭起来的应用都得再手写一套导航的原因。',
  [fingerprint(
    '**Under `breakpoint` it is an overlay**, not a narrower column: `fixed` against its own edge, over a scrim, and `inert` while closed. That last part is the one hand-written versions skip — a drawer merely translated off-screen still holds focus and is still read aloud, so a closed one puts its whole index between the reader and the page they were on. The scrim is a real button, because tapping beside a drawer is how a drawer is closed and that gesture has to exist for a keyboard too. A row closes it: following a link inside an overlay and leaving the overlay up is a reader landing somewhere they cannot see.',
  )]: '**在 `breakpoint` 以下它是一层浮层**，不是一列变窄的栏：`fixed` 贴着自己那条边，压在一层遮罩上，关着的时候是 `inert`。最后这一点正是手写版本会跳过的——一个只是被平移出屏幕的抽屉，仍然握着焦点、仍然会被念出来，于是一个关着的抽屉把它整份索引横在读者和他们原本那一页之间。遮罩是一个真正的 button，因为在抽屉旁边点一下就是关抽屉的方式，而这个手势对键盘也必须存在。点一行也会关掉它：在浮层里跟着链接走、却把浮层留在上面，等于让读者落在一个自己看不见的地方。',
  [fingerprint(
    'The switch is a media query in the stylesheet, not a branch on `matchMedia`. The first version asked JavaScript and rendered a different tree from the answer — an answer that does not exist until an effect runs, so a phone painted a 256px column beside a 390px screen and the page scrolled sideways until React caught up. `breakpoint` is therefore one of `\'sm\' | \'md\' | \'lg\' | \'xl\'` rather than a number: these are literal class strings, and a class built from a runtime number is one the compiler never emitted. `null` pins the rail as a column at every width, and `contained` points the overlay at a positioned ancestor instead of the window — for a rail inside a device preview or an embedded console.',
  )]: '这个切换是样式表里的一条媒体查询，不是 `matchMedia` 上的一个分支。第一版去问 JavaScript，然后照着答案渲染另一棵树——而那个答案在 effect 跑起来之前根本不存在，于是手机在 390px 的屏幕旁边画了一列 256px 的栏，页面一直横着滚，直到 React 追上来。所以 `breakpoint` 是 `\'sm\' | \'md\' | \'lg\' | \'xl\'` 之一，而不是一个数字：这些是字面量类名，而用运行时数字拼出来的类名，编译器从来没有产出过。`null` 把导航栏在任何宽度下都钉成一列，而 `contained` 把浮层指向一个定位过的祖先而不是窗口——供设备预览或内嵌控制台里的导航栏使用。',
  [fingerprint(
    '**`side="end"`** puts the rail on the other edge, logically: the right in a Latin document and the left in an Arabic one, with the hairline, the collapse glyph and the row tooltips all following rather than being written twice.',
  )]: '**`side="end"`** 把导航栏放到另一条边上，而且是逻辑意义上的：拉丁文文档里是右边，阿拉伯文文档里是左边，发丝线、收起字形和行 tooltip 全都跟着走，而不是写两遍。',
  [fingerprint(
    '**`variant`** decides which of the two pieces is the panel. `flush` is a column and a page divided by a hairline. `floating` lifts the rail off the ground as its own bordered panel. `inset` is the same gesture the other way up — the rail becomes the ground and the new `SidebarInset` draws the page as the panel, which is why the setting lives on the provider: one decision, two components, and no way to set half of it.',
  )]: '**`variant`** 决定这两块里哪一块是面板。`flush` 是一列和一页，中间用一根发丝线分开。`floating` 把导航栏抬离地面，成为它自己的一块带边框的面板。`inset` 是同一个手势反过来——导航栏成了地面，而新的 `SidebarInset` 把页面画成那块面板，这也是为什么这个设置放在 provider 上：一个决定，两个组件，没法只设一半。',
  [fingerprint(
    '**`SidebarInset`** is the column beside the rail. Every layout built on this was writing the same `flex min-w-0 flex-1 flex-col` by hand, and `min-w-0` is the half everybody forgets: a flex child\'s floor is its content, so one wide table inside pushes the whole page past the viewport and takes the rail\'s width with it.',
  )]: '**`SidebarInset`** 就是导航栏旁边的那一列。每一个基于它的布局都在手写同一串 `flex min-w-0 flex-1 flex-col`，而 `min-w-0` 正是所有人都会忘的那一半：一个 flex 子项的下限是它的内容，所以里头一张宽表格就会把整页顶出视口，还顺带把导航栏的宽度一起带走。',
  [fingerprint(
    '**`persist`** takes a `localStorage` key and remembers the docked state. A reader who put the rail away did not mean "until the next page". Only the docked state is kept — restoring an open drawer is a page that loads with its own navigation over the top of itself — and it is read after mount, never during render, because a value from storage in the first pass is a hydration mismatch.',
  )]: '**`persist`** 接一个 `localStorage` 键，记住停靠状态。把导航栏收起来的读者，意思不是「只收到下一页为止」。只有停靠状态会被记住——恢复一个打开的抽屉，等于页面加载出来时自己的导航正压在自己身上——而且这个值是在挂载之后读的，绝不在渲染当中，因为首轮就从 storage 拿值会造成 hydration 不一致。',
  [fingerprint(
    'Named axis defaults reach one more call site, and the argument for them is now on the page.',
  )]: '有名字的轴默认值又够到了一处调用点，而支持它们的那套论证现在写在页面上了。',
  [fingerprint(
    '`ThemeRail` wrote only the axes a preset moves, on the reasoning that the rest are the White Reset. They are not: an unset axis is not "the default", it is whatever the ancestor said — and that rail\'s ancestor is a document carrying whichever theme the reader applied to the site. So every thumbnail showed the reader\'s own corners, rules and face for five of its six axes, and eight previews of eight different themes came out looking like eight previews of the one already on screen. It is the same defect the themes gallery had, in the second of the two files that draws a preview.',
  )]: '`ThemeRail` 只写了预设会动的那几根轴，理由是其余的都属于白色重置。它们不是：一根没设置的轴不是「默认值」，而是祖先说了算——而这条导航栏的祖先，是一份带着读者给站点应用的那个主题的文档。于是每一张缩略图，六根轴里有五根显示的是读者自己的圆角、线条和字体，八个不同主题的预览看起来就是同一个已经在屏幕上的主题的八份预览。这跟主题画廊的缺陷是同一个，只不过发生在画预览的那两个文件里的第二个。',
  [fingerprint(
    '`SidebarBranch` — a row that opens onto more rows — plus a `badge` slot on `SidebarGroup`, and a 16rem rail.',
  )]: '`SidebarBranch`——一行展开成更多行——外加 `SidebarGroup` 上的一个 `badge` 插槽，以及 16rem 宽的导航栏。',
  [fingerprint(
    'Nesting is the thing a rail is for and the thing a flat list of groups cannot do: a workspace with projects in it, a folder with documents in it, a service with its environments. The line it draws is between a PLACE and a HEADING — `SidebarGroup` is a heading over a set and has neither an icon nor a state because it is not somewhere you can be; a branch has both because it is.',
  )]: '嵌套正是导航栏存在的意义，也正是一列扁平的分组做不到的事：一个装着若干项目的工作区，一个装着若干文档的文件夹，一个带着自己各套环境的服务。它划的那条线，是「一个地方」和「一个标题」之间的线——`SidebarGroup` 是一组东西上方的标题，既没有图标也没有状态，因为它不是你能待在里面的地方；而分支两样都有，因为它就是。',
  [fingerprint(
    'Children sit behind the same hairline a group draws, one indent further in, so depth reads as depth. Two levels is what the indent has room for at this width; a third is a horizontal scrollbar with an outline in it. Collapsed to icons a branch is its icon and its children are not drawn — a nested glyph under an unnested one is two marks with no visible relationship.',
  )]: '子项排在分组画出的同一根发丝线之后，再往里缩进一级，于是深度读起来就是深度。在这个宽度下，缩进只放得下两级；第三级就是一条横向滚动条，里头装着一份大纲。收成图标之后，一个分支就是它的图标，子项不再画出来——一个嵌套字形压在一个没嵌套的字形下面，是两个看不出任何关系的记号。',
  [fingerprint(
    '`Sidebar` — a navigation rail down the side of an application, with the control that hides it living on the thing it hides.',
  )]: '`Sidebar`——贴着应用侧边的一条导航栏，而收起它的那个控件，就长在它要收起的东西上。',
  [fingerprint(
    'Composed rather than configured: `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarFooter`, `SidebarSeparator`, `SidebarTrigger` and `useSidebar`. A rail is a header, a scrolling middle and a footer, and every product wants different things in all three; what the component owns is the part that is the same everywhere — the width, the edge, the scrolling, and what happens when it closes.',
  )]: '是拼出来的，不是配出来的：`SidebarProvider`、`Sidebar`、`SidebarHeader`、`SidebarContent`、`SidebarGroup`、`SidebarItem`、`SidebarFooter`、`SidebarSeparator`、`SidebarTrigger` 和 `useSidebar`。一条导航栏就是一个头、一段会滚的中间和一个脚，而每个产品在这三处想要的东西都不一样；组件自己拥有的，是那些到哪儿都一样的部分——宽度、边缘、滚动，以及它关上时会发生什么。',
  [fingerprint(
    '**Closing has three shapes.** `icon` keeps the rail and drops the labels, which suits a fixed set a reader learns the shape of. `offcanvas` takes the whole rail away, which suits a long index nobody memorises — ninety-two rows collapse to ninety-two identical file icons, which is width answering nothing. `none` is a rail that does not close.',
  )]: '**关起来有三种形状。** `icon` 留下导航栏、去掉文字，适合一组固定的、读者会记住其形状的项。`offcanvas` 把整条栏都收走，适合一份没人背得下来的长索引——九十二行会塌成九十二个一模一样的文件图标，这样的宽度什么也没回答。`none` 是一条不会关的导航栏。',
  [fingerprint(
    '**The trigger belongs inside.** A control that hides a thing lives on the thing: in an application\'s masthead it is one more anonymous icon in a row of them, with nothing connecting it to the column it operates.',
  )]: '**触发器属于里面。** 收起某样东西的控件，就该长在那样东西上：放进应用的顶栏，它不过是一排匿名图标里再多一个，跟它操作的那一列之间没有任何联系。',
  [fingerprint(
    '**A collapsed row is still a named row.** The label leaves the layout — a `sr-only` label still occupies the flex row\'s gap — and becomes the row\'s tooltip, because an icon alone is a guess for a sighted reader and nothing at all for a screen reader. The provider supplies the tooltip provider that needs, so the icon state works without the app being told to wrap itself in one.',
  )]: '**收起来的一行，仍然是有名字的一行。** 文字标签离开布局——一个 `sr-only` 标签仍然会占掉 flex 行的间距——转而成为这一行的 tooltip，因为光有图标，对看得见的读者是猜测，对屏幕阅读器则什么都不是。tooltip 需要的那个 provider 由 `SidebarProvider` 一并提供，所以图标状态不必先叫应用把自己包一层才能用。',
  [fingerprint(
    '**A `<nav>`, not an `<aside>`.** The element decides the landmark, and a rail of links announced as "complementary" is not the one a reader jumps to when they go looking for the navigation.',
  )]: '**是 `<nav>`，不是 `<aside>`。** 元素决定了地标，而一条被念作「补充内容」的链接栏，不是读者去找导航时会跳过去的那一个。',
  [fingerprint(
    '`--sidebar-w` and `--sidebar-w-icon` are tokens, because the shell beside the rail has to reserve exactly what the rail believes it is.',
  )]: '`--sidebar-w` 和 `--sidebar-w-icon` 是 token，因为导航栏旁边的外壳，必须精确地留出导航栏自认为的那个宽度。',
  [fingerprint(
    'Every theme axis default now has a name, so a subtree can opt OUT of an ancestor\'s theme rather than only into a different one.',
  )]: '每一个主题轴的默认值现在都有名字了，于是一棵子树可以从祖先的主题里「退出来」，而不是只能「换到另一个里去」。',
  [fingerprint(
    '`[data-surface=\'paper\']`, `[data-rules=\'hairline\']`, `[data-type=\'editorial\']` and `[data-density=\'comfortable\']` join `[data-radius]`, which already worked this way. Each sits on the rule that declares the defaults rather than restating them, so there is nothing new to drift.',
  )]: '`[data-surface=\'paper\']`、`[data-rules=\'hairline\']`、`[data-type=\'editorial\']` 和 `[data-density=\'comfortable\']` 加入了本来就这么工作的 `[data-radius]`。每一个都挂在声明默认值的那条规则上，而不是把默认值重述一遍，所以没有任何新东西会漂移。',
  [fingerprint(
    'The gap this closes: "the White Reset" used to be spelled "write no attribute", which works exactly once — at the root. Inside a page whose root carries a theme, an unset axis is not the default, it is whatever the ancestor said. Five theme specimens on one page each inherited whichever theme the reader had applied to the site, and all five showed the same colours.',
  )]: '这补上的那个缺口：「白色重置」以前的写法是「一个属性都不写」，而这招只灵一次——在根节点上。在一个根节点已经带了主题的页面里，一个没设置的轴不是默认值，而是祖先说了算。同一页上的五个主题样本，各自继承了读者给站点应用的那个主题，于是五个都显示同一套颜色。',
  [fingerprint(
    'Two corrections found by the browser sweep, in the same layer:',
  )]: '浏览器巡检在同一层里找出的两处更正：',
  [fingerprint(
    '`[data-density=\'comfortable\']` first landed on a `:root` block that also carries the status colours, the floating surfaces and the motion steps, so every element declaring the default density re-declared the whole LIGHT palette on itself — in dark mode, a light `--danger` painted on a dark ground. A neutral value may only restate the axis it names, so density now sits on a rule holding nothing else.',
  )]: '`[data-density=\'comfortable\']` 最早落在了一个 `:root` 块上，而那个块同时还带着状态色、浮层表面和动效步长，于是每一个声明了默认密度的元素，都把整套「浅色」调色板重新声明到了自己身上——在深色模式下，就是一个浅色的 `--danger` 涂在深色底上。一个中性值只允许重述它自己点名的那一根轴，所以密度现在挂在一条别的什么都不带的规则上。',
  [fingerprint(
    'And the dark block was missing the compound forms — `[data-mode=\'dark\'][data-surface=\'paper\']` and the rest — so a dark subtree that named its own default surface got the light one back.',
  )]: '还有，深色那个块缺了复合形式——`[data-mode=\'dark\'][data-surface=\'paper\']` 之类——于是一棵深色子树，只要点名了自己的默认表面，拿回来的就是浅色那一个。',
  [fingerprint(
    'Two controls the forms group was missing, and the way out of the one a slider cannot do: `ColorPicker`, `NumberField`, and `editable` on `Slider`.',
  )]: '表单这一组缺的两个控件，外加滑块做不到的那件事的出路：`ColorPicker`、`NumberField`，以及 `Slider` 上的 `editable`。',
  [fingerprint(
    'The gap was written down in the package\'s own documentation. `Slider`\'s catalogue entry said "put an `Input` beside it when the exact number matters", which is a component library telling a caller to build the missing half by hand and keep two controls in step themselves. There was no numeric control with a range and no colour control at all.',
  )]: '这个缺口就白纸黑字写在这个包自己的文档里。`Slider` 的目录条目说「精确数值要紧的时候，在它旁边放一个 `Input`」——这是一个组件库在叫调用者自己手搓缺掉的那一半，还得自己让两个控件保持同步。当时既没有带范围的数值控件，也根本没有颜色控件。',
  [fingerprint(
    '**`ColorPicker`** — a swatch trigger and a panel that works in OKLCH. That is the substance rather than the styling: in HSV, which is what `<input type="color">` and most libraries use, a row of constant "lightness" visibly darkens as it saturates, so a reader tuning a palette is fighting the instrument. The plane is normalised to the gamut row by row, so its whole surface is reachable instead of a lens of colour inside bands of clipped duplicates, and the hue strip is taken at the lightness already chosen. It reads and writes hex, `rgb()`, `hsl()`, `oklch()` and `color(display-p3 …)`; the notation a caller passes in is the notation they get back. The plane is a group of two real sliders under the canvas rather than key handlers on it, so the arrows move it and a screen reader announces which axis it is on — the part a 2D picker usually leaves out, and leaving it out makes the control unusable rather than merely awkward.',
  )]: '**`ColorPicker`**——一个色块触发器，加上一块在 OKLCH 里工作的面板。这是实质而不是外观：在 HSV 里——也就是 `<input type="color">` 和多数库用的那一套——一排「明度」不变的颜色，会随着饱和度升高而肉眼可见地变暗，于是调色板的读者是在跟仪器较劲。这块平面是逐行按色域归一化的，所以它整个表面都够得着，而不是一小片有颜色的透镜夹在几条被裁掉的重复色带之间；色相条也取在已经选定的那个明度上。它读写 hex、`rgb()`、`hsl()`、`oklch()` 和 `color(display-p3 …)`；调用者传进去的记法，就是他们拿回来的记法。这块平面是画布下方两个真正的 slider 组成的一组，而不是挂在画布上的按键处理器，所以方向键能移动它，屏幕阅读器也会念出它当前在哪一根轴上——这是二维取色器通常会漏掉的那一部分，而漏掉它会让这个控件从「有点别扭」变成「根本没法用」。',
  [fingerprint(
    '**`NumberField`** — a real `<input type="number">` in the shared control box, with a grip that sweeps the value as it is dragged, one step every 4px and ten with Shift held. A value that is TUNED — a duration, a line height, an offset — is found by passing through its neighbours, not by typing candidates one at a time. Clamping happens when the field is left rather than on every keystroke, because a minimum of 10 otherwise makes 50 unreachable: the `5` is pushed up before the `0` arrives.',
  )]: '**`NumberField`**——共用控件框里一个真正的 `<input type="number">`，带一个拖动时扫过数值的握把，每 4px 一步，按住 Shift 就是十步。一个需要「调」出来的值——一段时长、一个行高、一个偏移——是穿过它的邻居找到的，不是一个一个把候选值打出来试。夹取发生在离开字段的时候，而不是每一次按键，因为最小值若是 10，否则 50 就永远打不出来：`5` 在 `0` 到达之前就被顶上去了。',
  [fingerprint(
    '**`Slider`\'s `editable`** — turns the readout into a box per thumb, showing `format`\'s output at rest and the bare number on focus, so a reader still sees "$1,200" and a typist is never asked to type a currency symbol back. A typed value is held inside the neighbouring thumb as well as inside `min` and `max`, which is the bound a dragged one cannot cross and a typed one can.',
  )]: '**`Slider` 的 `editable`**——把读数变成每个滑块一个输入框，静止时显示 `format` 的输出，聚焦时显示裸数字，于是读者看到的仍然是「$1,200」，而打字的人从不会被要求把货币符号再敲一遍回去。打进去的值同时被夹在相邻滑块之内，以及 `min` 和 `max` 之内——前者正是拖动越不过、而打字越得过的那道界。',
  [fingerprint(
    '`Slider` is now controlled from its own state whether or not the caller controls it, because a number typed into the readout never passes through Radix — left as it was, the thumb stayed where it had been while the figure above it moved.',
  )]: '`Slider` 现在无论调用者控不控制它，都由它自己的 state 来控制，因为打进读数里的数字从不经过 Radix——照原样放着，滑块会停在原地不动，而它上方的数字已经变了。',
  [fingerprint(
    'The colour maths is adapted from [DialKit](https://github.com/joshpuckett/dialkit) (MIT, Copyright (c) 2026 Josh Puckett); the notice travels with it in `src/lib/color.ts`.',
  )]: '颜色运算改编自 [DialKit](https://github.com/joshpuckett/dialkit)（MIT，Copyright (c) 2026 Josh Puckett）；版权声明跟着它一起放在 `src/lib/color.ts` 里。',
  [fingerprint(
    'The rail stops looking like a terminal listing.',
  )]: '导航栏不再像一份终端清单了。',
  [fingerprint(
    'A `SidebarGroup` heading was set in the MONO face at 15px medium. Ten of those stacked in a column read as a code listing rather than as a navigation: mono is this system\'s voice for code, metadata and figures, and a navigation heading is none of those. The heading is now the same face and size as its rows and outranks them by weight and by one step of ink — the two signals that can rank a row without changing what kind of thing it is. Counts come off mono too.',
  )]: '`SidebarGroup` 的标题原本用等宽字体、15px、medium 字重排。十个这样的标题竖着堆成一列，读起来像一份代码清单，而不像一套导航：等宽是这套系统留给代码、元数据和数字的嗓音，而导航标题一样都不是。标题现在跟它下面的行同字体同字号，靠字重和一档墨色压过它们——这两个信号能给一行排位，又不改变它是哪一类东西。计数也从等宽里挪了出来。',
  [fingerprint(
    '`NavItem` tightens with it: `--radius-sm`, and the padding a 14px row wants rather than the padding a 15px one did.',
  )]: '`NavItem` 跟着收紧：`--radius-sm`，以及 14px 的行该有的内边距，而不是 15px 的行原来那套。',
  [fingerprint(
    '`BulletChart` draws its target where the target is.',
  )]: '`BulletChart` 把目标线画在目标真正在的地方。',
  [fingerprint(
    'Two ways the rule went missing, and the second one is the common case.',
  )]: '那根线消失的两种方式，而第二种才是常见情况。',
  [fingerprint(
    'A fixed half-width pull put a target at the bottom of the scale half outside the track, where `overflow-hidden` took it — so "Open incidents, target 0" drew no target at all, on the one measure whose whole point is the distance from it. The pull is proportional now: flush at the start at 0, flush at the end at 1, centred on its position everywhere between.',
  )]: '一个固定的半宽偏移，会把落在刻度最底端的目标线推得一半在轨道之外，然后被 `overflow-hidden` 吃掉——于是「未结事故，目标 0」根本没画出目标线，偏偏这条指标的全部意义就是「离目标还有多远」。现在这个偏移是按比例的：在 0 处贴着起点，在 1 处贴着终点，中间任何位置都以它自己为中心。',
  [fingerprint(
    'And the rule is drawn in `--ink` on a bar drawn in `--ink`, so wherever the target sat INSIDE the achieved range it was an ink rule on an ink bar and simply not there — which is every measure that is meeting its target. It now carries a paper halo, so it reads against the bar and against the bands alike.',
  )]: '还有，这根线用 `--ink` 画，而柱子也用 `--ink` 画，所以只要目标落在已达成的区间「里面」，它就是一根墨色的线画在墨色的柱子上，等于根本不在——而那正是每一条正在达标的指标。它现在带了一圈纸色描边，于是无论衬着柱子还是衬着背景色带，都读得出来。',
  [fingerprint(
    'Diagram edges go straight when straight is available.',
  )]: '图表连线在能走直线的时候就走直线。',
  [fingerprint(
    'Two bugs, one symptom. The port spread keyed on the word `auto` rather than on the face a line would actually use, so every auto-routed line leaving one node counted as sharing a face with every other — a node with one line going right and one going down had both nudged off centre to make room for each other on a face neither was on. Each line then arrived a few units out of true, and the router answered that with a dogleg: two corners, an S, and a line that looks like it is avoiding something.',
  )]: '两个 bug，一个症状。端口分散是按 `auto` 这个词来判定的，而不是按线实际会用的那一面，于是从同一个节点出发的每一条自动路由线，都被算作跟其他所有线共用一面——一个节点上一条线往右、一条线往下，两条都被挤离中心，好给对方在一个谁都不在的面上腾地方。于是每条线到达时都偏了几个单位，而路由器对此的回答是拐一个折：两个角、一个 S 形，一条看上去像在绕开什么东西的线。',
  [fingerprint(
    'The spread now keys on the resolved face, and a line whose two ends are within two corner radii of each other is drawn straight rather than kinked — below that threshold the dogleg cannot even draw its own corners. Real turns keep their elbows.',
  )]: '分散现在按解析出来的那一面判定，而两端相距在两个圆角半径以内的线会画成直的而不是拐折的——低于这个阈值，那个折连自己的角都画不出来。真正的转弯仍然保留它的肘部。',
  [fingerprint(
    'A floating panel now reads as floating, and a list draws one highlight rather than two.',
  )]: '浮层现在读起来是浮着的，而一个列表只画一处高亮，不是两处。',
  [fingerprint(
    '**Depth.** Every overlay — menu, popover, select, dialog, sheet, palette — sat on `--paper` over a page of `--paper` with a hairline between them, so nothing said the two were different surfaces. `--panel-lift` is the offset under them, and it does not break Law 2: the law says a box-shadow is never BLURRED, not that there is never one. Two hard steps in the rule colours, which is a stack seen from the front — the flattest way to say depth without drawing light.',
  )]: '**深度。** 每一种浮层——菜单、popover、select、对话框、抽屉、命令面板——都坐在 `--paper` 上，而页面也是 `--paper`，中间只隔一根发丝线，于是没有任何东西说明这是两个不同的表面。`--panel-lift` 就是它们底下的那道偏移，而它并不违反第二定律：定律说的是 box-shadow 从不「带模糊」，不是说从来不许有。用线条色画出两级硬边，那是一叠东西从正面看过去的样子——在不画光的前提下，说出深度最扁平的办法。',
  [fingerprint(
    '**One highlight.** `SidebarItem` drew the current page filled and filled a row under the pointer, which is two rows claiming to be where the reader is. While the pointer is in the list the fill is the pointer\'s, and it returns to the current row when the pointer leaves. `aria-current` never moves — nothing about what is TRUE changes, only what is drawn.',
  )]: '**只有一处高亮。** `SidebarItem` 会给当前页面画填充，也会给指针下的那一行画填充，于是有两行同时声称「读者在这儿」。指针在列表里的时候，填充归指针；指针离开，填充回到当前行。`aria-current` 从不移动——「什么是真的」没有任何改变，改变的只是画出来的东西。',
  [fingerprint(
    '`TabsList` no longer grows a vertical scrollbar beside a row of tabs.',
  )]: '`TabsList` 不会再在一排标签旁边长出一条竖直滚动条了。',
  [fingerprint(
    '`overflow-x: auto` on its own computes `overflow-y` to `auto` as well, and the active trigger\'s `-mb-px` rule leaves the content exactly one pixel taller than the box — enough for a browser to draw a full-height scrollbar next to a strip with nothing to scroll. A strip only ever scrolls sideways, so it now says so.',
  )]: '单写 `overflow-x: auto` 会把 `overflow-y` 也算成 `auto`，而选中标签那条 `-mb-px` 规则让内容刚好比容器高出一个像素——足够让浏览器在一条根本没东西可滚的横条旁边画出一条通高的滚动条。一条横条只会横着滚，所以现在它就这么写了。',
  [fingerprint(
    'Three things that did not line up.',
  )]: '三处没对齐的东西。',
  [fingerprint(
    '**`Sidebar` renders without a provider.** It threw, which is defensible for a hook a consumer called by hand and wrong for the component: `<Sidebar>` on its own is the first thing anybody writes, and the documentation site\'s own props panel renders exactly that and got an error boundary instead of a rail. The parts now fall back to the state a rail with no controls would be in — open, not collapsible. `useSidebar` still throws, because a call to the hook is code asking for state nothing is keeping.',
  )]: '**`Sidebar` 现在没有 provider 也能渲染。** 它以前会抛错——对一个被调用者手动调用的 hook 来说这说得过去，对组件来说就是错的：单写一个 `<Sidebar>` 是任何人第一个会写的东西，而文档站自己的属性面板渲染的正是这个，拿到的却是一个错误边界而不是一条导航栏。这些部件现在会退回到「一条没有控件的导航栏」该有的状态——展开，且不可收起。`useSidebar` 仍然会抛错，因为调用这个 hook 是代码在要一份根本没人在保存的状态。',
  [fingerprint(
    '**`ErrorState`\'s code was set `leading-none`.** At the title step this face draws about 62px of ink and a line box of exactly the font size is 47, so the figures overflowed their own box by seven pixels at each end — pressing against the eyebrow above and eating a third of the gap to the heading below. It has a real line box now, and the space the layout asks for is the space that appears.',
  )]: '**`ErrorState` 的状态码原本设了 `leading-none`。** 在 title 这一档，这套字体画出来大约有 62px 的墨，而恰好等于字号的行盒只有 47，于是数字上下各溢出自己的盒子七个像素——上顶着眉标，下吃掉了到标题那段间距的三分之一。它现在有一个真正的行盒了，布局要多少空间，出现的就是多少。',
  [fingerprint(
    '**`TD` says why it is top-aligned, and when not to be.** A 36px row action beside 16px of text makes a 52px row, and top-aligned every other cell hangs at the top of it with twenty pixels of nothing underneath.',
  )]: '**`TD` 现在会说清楚它为什么顶对齐，以及什么时候不该顶对齐。** 16px 的文字旁边放一个 36px 的行内操作，这一行就有 52px 高，而顶对齐之下，其他每一个单元格都吊在这一行的顶上，底下空着二十个像素。',
  // ─── 0.8.0 ───
  [fingerprint(
    'The package tells an agent when it gets a component wrong, and reaches agents that are not Claude Code.',
  )]: '这个包会在 agent 把组件用错时当场告诉它，也够得到 Claude Code 以外的 agent。',
  [fingerprint(
    'Six gaps, found by re-reading what the ecosystem settled on since the agent surface shipped.',
  )]: '六处缺口，是把 agent 界面发布之后生态最终定下来的那些做法重读一遍找出来的。',
  [fingerprint(
    '**Development warnings, written to be repaired from.** The skill documented a handful of ways to misuse a component that fail *silently*, and documentation only helps a reader who went looking — the whole problem being that nothing told them to look. Now the component says it where it happens, in the shape an agent can act on without asking: a stable code, the offending field, and an imperative fix.',
  )]: '**开发期警告，写出来就是给人照着修的。** 这个 skill 记录了几种会*无声*失败的组件误用方式，而文档只帮得了那个已经去查的读者——问题的全部就在于，压根没有东西告诉他们要去查。现在组件在出问题的地方当场把话说出来，而且是 agent 不必再问就能照办的形状：一个稳定的代码、出问题的那个字段，以及一句祈使语气的修法。',
  [fingerprint(
    '`FIELD_CONTROL_NOT_LABELLABLE` — `<Field><div><Input /></div></Field>` renders, and the label points at the div. This is the failure that looks most correct.',
  )]: '`FIELD_CONTROL_NOT_LABELLABLE`——`<Field><div><Input /></div></Field>` 能渲染出来，而标签指向的是那个 div。这是所有失败里看起来最像对的一种。',
  [fingerprint(
    '`FIELD_CONTROL_NOT_WIRED` — no single element to wire at all.',
  )]: '`FIELD_CONTROL_NOT_WIRED`——压根没有一个可以接线的单一元素。',
  [fingerprint(
    '`BUTTON_ICON_ONLY_UNNAMED` — an `iconOnly` Button with neither `aria-label` nor `aria-labelledby` is announced as "button" and nothing else.',
  )]: '`BUTTON_ICON_ONLY_UNNAMED`——一个既没有 `aria-label` 也没有 `aria-labelledby` 的 `iconOnly` Button，被念出来就是「button」，再没有别的。',
  [fingerprint(
    '`REQUIRED_NAME_BLANK` — `<Table caption="">` satisfies the type and leaves the table anonymous. Applied to `Table.caption`, `Progress.label`, `Select.label`, `Combobox.label` and `FloatingIconButton.label`; deliberately not to `Avatar.alt`, where an empty string is the correct markup for a decorative image.',
  )]: '`REQUIRED_NAME_BLANK`——`<Table caption="">` 满足类型，却把表格留成匿名的。它作用在 `Table.caption`、`Progress.label`、`Select.label`、`Combobox.label` 和 `FloatingIconButton.label` 上；刻意不作用在 `Avatar.alt` 上——对一张装饰性图片来说，空字符串正是正确的标记。',
  [fingerprint(
    'Each fires once per problem, and every call site is behind `process.env.NODE_ENV`, so none of it reaches a production bundle.',
  )]: '每一条对同一个问题只发一次，而且每一处调用都在 `process.env.NODE_ENV` 后面，所以这些东西一点都不会进到生产包里。',
  [fingerprint(
    '**`init` reaches more than one agent.** It wrote only `.claude/skills/`, which handed Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Cline, Zed and Warp nothing. It now writes `.agents/skills/` — the path all of those share — and adds `.claude/skills/` when the project already has one. `--agent agents` or `--agent claude` picks one.',
  )]: '**`init` 现在够得到不止一个 agent。** 它以前只写 `.claude/skills/`，于是 Codex、Cursor、GitHub Copilot、Gemini CLI、OpenCode、Cline、Zed 和 Warp 什么也没拿到。现在它写 `.agents/skills/`——这些 agent 共用的那条路径——并且在项目已经有 `.claude/skills/` 时把它一并写上。`--agent agents` 或 `--agent claude` 可以只挑一个。',
  [fingerprint(
    '**Pointer files at the package root.** `AGENTS.md`, `CLAUDE.md` and `llms.txt` now ship in the tarball. An agent exploring `node_modules` looks for those filenames before it opens a README or reaches the network, and found none of them. They are pointers only, so they cannot go stale between releases. The `AGENTS.md` doubles as the nested subproject file for anyone working on the package in its own repository.',
  )]: '**包根目录下的指路文件。** `AGENTS.md`、`CLAUDE.md` 和 `llms.txt` 现在会装进 tarball 一起发出去。一个在 `node_modules` 里翻找的 agent，会先去找这几个文件名，然后才打开 README 或者上网——而它一个也找不到。它们只是指路用的，所以不会在两次发布之间过期。那份 `AGENTS.md` 同时兼任嵌套子项目文件，供在这个包自己的仓库里干活的人使用。',
  [fingerprint(
    '**Prompt-based evals.** `skills/misoto22-design/evals/evals.json` carries six tasks with the identifiers correct output must and must not contain. `claims.json` proves the rules match the package; it cannot prove an agent given the rules writes correct code, and this is the half that can. Every `must_use` identifier is checked against the real export surface, so an eval cannot quietly start expecting something the package no longer ships.',
  )]: '**基于提示词的 eval。** `skills/misoto22-design/evals/evals.json` 装着六个任务，连同正确输出必须包含、以及必须不包含的那些标识符。`claims.json` 证明的是规则和这个包对得上；它证明不了一个拿到规则的 agent 会写出正确的代码，而这一半才能。每一个 `must_use` 标识符都会拿真实的导出面去核对，所以一条 eval 不可能悄悄开始期待一个这个包已经不再发布的东西。',
  [fingerprint(
    'Also documented: `npx skills add Misoto22/misoto22-design` already works and nothing said so.',
  )]: '另外补进文档的一件事：`npx skills add Misoto22/misoto22-design` 早就能用了，而之前没有任何地方说过。',
  [fingerprint(
    'Five content primitives: `Text`, `Heading`, `Code`, `CodeBlock` and `Markdown`.',
  )]: '五个内容原语：`Text`、`Heading`、`Code`、`CodeBlock` 和 `Markdown`。',
  [fingerprint(
    'The package had `Article` — a whole reading column, styled from element selectors — and nothing between it and raw JSX for a single paragraph or one heading. The evidence was not theoretical: the documentation site had hand-rolled a private `CodeBlock` of its own, and a template pass had styled a raw `<pre>` against the tokens because the package exports no code block. A design system whose own site has to build a primitive has a gap in the package.',
  )]: '这个包有 `Article`——一整根阅读栏，样式全靠元素选择器——而在它和「为一个段落或一个标题手写 JSX」之间，什么都没有。证据不是理论上的：文档站自己手搓了一个私有的 `CodeBlock`，而一轮模板还照着 token 给一个裸 `<pre>` 上了样式，就因为这个包不导出代码块。一套设计系统，如果它自己的站点不得不去造一个原语，那就是这个包缺了一块。',
  [fingerprint(
    '**`Text`** — the system\'s paragraph. Four steps of type, three rungs of ink, and `as` to change the element without changing the look. The default tone is `--ink-2`, not `--ink`: a page whose paragraphs are all full-strength ink has spent the top of the ladder on its body copy.',
  )]: '**`Text`**——这套系统的段落。四级字号、三档墨色，外加一个 `as`，用来只换元素不换外观。默认的调子是 `--ink-2` 而不是 `--ink`：一个段落全用满强度墨色的页面，等于把梯子的顶端花在了正文上。',
  [fingerprint(
    '**`Heading`** — `level` sets the element, `size` sets the look, and they are two props because every heading component that takes one number bends either the outline or the type to reach the other. `size` defaults from `level` through the system\'s ladder, which SKIPS a step between the first two levels — `--fs-lead` over `--fs-heading` is a ratio of 1.14 and reads as an accident, where `--fs-title` over `--fs-heading` is 1.86 and reads as a hierarchy. Levels five and six are the mono kicker, as they are in `article.css`.',
  )]: '**`Heading`**——`level` 定元素，`size` 定外观；它们是两个 prop，因为凡是只收一个数字的标题组件，都得把大纲或者字号中的一个掰弯，才够得到另一个。`size` 顺着这套系统的阶梯从 `level` 推出默认值，而这条阶梯在头两级之间**跳过了一档**——`--fs-lead` 比 `--fs-heading` 是 1.14，读起来像个意外；`--fs-title` 比 `--fs-heading` 是 1.86，读起来才是一层层级。第五级和第六级是等宽小标，和 `article.css` 里一样。',
  [fingerprint(
    '**`Code`** — inline code, as a real `<code>`, sized in `em` so the same token is proportionate in body copy and in a table cell.',
  )]: '**`Code`**——行内代码，是一个真正的 `<code>`，尺寸用 `em`，所以同一个 token 在正文里和在表格单元格里都成比例。',
  [fingerprint(
    '**`CodeBlock`** — title, language label, line numbers, banded lines, a `maxHeight` whose overflow scrolls inside a focusable, named `role="group"`, and a copy button that copies the `code` string rather than the rendered markup. The body is a group and not a `region` on purpose: a region is a LANDMARK, one of the handful of major sections a reader navigates a page by, and a snippet is not one — an article carrying three fenced blocks would otherwise put three landmarks called "Code" into that map. The group keeps the tab stop and keeps the name; it just stays out of the landmark list. Highlighting stays out of the package: pass `html` from a build-time Shiki pass, or pass nothing and the block renders the string as text. `lineNumbers` and `highlightLines` are typed out of the `html` form, because they are a per-line structure and `html` is one opaque string — passing both is a compile error rather than a prop that silently renders nothing.',
  )]: '**`CodeBlock`**——标题、语言标签、行号、隔行底色、一个 `maxHeight`（超出的部分在一个可聚焦、有名字的 `role="group"` 里滚动），以及一个复制按钮，复制的是 `code` 字符串而不是渲染出来的标记。正文是 group 而不是 `region`，这是故意的：region 是一个**地标**，是读者用来在一个页面里跳转的那少数几个主要区段之一，而一段代码片段不是——否则一篇带三个围栏代码块的文章，就会往那张地图里塞进三个都叫「Code」的地标。group 保住了 tab 停靠点，也保住了名字；它只是不进地标列表。高亮留在包外面：要么从构建期的一轮 Shiki 传 `html` 进来，要么什么都不传，这个块就把字符串当纯文本渲染。`lineNumbers` 和 `highlightLines` 在类型上被排除在 `html` 那种形式之外，因为它们是逐行的结构，而 `html` 是一整个不透明的字符串——两个一起传是编译错误，而不是一个悄悄什么都不渲染的 prop。',
  [fingerprint(
    '**`Markdown`** — a Markdown STRING into system-styled nodes. This is the headline gap: user-generated content, a model\'s answer or a README had no path into the system at all, because `Article` takes trusted HTML through `dangerouslySetInnerHTML` and is documented that way.',
  )]: '**`Markdown`**——把一个 Markdown **字符串**变成带系统样式的节点。这是最要紧的那处缺口：用户生成的内容、一个模型的回答、一份 README，压根没有任何一条进入这套系统的路，因为 `Article` 走的是 `dangerouslySetInnerHTML` 收可信 HTML，文档里也是这么写的。',
  [fingerprint(
    'No new runtime dependency, and that was the decision worth writing down. markdown-it is what the documentation site uses, but the site is an app and this is a library, where the dependency list is part of the contract. Measured with the same esbuild pass `check:size` runs, markdown-it is 110.7 kB minified against the 38.9 kB the package had left under its bundle budget. So `Markdown` parses the subset this system already styles — headings, prose, fences, blockquotes, nested lists, rules, and inline emphasis, code, links and images — and takes a `parse` function for everything else. It emits React elements rather than markup, so there is no `dangerouslySetInnerHTML` in that path at all: no sanitiser to configure and none to get wrong. A link whose scheme is not `http`, `https`, `mailto` or `tel` renders as plain text.',
  )]: '没有新增运行时依赖，而这正是值得写下来的那个决定。文档站用的是 markdown-it，但站点是应用，这里是库，而库的依赖清单是契约的一部分。用 `check:size` 跑的同一轮 esbuild 量过：markdown-it 压缩后是 110.7 kB，而这个包在打包预算下只剩 38.9 kB。所以 `Markdown` 只解析这套系统本来就已经上了样式的那个子集——标题、正文、围栏代码、引用块、嵌套列表、分隔线，以及行内的强调、代码、链接和图片——其余一切交给一个 `parse` 函数。它吐出的是 React 元素而不是标记，所以那条路径上压根没有 `dangerouslySetInnerHTML`：既没有 sanitiser 要配置，也就没有 sanitiser 会配错。一个 scheme 不是 `http`、`https`、`mailto` 或 `tel` 的链接，会被渲染成纯文本。',
  [fingerprint(
    '`headingLevelStart` shifts a whole document down, so markdown dropped inside an `<h2>` section starts at `<h3>` instead of opening a second `<h1>`, and every heading carries a stable id slugged from its own text in any script — exported as `slugify`, so a table of contents can arrive at the same ids without reading them back off the DOM.',
  )]: '`headingLevelStart` 会把整份文档整体下移，所以一段丢进 `<h2>` 区段里的 markdown 从 `<h3>` 开始，而不是又开一个 `<h1>`；并且每个标题都带一个稳定的 id，由它自己的文字生成，任何文种都行——这个函数以 `slugify` 导出，所以一份目录不必回头从 DOM 上读，也能得到同样的一批 id。',
  [fingerprint(
    '`Markdown` and `Article` stay separate and are composable: `Markdown` turns a string into nodes, `Article` is the reading column those nodes sit in, and either works alone. It renders a fragment rather than a wrapper, which is what makes the nesting work — `Article`\'s rhythm is a direct-child combinator, so any element between the two would cost every paragraph its spacing.',
  )]: '`Markdown` 和 `Article` 保持分开，而且可以组合：`Markdown` 把字符串变成节点，`Article` 是这些节点坐落其中的那根阅读栏，两者各自单用也成立。它渲染的是一个 fragment 而不是一个包装元素，正是这一点让嵌套成立——`Article` 的节奏靠的是直接子元素组合器，所以两者之间但凡多一个元素，每一个段落都要赔上自己的间距。',
  [fingerprint(
    'The whole package bundles to 390.6 kB minified against a 420 kB budget, up 9.5 kB; the compiled stylesheet is 71 kB against 90 kB, up 3.3 kB. Importing one leaf component is unchanged at 27.3 kB, 7% of the whole.',
  )]: '整个包压缩后打包到 390.6 kB，预算是 420 kB，涨了 9.5 kB；编译出来的样式表是 71 kB，预算是 90 kB，涨了 3.3 kB。只导入一个叶子组件仍然是 27.3 kB，占整体的 7%。',
  [fingerprint(
    'Four record-and-settings primitives — `DescriptionList`, `Toolbar`, `Timestamp` and `AspectRatio` — and three props that made a fourth and fifth component unnecessary.',
  )]: '四个用于记录与设置的原语——`DescriptionList`、`Toolbar`、`Timestamp` 和 `AspectRatio`——外加三个 prop，它们让第四个和第五个组件变得没有必要。',
  [fingerprint(
    'The evidence was a template pass: eight new pages built from the existing library, and a list of what had to be hand-rolled and how many times. The repeats are what shipped.',
  )]: '证据来自一轮模板：用现有的库搭了八个新页面，并记下哪些东西不得不手搓、各搓了几次。重复出现的那些，就是这次发出来的东西。',
  [fingerprint(
    '**`DescriptionList`** — a record\'s fields as a real `<dl>`/`<dt>`/`<dd>`. The most repeated shape in any detail page, and the one most often built out of a `<div>` grid — which looks identical and tells a screen reader there are two columns of unrelated text. `layout` is `row` or `stacked`, `divided` draws the hairlines, and an empty `items` renders `null` rather than an empty bordered box.',
  )]: '**`DescriptionList`**——把一条记录的各个字段做成真正的 `<dl>`/`<dt>`/`<dd>`。这是任何详情页里重复得最多的形状，也是最常被拿一个 `<div>` 网格搭出来的那一个——看上去一模一样，却在告诉读屏软件：这里有两列互不相干的文字。`layout` 取 `row` 或 `stacked`，`divided` 画出细线，而空的 `items` 渲染成 `null`，不是一个空的带边框的盒子。',
  [fingerprint(
    '**`Toolbar`** — the sticky bar of actions at the edge of a working surface, built independently by two templates. Opaque `--paper` and not a blur, because content scrolls under it. It is a named `role="group"` and deliberately not `role="toolbar"`: that role promises arrow keys between the controls, and declaring it without roving tabindex tells a screen-reader user to press keys that do nothing.',
  )]: '**`Toolbar`**——工作面边缘那条吸附的动作栏，被两套模板各自独立地造过一遍。用的是不透明的 `--paper` 而不是模糊，因为内容会从它下面滚过去。它是一个有名字的 `role="group"`，并且刻意不用 `role="toolbar"`：那个角色承诺控件之间可以用方向键走，而在没有 roving tabindex 的情况下声明它，等于在告诉一位读屏用户去按一些什么都不会发生的键。',
  [fingerprint(
    '**`Timestamp`** — an instant, rendered the one way the system renders them. The first paint is the UTC calendar date sliced straight out of the ISO string with no `Intl` involved, so the server and the hydrating client cannot disagree; the relative and locale-aware forms are applied after mount. The `datetime` attribute is the full ISO instant from the first render and never changes. A value nothing can parse renders an em dash, never the browser\'s literal `Invalid Date`.',
  )]: '**`Timestamp`**——一个时刻，按这套系统渲染时刻的那唯一一种方式渲染出来。第一次绘制是直接从 ISO 字符串里切出来的 UTC 日历日期，全程不碰 `Intl`，所以服务端和正在水合的客户端不可能各说各话；相对时间和随语言环境变化的形式，都在挂载之后才应用。`datetime` 属性从第一次渲染起就是完整的 ISO 时刻，此后永不改变。一个谁也解析不了的值渲染成一个破折号，绝不会是浏览器那句字面的 `Invalid Date`。',
  [fingerprint(
    '**`AspectRatio`** — the one layout primitive that is genuinely hard by hand. The `padding-top` percentage trick resolves against the WIDTH, which is why it works and also why it breaks as a flex child. Here the box declares `aspect-ratio` and every direct child is stretched out of flow, so content with no intrinsic size still holds the box open.',
  )]: '**`AspectRatio`**——唯一一个手写起来是真的难的布局原语。`padding-top` 百分比那个技巧，是拿**宽度**去解析的，这既是它能成的原因，也是它作为 flex 子元素就崩的原因。这里的盒子直接声明 `aspect-ratio`，每个直接子元素都被拉出常规流铺满，所以没有固有尺寸的内容照样能把盒子撑开。',
  [fingerprint(
    'Three additions that are props rather than components:',
  )]: '三处新增，它们是 prop 而不是组件：',
  [fingerprint(
    '**`Field` gains `description` and `layout="row"`** — the settings row, which a template hand-rolled three times. It is a layout on `Field` and not a `SettingRow` beside it, because the label wiring, the required marker and the message slot are the same three things either way. `description` explains the setting and sits under the label; `hint` explains the input and sits under the control. Both reach the control through `aria-describedby`. The association is `Field`\'s existing `cloneElement` wiring, so it holds for `Input`, `Textarea`, `NativeSelect`, `Checkbox` and `Switch` — every control a settings row is built from — and not for the six composite controls that already carry their own `label` prop. That limit is now written into `Field`\'s own documentation rather than only into the catalog.',
  )]: '**`Field` 新增 `description` 和 `layout="row"`**——也就是设置行，一套模板手搓过三次。它做成 `Field` 上的一种布局，而不是旁边另立一个 `SettingRow`，因为不管走哪条路，标签接线、必填标记和消息槽都是同样这三样东西。`description` 解释这项设置，坐在标签下面；`hint` 解释这个输入框，坐在控件下面。两者都通过 `aria-describedby` 够到控件。这层关联用的是 `Field` 现有的 `cloneElement` 接线，所以它对 `Input`、`Textarea`、`NativeSelect`、`Checkbox` 和 `Switch` 成立——一个设置行会用到的每一个控件——而对那六个已经自带 `label` prop 的复合控件不成立。这条边界现在写进了 `Field` 自己的文档里，而不再只写在 catalog 里。',
  [fingerprint(
    '**`Tag` gains `onRemove` and `removeLabel`** — instead of a `Token` component. A token is a tag with a remove button; the difference is one prop, and this system already ships three things that look alike. `removeLabel` is required alongside `onRemove`, because "Remove" repeated down a row of filters is eight controls a screen reader cannot tell apart.',
  )]: '**`Tag` 新增 `onRemove` 和 `removeLabel`**——用它替掉一个 `Token` 组件。token 就是带一个移除按钮的 tag；差别只有一个 prop，而这套系统已经发了三样长得差不多的东西。`removeLabel` 必须和 `onRemove` 一起给，因为一整排筛选器上重复出现的「Remove」，对读屏软件来说就是八个分不出彼此的控件。',
  [fingerprint(
    '**`Separator` gains `label`** — "or continue with" was two `Separator`s and a `span` at every call site. The rule is drawn twice, one `aria-hidden` piece either side of the words, so there is no ground to punch a hole in and the component never has to be told which surface it is on.',
  )]: '**`Separator` 新增 `label`**——「or continue with」这种东西，以前在每一处调用点都是两个 `Separator` 加一个 `span`。现在这条线画两遍，文字两侧各一段 `aria-hidden`，所以不需要在任何底上抠一个洞，组件也永远不必被告知自己正坐在哪种表面上。',
  [fingerprint(
    '`EmptyState` and `ErrorState` take a `level`, and stop deciding the document outline for the caller.',
  )]: '`EmptyState` 和 `ErrorState` 接受一个 `level`，不再替调用方决定文档大纲。',
  [fingerprint(
    'Both rendered a heading at a level that was fixed and could not be passed in — `ErrorState` an `h1`, `EmptyState` an `h3`. That is not only a markup detail: the catalog entry for `ErrorState` already told readers "do not render it inside a shell that already has an h1", which was advice the API gave them no way to take. A rule the caller cannot follow is worse than no rule.',
  )]: '两者渲染的标题层级都是写死的，传不进去——`ErrorState` 是 `h1`，`EmptyState` 是 `h3`。这不只是一个标记细节：`ErrorState` 的 catalog 条目早就在告诉读者「不要把它渲染在一个已经有 h1 的外壳里」，而这条建议，API 根本没给他们照做的办法。一条调用方无法遵守的规则，比没有规则更糟。',
  [fingerprint(
    'Both now render through `Heading`, so the element and the size are separate props and the size is pinned by the component: `EmptyState` is `--fs-sub` and `ErrorState` is `--fs-heading` at every level. Moving a state down the outline is a fact about the document, not a request for smaller type.',
  )]: '两者现在都走 `Heading` 渲染，于是元素和字号是两个分开的 prop，而字号由组件钉死：`EmptyState` 在每一级都是 `--fs-sub`，`ErrorState` 在每一级都是 `--fs-heading`。把一个状态在大纲里往下挪，说的是关于这份文档的一个事实，不是在请求把字号调小。',
  [fingerprint(
    'The two defaults differ, and deliberately:',
  )]: '两个默认值不一样，而且是刻意的：',
  [fingerprint(
    '**`ErrorState` defaults to `1`, unchanged.** It replaces the page rather than sitting inside one — its own ground, its own viewport, its own top clearance — so the page\'s single `h1` is the one it renders. Existing call sites render exactly the markup they did. Inside an app shell that already owns the page heading, pass `level={2}`.',
  )]: '**`ErrorState` 默认是 `1`，没有变。** 它是替掉整个页面，而不是坐在页面里面——自己的底、自己的视口、自己的顶部留白——所以这个页面唯一的那个 `h1`，就是它渲染的那一个。现有的调用点渲染出来的标记和以前一模一样。在一个已经拥有页面标题的应用外壳里，传 `level={2}`。',
  [fingerprint(
    '**`EmptyState` defaults to `2`, changed from a fixed `3`.** It stands in for a whole view inside a page that already has an `h1`, so the level below that one is the level that does not leave a hole in heading navigation. The old `h3` was wrong in the ordinary case and impossible to correct.',
  )]: '**`EmptyState` 默认是 `2`，从写死的 `3` 改过来。** 它顶替的是一个已经有 `h1` 的页面里的整块视图，所以紧挨着那一级往下的那一级，才是不会在标题导航里留下窟窿的那一级。旧的 `h3` 在通常情况下就是错的，而且改不了。',
  [fingerprint(
    'Neither is required. The correct placement has one answer often enough that making every call site restate it would buy nothing, and `Heading` already proves the point that a good default is worth more than a forced decision.',
  )]: '两个都不是必填。正确的摆放位置在足够多的场合只有一个答案，逼每一处调用点把它再说一遍换不来任何东西；而 `Heading` 已经把这一点证明过了：一个好的默认值，比一次被迫做出的决定更值钱。',
  [fingerprint(
    '**What a consumer has to do.** If you relied on `ErrorState` rendering the page `h1`, nothing — that is still the default. If you relied on `EmptyState` rendering an `h3` — a CSS selector, a snapshot, a test querying by level — pass `level={3}` to keep it, or update the expectation. Nothing else about either component moved.',
  )]: '**使用者需要做什么。** 如果你依赖 `ErrorState` 渲染页面的 `h1`，什么都不用做——那仍然是默认值。如果你依赖 `EmptyState` 渲染一个 `h3`——一条 CSS 选择器、一份快照、一个按层级查询的测试——传 `level={3}` 就能保持原样，或者把预期改掉。这两个组件其余的部分都没有动。',
  [fingerprint(
    'One rendering difference beyond the element: the heading now takes its line-height from the system ladder — 1.25 for `EmptyState`, 1.2 for `ErrorState` — where before it inherited the ambient 1.5. That is the same leading `article.css` gives a rendered Markdown heading, which is what makes a component page and a post read as one publication. Font size, face, weight, colour and the surrounding spacing are unchanged.',
  )]: '除了元素之外，还有一处渲染上的差别：标题现在从这套系统的阶梯里取行高——`EmptyState` 是 1.25，`ErrorState` 是 1.2——而之前它继承的是周围的 1.5。这和 `article.css` 给一个渲染出来的 Markdown 标题的行距是同一个，正是这一点让一个组件页和一篇文章读起来像同一份出版物。字号、字体、字重、颜色以及周围的间距都没有变。',
  [fingerprint(
    '`Tag` owns the filter case, and `Markdown` finishes the link boundary.',
  )]: '`Tag` 把筛选这个场景接了过来，而 `Markdown` 把链接那道边界收了尾。',
  [fingerprint(
    'Both shipped hours ago and both were found by their first consumer.',
  )]: '两者都是几小时前才发出去的，而且都是被它们的第一个使用者发现的。',
  [fingerprint(
    '`Tag` takes an `onClick`. The advice used to be to wrap a tag in a button at the call site, which is fine alone and invalid the moment the chip is also removable: the remove control is a real `<button>`, so the wrapper made a button inside a button — markup a parser splits into siblings, leaving a DOM neither the author nor the accessibility tree expects. A removable filter chip is an ordinary thing to want, so the component now owns it. With `onClick` the chip IS the button, carrying `aria-pressed` from `active`; with both handlers the label and the X render as sibling buttons, and the label takes the leading padding with it so the target is the chip up to the X rather than the words with dead space around them. `aria-pressed` is emitted only when `active` is passed, so a chip that navigates does not announce itself as "not pressed".',
  )]: '`Tag` 接受一个 `onClick`。以前的建议是在调用处把一个 tag 包进一个 button 里，单独用没问题，可一旦这个 chip 同时还能移除，就不成立了：移除控件本身是一个真的 `<button>`，于是外面那层包装造出了一个 button 套 button——这种标记会被解析器拆成兄弟节点，留下一棵作者和无障碍树都没预料到的 DOM。一个可移除的筛选 chip 是再正常不过的需求，所以现在由组件自己接手。传了 `onClick`，这个 chip **就是**那个 button，并从 `active` 带上 `aria-pressed`；两个处理函数都传，标签和那个 X 就渲染成两个兄弟 button，而且标签会把前导内边距一起带走，于是可点区域是「chip 从头到 X 为止」，而不是「文字外加一圈死空间」。`aria-pressed` 只在传了 `active` 时才发出，所以一个用来跳转的 chip 不会把自己播报成「未按下」。',
  [fingerprint(
    'A `Markdown` link that leaves for another site now carries `rel="noreferrer nofollow"`. Refusing `javascript:` stops the href EXECUTING; it does nothing about an untrusted author spending the page\'s ranking or reading its URL out of the `Referer`, and untrusted content is the input this component exists for. Relative, `mailto:` and `tel:` hrefs cannot leave the origin and are untouched. New opt-in `markExternalLinks` adds the system\'s outbound arrow to the same links; it is off by default because the mark is an addition to a sentence the component did not write, and because "another site" can only mean "carries an http(s) scheme" from in here.',
  )]: '一条从 `Markdown` 里离开、去往另一个站点的链接，现在带上 `rel="noreferrer nofollow"`。拒掉 `javascript:` 挡住的是这个 href **被执行**；它对「一个不可信的作者花掉这个页面的权重、或者从 `Referer` 里读走它的 URL」毫无办法，而不可信的内容正是这个组件存在的理由。相对路径、`mailto:` 和 `tel:` 的 href 离不开当前源，因此原样不动。新增的 `markExternalLinks` 需要主动打开，它会给同样这批链接加上这套系统的外链箭头；默认关闭，因为这个记号是往一句不是组件写的句子里加东西，也因为站在这里面，「另一个站点」只可能是「带 http(s) scheme」的意思。',
  [fingerprint(
    'Documentation caught up with three things that were already true: `Markdown` brings type and colour but no vertical rhythm, so anything longer than a sentence wants `<Article as="div">` around it; a fenced code block renders `CodeBlock`, which is a client component; and `article.css`\'s header comment said a utility beats the article\'s rules, which is backwards — the file is imported unlayered while Tailwind\'s utilities are in `@layer utilities`, and that is precisely what lets a `Markdown` paragraph\'s `m-0` give way to the article rhythm.',
  )]: '文档追上了三件本来就已经成立的事：`Markdown` 带来字体和颜色，却不带垂直节奏，所以任何比一句话更长的东西，外面都想要一层 `<Article as="div">`；一个围栏代码块渲染的是 `CodeBlock`，而它是一个客户端组件；还有 `article.css` 的头部注释说一个工具类压得过文章自己的规则，这是反的——这个文件是不带层导入的，而 Tailwind 的工具类在 `@layer utilities` 里，恰恰是这一点让一个 `Markdown` 段落上的 `m-0` 把位置让给文章的节奏。',
  [fingerprint(
    '`{@link}` survives extraction, and the article cascade is documented the way it actually runs.',
  )]: '`{@link}` 挺过了抽取，而文章的层叠也按它实际运行的样子写进了文档。',
  [fingerprint(
    'Three corrections to what the package publishes about itself. None of them changes a rendered pixel; all three change what a reader — or an agent reading `dist/agent/` — is told.',
  )]: '对这个包关于它自己所发布的内容作三处更正。三处都不改变渲染出来的任何一个像素；三处都改变了一个读者——或者一个正在读 `dist/agent/` 的 agent——被告知的东西。',
  [fingerprint(
    '**`{@link}` was being deleted.** The props extractor joined a JSDoc comment\'s parts on their `text`, and a `{@link Name}` node\'s own `text` is empty: the identifier lives on its `name`. So `See {@link TableBorders}.` shipped as `See .` — nine descriptions across seven components, each one a sentence pointing at something that had been removed on the way out. A link now renders as its bare identifier, which is what a reader greps for and what the row beside it already prints as the prop\'s type.',
  )]: '**`{@link}` 一直在被删掉。** props 抽取器是按 `text` 把一条 JSDoc 注释的各个部分拼起来的，而一个 `{@link Name}` 节点自己的 `text` 是空的：标识符挂在它的 `name` 上。于是 `See {@link TableBorders}.` 发出去成了 `See .`——七个组件里的九处描述，每一处都是一句指向某个东西的话，而那个东西在出门的路上被删掉了。现在一个链接渲染成它光秃秃的标识符，那正是读者会去 grep 的东西，也正是它旁边那一行早已作为这个 prop 的类型印出来的东西。',
  [fingerprint(
    '**The article cascade was documented backwards.** `Article`\'s note, and the `Article` catalog entry beside it, said a component\'s own utility outranks the article\'s element selectors. It is the other way round: `article.css` is imported unlayered while Tailwind\'s utilities sit in `@layer utilities`, and an unlayered rule beats a layered one whatever either one\'s specificity is. That is not a footnote — it is the mechanism the whole composition rests on, the reason a `Markdown` paragraph carrying `m-0` gives its margin up to the article\'s rhythm. A caller who believed the old version would reach for a class to hold a property inside an article and watch it lose; the honest answer is an inline style, or a tag the stylesheet does not reach.',
  )]: '**文章的层叠在文档里被写反了。** `Article` 的说明，以及紧挨着它的那条 `Article` catalog 条目，都说一个组件自己的工具类压得过文章的元素选择器。实际正好相反：`article.css` 是不带层导入的，而 Tailwind 的工具类坐在 `@layer utilities` 里，一条不带层的规则压得过一条带层的，不管两边各自的具体度是多少。这不是一条脚注——这是整套组合赖以成立的机制，也是一个带着 `m-0` 的 `Markdown` 段落把自己的外边距让给文章节奏的原因。一个相信旧版本说法的调用方，会伸手去拿一个 class，指望它在文章里守住某个属性，然后眼看着它输掉；诚实的答案是一个内联样式，或者一个样式表够不到的标签。',
  [fingerprint(
    '**`CodeBlock` documented a trade without its consequence.** Line numbers live inside each line\'s row so a number cannot come apart from the line it numbers. The cost went unsaid: the number is inside the scrolling box, so on a wide snippet it scrolls away with the code rather than staying in a gutter. A gutter that stayed put would be the second column this deliberately avoids — worth knowing before someone reports it as a bug.',
  )]: '**`CodeBlock` 写下了一个取舍，却没写它的代价。** 行号住在每一行自己的那一行里，这样一个号码就不会和它所标的那一行分家。没说出来的代价是：号码在滚动框里面，所以遇到一段很宽的代码，它会跟着代码一起滚走，而不是停在一条边槽里。一条停着不动的边槽，正是这里刻意避开的那第二列——在有人把它当 bug 报上来之前，这件事值得先知道。',
  [fingerprint(
    'Sixteen charts that drew a readable, plausible, wrong picture.',
  )]: '十六张图表，画出来的画面好读、可信，而且是错的。',
  [fingerprint(
    'None of these threw, none looked broken, and none could be caught by rendering the chart and looking at it — the plot was always confident. What they had in common is that the picture disagreed with the rows behind it, and the reader had no way to tell.',
  )]: '这些没有一个抛错，没有一个看起来是坏的，也没有一个能靠把图渲染出来看一眼就抓到——绘图区永远画得很笃定。它们的共同点是：画面和它背后那些行对不上，而读者没有任何办法看出来。',
  [fingerprint(
    '**`BarChart`\'s `buffer` hatched the last VISIBLE bar, not the last row.** `dataLength` came from the brushed window, so brushing back into the middle of a range drew a month that closed in March as still being counted. It now resolves the last row\'s position in the window, and hatches nothing when that row is off the end of it.',
  )]: '**`BarChart` 的 `buffer` 给最后一根看得见的柱子打了斜纹，而不是最后一行。** `dataLength` 取自刷选出来的窗口，所以往回刷到一段区间中间时，一个三月就已经结清的月份被画成了还在统计中。它现在会解析出最后一行在这个窗口里的位置，而当那一行落在窗口尽头之外时，什么斜纹也不打。',
  [fingerprint(
    '**`BarChart` painted `Math.max(0, height - 3)`.** Anything under three pixels rendered at zero height, so a count of two on a scale topping out at a thousand was pixel-identical to a category with no rows — while the invisible full-column hit rect still caught the pointer, giving the reader a bar to hover that was not there. A bar with a value on it is now floored at one pixel.',
  )]: '**`BarChart` 画的是 `Math.max(0, height - 3)`。** 任何不足三像素的东西都以零高度渲染，于是在一个顶到一千的刻度上，计数为二和一个一行都没有的类别在像素上一模一样——与此同时，那块看不见的整列命中矩形照样接住指针，等于给了读者一根根本不存在的柱子去悬停。现在只要柱子身上有值，就至少保底一像素。',
  [fingerprint(
    '**`TreemapChart` emitted `<desc>{chartId}</desc>` inside every tile.** The comment called it a hidden id; `<desc>` IS the accessible description, so every tile was announced as its name followed by an opaque generated string. Removed, along with the id it needed.',
  )]: '**`TreemapChart` 在每一块瓦片里都吐出了 `<desc>{chartId}</desc>`。** 注释管它叫一个隐藏的 id；可 `<desc>` **就是**那条无障碍描述，于是每一块瓦片被念出来都是它的名字，后面拖着一串不知所云的生成字符串。已经删掉，连同它所需要的那个 id 一起。',
  [fingerprint(
    '**`TreemapChart` dropped a leaf with no area and said nothing.** A tile at zero or below is laid out at zero width and never drawn, so the picture and the hidden leaf table disagreed about how many leaves there were. The table now prints such a leaf as "not drawn".',
  )]: '**`TreemapChart` 丢掉了一个没有面积的叶子，还什么都没说。** 一块值为零或更低的瓦片会以零宽度布局、根本不会被画出来，于是画面和那张隐藏的叶子表格，对「到底有多少个叶子」这件事各说各的。表格现在会把这样的叶子印成「not drawn」。',
  [fingerprint(
    '**`RadialChart.onSelectionChange` reported `value: 0` from the legend.** The arc handed its own number in; the legend had only a name, and `value ?? 0` invented one — so the same selection reported two different values depending on which control the reader used. The value now comes from the row, through `valueKey` or, failing that, the `dataKey` of the composed `<RadialChart.RadialBar>` — which also gives a chart that named neither a hidden table, where it previously had none at all.',
  )]: '**`RadialChart.onSelectionChange` 从图例报出来的是 `value: 0`。** 弧本身会把自己的数字递进去；图例手上只有一个名字，而 `value ?? 0` 就地编了一个——于是同一次选择，读者用哪个控件操作，报出来的值就不一样。这个值现在来自数据行，先走 `valueKey`，取不到就走组合进去的 `<RadialChart.RadialBar>` 的 `dataKey`——顺带也让一张两个都没命名的图表有了一张隐藏表格，而在此之前它压根一张都没有。',
  [fingerprint(
    '**`AreaChart` silently ignored a `tickFormatter` under `stackType="expanded"`.** The axis wrote `isExpanded ? percentTick : (tickFormatter ?? defaultTick)`, so a formatter handed to the YAxis was indistinguishable from a typo. A caller\'s formatter now wins; the percentage default applies when there is none.',
  )]: '**在 `stackType="expanded"` 下，`AreaChart` 会无声地忽略掉 `tickFormatter`。** 坐标轴写的是 `isExpanded ? percentTick : (tickFormatter ?? defaultTick)`，于是递给 YAxis 的格式化函数，和一个拼错的字看不出区别。现在调用方的格式化函数说了算；没有传的时候，才轮到百分比这个默认值。',
  [fingerprint(
    '**`Histogram` discarded observations outside explicit `bins` edges.** The tooltip\'s share-of-total was taken over the bins, so it always summed to 100% however much of the sample the edges cut off — the one number that would have revealed the tail was the one that hid it. Out-of-range observations now count toward the share and get their own "Below" and "Above" rows in the table.',
  )]: '**`Histogram` 把落在显式 `bins` 边界之外的观测值丢掉了。** tooltip 里那个占比是在这些分箱上算的，所以不管边界切掉了样本的多少，它永远加总到 100%——本该揭出这条尾巴的那个数字，恰恰就是把它藏起来的那个。落在范围外的观测值现在会计入占比，并在表格里得到属于自己的「Below」和「Above」两行。',
  [fingerprint(
    '**`BigNumber` announced a verdict on a change of zero.** The tone, the arrow and the word all said "no change" while the sr-only text still took the intent\'s side, so `{ value: 0, intent: \'up-is-good\' }` was read out as "no change, worse". There is no direction for an intent to judge, so the verdict is now dropped with it. `value` also gains an empty state — `null` prints an em dash with "No data" behind it rather than leaving a label over a blank line.',
  )]: '**变化量为零时，`BigNumber` 还是给出了一个判决。** 色调、箭头和文字都在说「no change」，而 sr-only 的文本却仍然站在 intent 那一边，于是 `{ value: 0, intent: \'up-is-good\' }` 被念成了「no change, worse」。既然没有方向可供一个 intent 去评判，那这个判决就跟着一起去掉。`value` 还多了一个空状态——`null` 会印一个破折号，后面跟着「No data」，而不是把一个标签晾在一行空白上面。',
  [fingerprint(
    '**`Sparkline` drew an unchanged run along the floor.** `span = max - min || 1` normalised every point of a constant series to the BOTTOM edge, so "unchanged" and "pinned at its worst" were the same picture — in a column of sparklines, the one distinction that matters. `Heatmap` answered a zero span with the middle and `BulletChart` with the start; all three now agree on the middle, through one shared `fraction`.',
  )]: '**`Sparkline` 把一段没有变化的序列画在了地板上。** `span = max - min || 1` 会把一条恒定序列的每一个点都归一到**最底**那条边，于是「没有变化」和「一直钉在最差」是同一张画面——而在一列迷你图里，这恰恰是唯一要紧的那个区分。`Heatmap` 对零跨度的回答是中间，`BulletChart` 的回答是起点；现在三者都统一到中间，走同一个共享的 `fraction`。',
  [fingerprint(
    '**`Heatmap` stretched its domain with a number it never drew.** Values were collected from every cell, but the grid renders by row-and-column lookup — so one misspelt header inflated the derived domain invisibly and pushed every drawn cell into the first fraction of the ramp. The domain now comes from the cells the grid can place.',
  )]: '**`Heatmap` 用一个它根本没画出来的数字撑大了自己的值域。** 数值是从每一个单元格里收上来的，可网格渲染走的是按行列查表——于是一个拼错的表头就在看不见的地方把推导出来的值域撑大了，把所有画出来的单元格全挤进色阶开头那一小截里。值域现在只取自网格放得下的那些单元格。',
  [fingerprint(
    '**`BulletChart` clamped without saying so.** A value past the domain filled the track exactly as the domain\'s top did; a notch at the end of the track now says it happened. Range bounds outside the domain were also filtered before the band label was built, so `[60, 80]` on `[0, 50]` produced one flat band AND lost the bounds from the table — the label now names what the caller set.',
  )]: '**`BulletChart` 做了截断，却没说。** 一个越过值域的值，把轨道填满的样子和值域上限一模一样；现在轨道末端会有一个缺口，把这件事说出来。落在值域之外的区间边界，还会在区间标签生成之前就被滤掉，于是 `[0, 50]` 上的 `[60, 80]` 既产出一条平掉的带子，**又**把这两个边界从表格里弄丢了——标签现在会把调用方设的值原样说出来。',
  [fingerprint(
    '**Seven charts had no empty state at all.** `PieChart`, `RadarChart`, `RadialChart`, `SankeyChart`, `ScatterChart`, `FunnelChart` and `TreemapChart` drew a named figure over a blank box at zero rows, and `ChartDataTable` renders nothing below one row — so the picture and its text equivalent went silent together and "no data" looked exactly like "failed to load". `BarList`, `BigNumber` and `Heatmap` were in the same position. The state now lives in `ChartFigure`, which every chart root already wraps itself in, and every chart in the package routes through it.',
  )]: '**七张图表压根没有空状态。** `PieChart`、`RadarChart`、`RadialChart`、`SankeyChart`、`ScatterChart`、`FunnelChart` 和 `TreemapChart` 在零行的时候，会在一个空盒子上画一个有名字的图形，而 `ChartDataTable` 在不足一行时什么也不渲染——于是画面和它的文字等价物一起哑了，「没有数据」看起来和「加载失败」一模一样。`BarList`、`BigNumber` 和 `Heatmap` 处境相同。这个状态现在住在 `ChartFigure` 里——每张图表的根本来就把自己裹在它里面——而这个包里的每一张图表都从它走。',
  [fingerprint(
    '**`ScatterChart`\'s `isLoading` was hard-coded `false`.** It is now a prop, with the same badge every other chart shows.',
  )]: '**`ScatterChart` 的 `isLoading` 是写死的 `false`。** 它现在是一个 prop，带着和其他每一张图表一样的那个角标。',
  [fingerprint(
    '**`defaultSelectedDataKey` and its siblings seeded `useState` once.** Nine charts had a default and no controlled counterpart, so a call site that wanted a chart\'s selection to follow a filter, a route or a sibling chart had no way to say so — the prop that looks like the way to do it silently was not. Each now takes `selectedDataKey` / `selectedSector` / `selectedBar` / `selectedNode` beside its default, through one shared hook.',
  )]: '**`defaultSelectedDataKey` 和它的兄弟们只给 `useState` 播一次种。** 九张图表有默认值却没有对应的受控形式，于是一个想让图表的选中项跟着筛选器、路由或者旁边一张图表走的调用点，根本没办法把这件事说出来——那个看起来就是干这事的 prop，无声地并不是。现在每一个都在自己的默认值旁边接受 `selectedDataKey` / `selectedSector` / `selectedBar` / `selectedNode`，走同一个共享 hook。',
  [fingerprint(
    '**`FunnelChart` emitted an unreferenced `<defs>` block.** The root generated stage gradients under its own `useId` while `<Funnel>` generated and painted from its own — one gradient definition per stage, per chart, drawn and never used.',
  )]: '**`FunnelChart` 吐出了一整块没人引用的 `<defs>`。** 根节点用自己的 `useId` 生成各阶段的渐变，而 `<Funnel>` 用它自己的那一个生成并上色——每张图表、每个阶段一条渐变定义，画出来了，从没被用过。',
  [fingerprint(
    'The three gaps that were "chart N forgot what charts 1 to N-1 do" are now gates rather than review items: the shared chart fixture requires an empty render per chart, and the suite walks every chart for its empty state and for the keyboard cursor over its plot. Recharts 3.8 has no `accessibilityLayer` for `Sankey` or `Treemap`, which is recorded as the exception it is rather than left looking like an oversight.',
  )]: '那三处「第 N 张图表忘了第 1 到 N-1 张图表都在做什么」的缺口，现在是关卡而不是评审意见了：共享的图表 fixture 要求每张图表都给出一次空渲染，而这套测试会挨个走遍每张图表，检查它的空状态，以及绘图区上的键盘游标。Recharts 3.8 没有为 `Sankey` 和 `Treemap` 提供 `accessibilityLayer`，这一点被当作它本来的样子——一个例外——记录下来，而不是留在那里像个疏漏。',
  [fingerprint(
    'Nine places where what was drawn and what was announced were two different things.',
  )]: '九处「画出来的」和「念出来的」是两回事的地方。',
  [fingerprint(
    '**Two overlays stayed reachable after they visually closed.**',
  )]: '**两个浮层在视觉上关掉之后，仍然够得到。**',
  [fingerprint(
    '**`AppShell`\'s closed drawer was still in the tab order on a phone.** It was translated off-screen and nothing else — no `inert`, no unmount — so every link in it stayed focusable and stayed in the accessibility tree, and Tab from the toggle walked into a menu nobody could see. Below `md` the closed drawer is `inert` now, decided by a media query rather than by `open` alone, because above the breakpoint that element is the application\'s navigation column and hiding it would be the larger bug. Closing it — by Escape or by the scrim — returns focus to the toggle: focus inside an inert subtree is focus the browser throws away, and the scrim is worse, since it is itself the focused element and it unmounts. The drawer also carries `data-m22-animated` now, so the reduced-motion rule reaches its `transition-transform`.',
  )]: '**在手机上，`AppShell` 关掉的抽屉仍然在 tab 顺序里。** 它只是被平移到了屏幕外，此外什么也没做——没有 `inert`，也没有卸载——于是里面每一个链接都还能聚焦、都还在无障碍树上，从开关按钮 Tab 过去，就走进了一个谁也看不见的菜单。`md` 以下，关掉的抽屉现在是 `inert` 的，这由一条媒体查询来判定，而不是单看 `open`，因为在断点以上，那个元素就是这个应用的导航栏，把它藏起来才是更大的 bug。关掉它——按 Escape 或者点遮罩——会把焦点还给开关按钮：落在一棵 inert 子树里的焦点，是浏览器直接扔掉的焦点，而遮罩更糟，因为它自己就是那个被聚焦的元素，而它会被卸载。抽屉现在还带上了 `data-m22-animated`，这样减少动效的规则才够得到它的 `transition-transform`。',
  [fingerprint(
    '**`Calendar`\'s month picker could be left open over focusable content.** The panel is opaque and drawn in place of the day grid, but the grid stayed mounted and focusable underneath it, so Tab from the last month walked onto a day the reader could not see — and past the caption that owns the Escape handler, so the panel could no longer be dismissed either. Tab wraps inside the panel now, and the role follows the behaviour rather than the other way round: it was `group` for exactly as long as Tab walked out of it, and it is `dialog` now that focus stays. No `aria-modal` — the panel covers this month\'s grid, not the page.',
  )]: '**`Calendar` 的月份选择面板可能被留在可聚焦内容之上开着。** 这块面板是不透明的，画在日期网格的位置上，可网格仍然挂载在它下面、仍然可以聚焦，于是从最后一个月份 Tab 过去，就走到了一个读者看不见的日子上——而且越过了持有 Escape 处理函数的那行标题，于是这块面板连关都关不掉了。现在 Tab 在面板内部回绕，而角色跟着行为走，不是反过来：只要 Tab 还会走出去，它就一直是 `group`；如今焦点留得住了，它就是 `dialog`。没有 `aria-modal`——这块面板盖住的是本月的网格，不是整个页面。',
  [fingerprint(
    '**Toast descriptions were unreadable in dark mode.** The `Toaster` never passed `theme`, so sonner defaulted to `light` and stamped `data-sonner-theme="light"`. Its stylesheet hard-codes the description at `#3f3f3f` and overrides that only under its own dark theme, and the inline token style could not reach it — so on `--paper: #0d0d0d` every `toast(title, { description })` put dark grey on near black, roughly 1.85:1, and lost its second half. `theme` now follows the `data-mode` attribute on `<html>`, observed rather than read once, so it also follows a reader who switches with the Toaster already mounted. Deliberately not sonner\'s own `theme="system"`: that reads `prefers-color-scheme`, and this system lets a reader override the operating system — a toast following the OS while the page follows the override is the same defect pointing the other way. Pass `theme` yourself and it still wins. The `--success-*` and `--error-*` custom properties are now emitted only under `richColors`, which is the only state sonner reads them in; at the default they were six inert declarations sitting in the element\'s style attribute looking like the source of a success toast\'s colour.',
  )]: '**深色模式下，toast 的描述文字读不出来。** `Toaster` 从来没有传过 `theme`，于是 sonner 默认成 `light`，盖上了 `data-sonner-theme="light"`。它的样式表把描述文字硬编码成 `#3f3f3f`，而且只在它自己的深色主题下才覆盖这一条，内联的 token 样式又够不到它——于是在 `--paper: #0d0d0d` 上，每一次 `toast(title, { description })` 都是深灰压近黑，对比度大约 1.85:1，等于把后半句弄丢了。`theme` 现在跟着 `<html>` 上的 `data-mode` 属性走，是持续观察而不是只读一次，所以读者在 Toaster 已经挂载之后再切换，它也跟得上。刻意不用 sonner 自己的 `theme="system"`：那读的是 `prefers-color-scheme`，而这套系统允许读者去覆盖操作系统的设置——toast 跟着操作系统、页面跟着覆盖值，这是同一个缺陷换个方向再犯一遍。你自己传 `theme`，仍然是你说了算。`--success-*` 和 `--error-*` 这两组自定义属性，现在只在 `richColors` 下才发出，因为那是 sonner 唯一会去读它们的状态；在默认状态下，它们就是六条毫无作用的声明，杵在元素的 style 属性里，看起来像是一条成功 toast 颜色的来源。',
  [fingerprint(
    '**Four things in the loading family accepted an instruction and did nothing with it.**',
  )]: '**加载这一族里有四样东西，收下了指令，却什么也没照做。**',
  [fingerprint(
    '**`Progress` showed a reader who asked for less motion a finished bar.** The indeterminate sweep carried `motion-reduce:w-full motion-reduce:opacity-40`, so under `prefers-reduced-motion` an operation still running was drawn as a full-width bar at rest — which is what a completed one looks like. It now stops where it is drawn, a quarter of the track at the inline start, the same answer `Spinner` gives: a partial shape still reads as unfinished.',
  )]: '**对一个要求减少动效的读者，`Progress` 给的是一根已经跑完的进度条。** 那道不确定态的扫光带着 `motion-reduce:w-full motion-reduce:opacity-40`，于是在 `prefers-reduced-motion` 下，一个还在进行的操作被画成了一根静止的满宽条——而那正是跑完的样子。它现在就停在它被画出来的地方，占轨道起始侧的四分之一，和 `Spinner` 给的是同一个答案：一个不完整的形状，读起来仍然是「还没完」。',
  [fingerprint(
    '**`Progress` accepted `max` and disagreed with it.** `max` reached Radix through `...rest` and was announced as `aria-valuemax`, while the width was `value` clamped to 100 — so `max={500}` with `value={100}` painted a full bar and told a screen reader "100 of 500". The width is computed from `max` now, and `max` is a documented prop rather than an inherited one. A `max` that is not a positive number falls back to 100 exactly as Radix does, so the picture and the announcement cannot come apart.',
  )]: '**`Progress` 收下了 `max`，然后跟它对着干。** `max` 经由 `...rest` 抵达 Radix，被念作 `aria-valuemax`，而宽度却是把 `value` 截到 100 得来的——于是 `max={500}` 配 `value={100}` 画出一根满条，同时告诉读屏软件「100 of 500」。宽度现在从 `max` 算出来，而 `max` 是一个写进文档的 prop，不再是继承来的。一个不是正数的 `max` 会像 Radix 那样退回 100，这样画面和播报就不可能再分家。',
  [fingerprint(
    '**`Spinner`\'s `className` missed the ring.** It merged onto the outer `inline-flex` wrapper while `size` and `tone` went on the inner span, so `<Spinner className="size-8" />` grew an invisible box around an unchanged 18px circle. `className` reaches the ring now, after `size` and `tone` and overriding both.',
  )]: '**`Spinner` 的 `className` 没落到那个圆环上。** 它合并到了外层的 `inline-flex` 包装上，而 `size` 和 `tone` 去了内层的 span，于是 `<Spinner className="size-8" />` 只是在一个纹丝不动的 18px 圆圈外面撑出一个看不见的盒子。`className` 现在够得到那个圆环，排在 `size` 和 `tone` 之后，并且把两者都覆盖掉。',
  [fingerprint(
    '**A bare `<Skeleton />` rendered nothing.** It set a fill colour and no dimensions, and a `div` is already full width, so the one thing it could not supply for itself was the one thing missing: it was a zero-height box. The base falls back to `h-3`, the height `SkeletonLine` already chose, and any class the caller passes replaces it.',
  )]: '**一个光秃秃的 `<Skeleton />` 什么也渲染不出来。** 它只设了填充色、没设尺寸，而 `div` 本来就是满宽的，于是唯一一件它没法自己补上的事，恰恰就是缺的那一件：它是一个零高度的盒子。基础样式现在退回 `h-3`，也就是 `SkeletonLine` 早就选定的那个高度，而调用方传的任何 class 都会把它替掉。',
  [fingerprint(
    '**`Article` discarded `children` when `html` was also passed** and said nothing about it, and `html=""` counted as present — so a pipeline that rendered an empty string took a page of hand-written children down with it. It says so in development now (`ARTICLE_HTML_AND_CHILDREN`), with the field and an imperative fix, like the other warnings. The behaviour is unchanged: `html` still wins, because there is no wrapper that could hold both without costing every block inside it its spacing.',
  )]: '**同时传了 `html` 时，`Article` 会把 `children` 丢掉**，而且一声不吭，并且 `html=""` 也算传了——于是一条渲染出空字符串的流水线，会连带把一整页手写的 children 一起拖下水。它现在会在开发期把这件事说出来（`ARTICLE_HTML_AND_CHILDREN`），带上出问题的字段和一句祈使语气的修法，和其他那些警告一样。行为没有变：`html` 仍然赢，因为不存在一种既能同时装下两者、又不让里面每一个块丢掉自己间距的包装。',
  [fingerprint(
    '**Accessible names that could only be English are now props.** `Pagination` named its controls `"Page 3"`, `"Previous page"` and `"Next page"` with only the nav\'s own `label` exposed; `Calendar` did the same for `"Earlier years"`, `"Later years"`, `"Previous year"`, `"Next year"` and its two panel names — while its month names already followed `locale`, which is what made the chrome around them read as an oversight rather than a policy. `AppShell` and `Breadcrumb` have always exposed every string, so the package was inconsistent with itself. `Pagination` gains `previousLabel`, `nextLabel` and `pageLabel`; `Calendar` gains the six `CalendarLabels` props. `pageLabel` is a function rather than a template because "Page 3" is a phrase whose parts move around between languages. Every default is the English that was there before.',
  )]: '**那些只可能是英文的无障碍名字，现在是 prop 了。** `Pagination` 把自己的控件命名为 `"Page 3"`、`"Previous page"` 和 `"Next page"`，对外只露出这个 nav 自己的 `label`；`Calendar` 对 `"Earlier years"`、`"Later years"`、`"Previous year"`、`"Next year"` 以及它那两块面板的名字，做的是同一件事——而它的月份名早就跟着 `locale` 走了，正是这一点让它们周围的这圈外壳读起来像个疏漏，而不像一条方针。`AppShell` 和 `Breadcrumb` 一直都把每一个字符串露出来，所以这个包是在跟自己不一致。`Pagination` 多了 `previousLabel`、`nextLabel` 和 `pageLabel`；`Calendar` 多了那六个 `CalendarLabels` prop。`pageLabel` 是一个函数而不是一个模板，因为「Page 3」是一句各部分会随语言挪来挪去的短语。每一个默认值都是原本就在那里的英文。',
  [fingerprint(
    'Twelve fields in `@misoto22/design/diagrams` that typechecked and drew something else — and the half of every figure a screen reader was never given.',
  )]: '`@misoto22/design/diagrams` 里有十二个字段，类型检查通得过，画出来的却是另一回事——外加每一张图里，读屏软件从来没拿到过的那一半。',
  [fingerprint(
    'Each of these renders without an error, a warning or a missing box. The specification is valid, the picture is not the one it describes, and the only way to find out was to look at the drawing already knowing what it should have been. Every one now does what its type implies, or says so by name in development. None of the warnings reaches a production bundle.',
  )]: '这里每一个都能渲染出来，没有报错、没有警告、也没有缺失的框。规格是合法的，画面却不是它所描述的那一张，而唯一能发现这件事的办法，是在你已经知道它本该长什么样的前提下去看那张图。现在每一个要么按它的类型所暗示的那样做，要么在开发期指名道姓地把问题说出来。这些警告一个也不会进到生产包里。',
  [fingerprint(
    '**Placement that quietly disagreed with the specification.**',
  )]: '**悄悄和规格对着干的摆放。**',
  [fingerprint(
    '**An `ArchitectureFigure` component that declared neither `row` nor `col` was drawn at row 0, column 0** — along with every other component that declared neither, which is one plate with the rest underneath it. They now flow into the next free cell in declaration order, wrapping at `layout.cols`, stepping around whatever the placed ones claimed. `layout.cols` had been accepted and read by nothing.',
  )]: '**一个既没声明 `row` 也没声明 `col` 的 `ArchitectureFigure` 组件，会被画在第 0 行第 0 列**——和其他每一个两者都没声明的组件一起，也就是一块底板，剩下的全压在它下面。它们现在按声明顺序流进下一个空闲单元格，到 `layout.cols` 换行，绕开已摆放的那些所占的位置。`layout.cols` 一直被收下，却没有任何地方读它。',
  [fingerprint(
    '**`layout.cellW` moved plates without widening them.** The pitch came from the layout and the plate\'s own width from the module default, so `cellW: 240` was a grid with wider gaps rather than wider boxes.',
  )]: '**`layout.cellW` 把底板挪了位置，却没有把它们加宽。** 步距取自 layout，而底板自己的宽度取自模块默认值，于是 `cellW: 240` 得到的是一张缝更宽的网格，而不是更宽的盒子。',
  [fingerprint(
    '**Two components on one cell** are still one plate over another — there is no second place to put the second plate — but development now prints `DIAGRAM_CELL_COLLISION` naming both.',
  )]: '**两个组件落在同一个单元格上**，仍然是一块底板压着另一块——没有第二个地方可以放第二块底板——但开发期现在会打印 `DIAGRAM_CELL_COLLISION`，把两个都点名。',
  [fingerprint(
    '**A spec object mutated in place drew the picture it was first given.** The model is memoised on the spec\'s identity, and a `push` does not change it. All five figures now print `DIAGRAM_SPEC_MUTATED` when they catch that.',
  )]: '**一个被就地改动的 spec 对象，画出来的还是它最初拿到的那张图。** 模型是按 spec 的标识做记忆化的，而一次 `push` 改不了这个标识。五张图现在只要逮到这种情况，都会打印 `DIAGRAM_SPEC_MUTATED`。',
  [fingerprint(
    '**An unknown `lane` id resolved to lane 0** in `WorkflowFigure` and `LifecycleFigure`, drawing the step in the right column and the wrong band. It still does — there is nowhere else to put the box — but it prints `DIAGRAM_LANE_UNKNOWN`, and in a lifecycle it no longer enrols the state in the implicit main rail: a typo could previously add an arrow the machine does not have.',
  )]: '**一个不认识的 `lane` id 会解析到 lane 0**，在 `WorkflowFigure` 和 `LifecycleFigure` 里把这一步画在对的列、错的带上。它现在还是这么做——这个框没有别的地方可去——但它会打印 `DIAGRAM_LANE_UNKNOWN`，而且在生命周期图里，它不再把这个状态编入那条隐式的主轨：以前一个拼写错误就能凭空加出一条这台状态机根本没有的箭头。',
  [fingerprint(
    '**A `DataflowFigure` node past the declared `stages`** is drawn past the last heading, under no heading at all. Now `DIAGRAM_STAGE_OUT_OF_RANGE`, and the text equivalent files it under a band named for what it is.',
  )]: '**一个越过所声明 `stages` 的 `DataflowFigure` 节点**，会被画在最后一个标题之后，压根不在任何标题底下。现在是 `DIAGRAM_STAGE_OUT_OF_RANGE`，而文字等价物会把它归到一条按它本来面目命名的带子里。',
  [fingerprint(
    '**`LifecycleFigure.yOffset` was accepted and deliberately dropped**, while `WorkflowFigure` and `DataflowFigure` both applied theirs — one field name, two behaviours, nothing in the type to say which. It is applied.',
  )]: '**`LifecycleFigure.yOffset` 被收下，然后被刻意丢掉**，而 `WorkflowFigure` 和 `DataflowFigure` 都会把自己的那个用上——同一个字段名，两种行为，类型上没有任何东西告诉你是哪一种。现在它会被用上。',
  [fingerprint(
    '**A `SequenceFigure` message naming an undeclared participant** vanished from the picture and survived in the hidden summary as a raw id: the two halves of one figure disagreeing about what the exchange contains. Dangling edges are now dropped from both halves in every figure, and reported once as `DIAGRAM_EDGE_DANGLING`.',
  )]: '**一条指向未声明参与者的 `SequenceFigure` 消息**，会从画面里消失，却以一个裸 id 的形式活在隐藏摘要里：同一张图的两半，在「这场交互到底包含什么」上各说各的。悬空的边现在会从每一张图的两半里一起去掉，并作为 `DIAGRAM_EDGE_DANGLING` 报告一次。',
  [fingerprint(
    '**The text equivalent carried half the diagram.** Each figure publishes a `role="img"` picture beside a hidden list, and that list held nodes and edges only — so a workflow\'s lane axis and a data flow\'s stage axis, the second dimension of both diagrams, reached a screen reader not at all. The list is now grouped by that axis, which makes it structural rather than a phrase repeated on every row, and the statements that group nothing follow as sentences: an architecture boundary and what it encloses, a workflow phase and the columns it covers, a sequence segment and the messages inside it, an activation bar named by the calls it spans. A lifecycle state\'s step number joins its line, and the implicit rail — two of the three arrows in a three-state machine — is published for the first time. Selecting a node from the list is unchanged: exactly one control per node, wherever it is grouped.',
  )]: '**文字等价物只承载了图的一半。** 每张图都会在一个 `role="img"` 的画面旁边发布一份隐藏列表，而那份列表里只有节点和边——于是一个工作流的泳道轴、一张数据流的阶段轴，也就是这两种图的第二个维度，压根没有抵达读屏软件。这份列表现在按那条轴分组，于是它变成结构，而不是在每一行上重复一遍的一句话；那些分不了组的陈述则以句子的形式跟在后面：一条架构边界和它圈住的东西、一个工作流阶段和它覆盖的列、一段时序区段和它内部的消息、一根按它所跨越的调用命名的激活条。生命周期状态的步骤序号并进了它那一行，而那条隐式的主轨——一台三状态机的三条箭头里的两条——第一次被发布出来。从列表里选中一个节点这件事没有变：每个节点正好一个控件，不管它被分到哪一组。',
  [fingerprint(
    '**Fields that typechecked and did nothing.**',
  )]: '**类型检查通得过、却什么也不做的字段。**',
  [fingerprint(
    '**`WorkflowPhase.toCol` and `.variant` are drawn.** A phase\'s rule runs across the columns it claims instead of across the whole figure, so its extent is something a reader can see; `security` dashes that rule and `emphasis` thickens it.',
  )]: '**`WorkflowPhase.toCol` 和 `.variant` 现在会画出来。** 一个阶段的横线只跨过它所声明的那些列，而不是横贯整张图，于是它的范围是读者看得见的东西；`security` 把这条线变成虚线，`emphasis` 把它加粗。',
  [fingerprint(
    '**`WorkflowEdge.role` reaches the line.** `async` and `error` take the quiet dashed stroke the docstring had been promising for `error`; `return` keeps its open arrowhead; `main` and `branch` add nothing, because `mainPath` already draws that distinction as weight. An explicit `variant` still wins.',
  )]: '**`WorkflowEdge.role` 现在够得到那条线。** `async` 和 `error` 用上了文档字符串一直在为 `error` 许诺的那种低调虚线；`return` 保留它的开口箭头；`main` 和 `branch` 什么也不加，因为 `mainPath` 早就用线宽把这个区分画出来了。显式的 `variant` 仍然说了算。',
  [fingerprint(
    '**`meta.views` and the three label nudges are documented as the no-ops they are**, the way `meta.viewBox` already was, and `column_fit: \'spread\'` now describes what it does — the widest label sets the pitch for every column — rather than dividing the figure evenly, which it never did.',
  )]: '**`meta.views` 和那三个标签微调，现在按它们本来的样子——空操作——写进了文档**，就像 `meta.viewBox` 早就那样写了一样；而 `column_fit: \'spread\'` 现在描述的是它真正做的事——最宽的那个标签决定所有列的步距——而不是把整张图均分，那件事它从来没做过。',
  [fingerprint(
    '**The chrome.**',
  )]: '**外围那圈界面。**',
  [fingerprint(
    '**`DiagramExportMenu` reported a success it could not have known about.** With `onExport`, a handler that did nothing resolved exactly like one that wrote a file. `ExportResult` now carries `source`, and `ok` says only that the pipeline named by it finished.',
  )]: '**`DiagramExportMenu` 报了一次它根本无从知晓的成功。** 传了 `onExport` 时，一个什么也没干的处理函数，和一个真的写了文件的处理函数，resolve 得一模一样。`ExportResult` 现在带上 `source`，而 `ok` 只说明它所指名的那条流水线跑完了。',
  [fingerprint(
    '**There was no transparent export in any format.** A new `background` prop takes `null` for a figure going onto a coloured page; JPEG is still flattened onto the reader\'s own paper, because a transparent JPEG is a black one. The serialiser behind all of it — `serializeSvg`, `rasterize`, `downloadBlob`, `exportFilename` — is exported from `@misoto22/design/diagrams`, so a caller who needs a different pipeline has something to build on.',
  )]: '**任何一种格式都没有透明导出。** 新的 `background` prop 接受 `null`，供一张要放到有色页面上的图使用；JPEG 仍然会压平到读者自己的纸底上，因为一张透明的 JPEG 就是一张黑的。这一切背后的序列化器——`serializeSvg`、`rasterize`、`downloadBlob`、`exportFilename`——都从 `@misoto22/design/diagrams` 导出，这样一个需要另一条流水线的调用方，手上就有东西可以往上搭。',
  [fingerprint(
    '**The five format rows are menu items.** They were plain buttons inside a `role="menu"`: no roving focus, no typeahead, and the menu stayed open over the file it had just written.',
  )]: '**那五行格式现在是菜单项了。** 它们本来是塞在一个 `role="menu"` 里的普通 button：没有游走焦点、没有首字母跳转，而且菜单会一直开着，盖在它刚写出来的那个文件上面。',
  [fingerprint(
    '**`DiagramInspector` keyed its facts by label**, so a node read out of two files showed one row. Both render.',
  )]: '**`DiagramInspector` 用标签给它那些事实做键**，于是一个从两个文件里读出来的节点只显示一行。现在两行都会渲染。',
  [fingerprint(
    '**`DiagramMinimap` asked for the one number that makes it lie.** A `DiagramCanvas` now reports the frame it was measured against on every view it emits, so `frame` is optional and wiring `onViewChange` through is enough. A `content` width of 0 — a ref measured on the first render — draws an empty plate rather than the artwork\'s top-left corner at full size; the viewport rectangle is clipped to the map; and a drag seeks only when it started on the map.',
  )]: '**`DiagramMinimap` 要的偏偏是那个会让它说谎的数字。** `DiagramCanvas` 现在会在它发出的每一个 view 上，一并报告它是对着哪个 frame 量出来的，于是 `frame` 变成可选，把 `onViewChange` 接上就够了。一个为 0 的 `content` 宽度——一个在首次渲染时量到的 ref——现在画出来的是一块空底板，而不是原图左上角的原尺寸放大；视口矩形会被裁进小地图里；而拖拽只有在起点落在地图上时才会去定位。',
  [fingerprint(
    '**`LifecycleFigure`\'s plates take a pointer cursor** when the caller can select them. It is the one figure that builds its own group rather than using the shared plate, and it was the one figure showing a text caret over a control.',
  )]: '**当调用方可以选中它们时，`LifecycleFigure` 的底板会用手型光标。** 它是唯一一张自己搭 group、而不用共享底板的图，也就是唯一一张在控件上方显示文字光标的图。',
  [fingerprint(
    'The form controls now announce what they draw.',
  )]: '表单控件现在会把自己画出来的东西念出来。',
  [fingerprint(
    '`Field` drew a hint, an error and a required marker under six of the twelve controls it wraps and announced none of them. The wiring travelled by `cloneElement`, and each of those six dropped it: Radix\'s select root renders no DOM node at all, `Combobox` and `DatePicker` never spread what they were handed, the slider root is a roleless `<span>`, and `<label for>` does not bind to a `<div role="radiogroup">`. Every one of them rendered perfectly and was invisible to a screen reader, which is the only kind of defect a review of the browser cannot find.',
  )]: '在它包裹的十二个控件里，`Field` 有六个是把提示、错误和必填标记画了出来，却一个也没念出来。接线是靠 `cloneElement` 传过去的，而这六个每一个都把它丢了：Radix 的 select 根压根不渲染任何 DOM 节点，`Combobox` 和 `DatePicker` 从来不把收到的东西展开下去，slider 的根是一个没有角色的 `<span>`，而 `<label for>` 绑不到一个 `<div role="radiogroup">` 上。它们每一个都渲染得完美无缺，对读屏软件却是隐形的——而这正是唯一一类在浏览器里做评审找不出来的缺陷。',
  [fingerprint(
    '**The wiring reaches the element that carries the role.** `Select`, `Combobox` and `DatePicker` put the id, `aria-describedby`, `aria-required` and `aria-invalid` on their TRIGGER — so the visible label clicks through to it and the message below is announced; `RadioGroup` and `ToggleGroup` take them on the group root; `Slider` moves them onto the THUMB, which is where `role="slider"` lives. Two limits are now stated rather than implied: the words above a group name it through `aria-labelledby` and do not click through, the way a `<legend>` does not, and `required` has nowhere to sit on `DatePicker`\'s plain `<button>` trigger, where the asterisk is the whole of the marking.',
  )]: '**接线现在通到承载角色的那个元素上。** `Select`、`Combobox` 和 `DatePicker` 把 id、`aria-describedby`、`aria-required` 和 `aria-invalid` 放到自己的**触发器**上——于是可见的标签能点透过去，下面那句话也念得出来；`RadioGroup` 和 `ToggleGroup` 把它们接在组根上；`Slider` 则把它们挪到**滑块**上，因为 `role="slider"` 就住在那儿。有两条边界现在是明说的，而不是靠意会：一组控件上方的那几个字，是通过 `aria-labelledby` 给它命名的，点不透过去，就像一个 `<legend>` 点不透一样；而在 `DatePicker` 那个朴素的 `<button>` 触发器上，`required` 无处可放，那颗星号就是全部的标记。',
  [fingerprint(
    '**A trigger announces its value as well as its name.** `Select`, `Combobox`, `DatePicker` and `DateRangePicker` set `aria-label={label}` on a trigger whose text IS the current value, and `aria-label` outranks name-from-content — so a reader was told "Tags" and never "3 selected", and `DatePicker`\'s `format` reached the screen and nothing else. The trigger is now named by the label and by its own value together: "Region, Australia". Inside a `Field` with a label, that label is the name and the control\'s own `label` is not repeated.',
  )]: '**触发器现在既念名字，也念自己的值。** `Select`、`Combobox`、`DatePicker` 和 `DateRangePicker` 会在一个文字**就是**当前值的触发器上设 `aria-label={label}`，而 `aria-label` 的优先级高于从内容取名——于是读者听到的是「Tags」，永远听不到「3 selected」，而 `DatePicker` 的 `format` 只到达了屏幕，别的哪儿也没到。触发器现在由标签和它自己的值一起命名：「Region, Australia」。在一个带标签的 `Field` 里面，那个标签就是名字，控件自己的 `label` 不再重复一遍。',
  [fingerprint(
    '**`Select` reads `aria-invalid`.** It was the one control on `CONTROL_BASE` calling `isInvalid` with a single argument, so a `Field` error — or a form library — painted the message red under a resting border. `Combobox` picks up the same danger border.',
  )]: '**`Select` 现在会读 `aria-invalid`。** 它是 `CONTROL_BASE` 上唯一一个只用一个参数去调 `isInvalid` 的控件，于是一个 `Field` 的错误——或者一个表单库——把那句话涂成了红色，边框却还是静息态。`Combobox` 也拿到了同一套危险态边框。',
  [fingerprint(
    '**`<Slider label="Volume" />` renders a thumb.** The thumbs come from this component\'s own array, which was empty when neither `value` nor `defaultValue` was given, so the plainest possible usage drew a track with nothing on it to drag. It now falls back to the primitive\'s own default of one thumb at the minimum. Three more on the same control: `disabled` dims it (the old `disabled:` variant compiled to `&:disabled`, which never matches the `<span>` it was on), `format` becomes each thumb\'s `aria-valuetext` instead of changing only the printed readout, and `showValue` prints one name per thumb rather than the first name over a pair of numbers.',
  )]: '**`<Slider label="Volume" />` 现在会渲染出一个滑块。** 滑块来自这个组件自己的数组，而在既没传 `value` 也没传 `defaultValue` 时，那个数组是空的，于是最朴素不过的用法画出来是一条轨道，上面没有任何可拖的东西。它现在退回到原语自己的默认值：一个滑块，停在最小值上。同一个控件上还有三处：`disabled` 现在会把它变暗（旧的 `disabled:` variant 编译成 `&:disabled`，而这永远匹配不上它所在的那个 `<span>`）、`format` 现在会成为每个滑块的 `aria-valuetext`，而不只是改一下印出来的读数，以及 `showValue` 现在为每个滑块印一个名字，而不是在一对数字上面印第一个名字。',
  [fingerprint(
    '**`<Checkbox defaultChecked="indeterminate" />` draws the dash.** The glyph was chosen from `props.checked`, which an uncontrolled box never sets, so a partly-selected list showed the tick that means "all of them".',
  )]: '**`<Checkbox defaultChecked="indeterminate" />` 现在会画出那条横杠。** 图形是根据 `props.checked` 选的，而一个非受控的复选框从来不设这个值，于是一个只选了一部分的列表，显示的是那个意思为「全选」的对勾。',
  [fingerprint(
    '**`DatePicker` presets respect `disabledDates`.** The rail set the value the grid beside it would refuse. A shortcut landing on a blocked day is now drawn unavailable and refuses the click; a range preset is tested at its ends.',
  )]: '**`DatePicker` 的预设现在会尊重 `disabledDates`。** 那条侧栏设进去的值，正是旁边的网格会拒绝的值。一个落在被禁日期上的快捷项，现在会画成不可用，并且拒绝点击；一个区间预设则在它的两端各测一次。',
  [fingerprint(
    '**Layout.** `NativeSelect`\'s `className` now sizes the WRAPPER the chevron is pinned to — on the `<select>` it narrowed the box and left the arrow floating at the far edge of the row. Note the change of target: colours and borders sent through `className` no longer reach the `<select>`, which keeps `CONTROL_BASE`. `Select`\'s trigger truncates its value, so one long option no longer makes the field taller than the one beside it.',
  )]: '**布局。** `NativeSelect` 的 `className` 现在给的是那个箭头所钉住的**外层容器**的尺寸——放在 `<select>` 上时，它把盒子收窄了，箭头却飘在这一行的最远端。注意作用目标变了：经由 `className` 送进来的颜色和边框，不再抵达 `<select>`，后者保留 `CONTROL_BASE`。`Select` 的触发器现在会把值截断，于是一个很长的选项，不会再把这个字段撑得比旁边那个高。',
  [fingerprint(
    '**`aria-required` stays off a role that cannot take it.** A `Field`\'s `required` around `<ToggleGroup type="multiple">` put the attribute on a `role="toolbar"`, where ARIA does not allow it.',
  )]: '**`aria-required` 不会再落到一个容不下它的角色上。** 一个包住 `<ToggleGroup type="multiple">` 的 `Field` 的 `required`，会把这个属性放到一个 `role="toolbar"` 上，而 ARIA 不允许这么做。',
  [fingerprint(
    '`Select`, `Combobox`, `DatePicker` and `DateRangePicker` accept `id`, `aria-describedby` and `aria-invalid` (and `aria-required`, where the role permits it) as ordinary props, so a form library can address them without a `Field`.',
  )]: '`Select`、`Combobox`、`DatePicker` 和 `DateRangePicker` 现在把 `id`、`aria-describedby` 和 `aria-invalid`（以及在角色允许时的 `aria-required`）当作普通 prop 接受，于是一个表单库不必经过 `Field` 也能对它们下手。',
  [fingerprint(
    'Overlays now clear the surface that opened them, and reach the container that asked for them.',
  )]: '浮层现在会盖过打开它们的那个表面，也够得到那个要它们的容器。',
  [fingerprint(
    '**A select inside a modal form was painted behind the modal.** `--z-dropdown` resolved to `--z-drawer`, 100, while a dialog panel sits at `--z-modal`, 210. Every overlay in the package portals to `document.body`, so all of them are siblings in the root stacking context and the rank is the whole of the decision — there is no ancestor left to nest one inside another. A `Popover`, `DropdownMenu`, `Select` or `SearchableMenu` opened from inside a `Dialog` or a `Sheet` was therefore invisible in exactly the case it is most used.',
  )]: '**一个模态表单里的 select，被画到了模态框后面。** `--z-dropdown` 解析出来是 `--z-drawer`，也就是 100，而一块 dialog 面板坐在 `--z-modal`，也就是 210。这个包里的每一个浮层都 portal 到 `document.body`，所以它们在根堆叠上下文里全是兄弟，层级序号就是全部的裁决——已经没有哪个祖先可以把一个嵌进另一个里面了。于是一个从 `Dialog` 或 `Sheet` 内部打开的 `Popover`、`DropdownMenu`、`Select` 或 `SearchableMenu`，恰恰在它最常被用到的场合是看不见的。',
  [fingerprint(
    'The ladder gains `--z-anchored` at 220, above the modal and below the toast, and `--z-dropdown` points at it. **`--z-palette` is removed**: it was read by nothing, and it could not have worked — a command palette is a `Dialog`, so it lands at `--z-modal`, and its order against a second modal is settled by document order, which moves a scrim and its panel together where a lone panel rank would have separated them. The count stays at seven ranks, and the reasoning is written into `tokens.css` beside the numbers.',
  )]: '这道梯子多了一级 `--z-anchored`，在 220，压在模态之上、toast 之下，而 `--z-dropdown` 指向它。**`--z-palette` 被删掉了**：没有任何地方读它，而且它本来也不可能起作用——一个命令面板就是一个 `Dialog`，所以它落在 `--z-modal`，它和第二个模态之间的先后由文档顺序裁决，而文档顺序会让遮罩和它的面板一起移动，换成一个孤零零的面板层级序号，反倒会把两者拆开。总数仍然是七级，而这套推理连同这些数字一起写进了 `tokens.css`。',
  [fingerprint(
    '**`OverlayContainer` now redirects every overlay, which is what it always said it did.** `Dialog` and `Sheet` rendered the Radix portal with no container and never called `useOverlayContainer`; their props derive from `Content`, which has no `container`, so a caller could not pass one either. Both now read it — and switch from `fixed` to `absolute` when a container is named, because a `fixed` panel resolves against the viewport whatever element it is portalled into, so honouring the container without that swap would have moved the markup and left the picture unchanged. A modal inside a bounded frame now stays in the frame and inherits the `dir`, `data-density` and theme axes set there.',
  )]: '**`OverlayContainer` 现在真的会把每一个浮层改道，而这一直是它宣称自己在做的事。** `Dialog` 和 `Sheet` 渲染 Radix 的 portal 时不带 container，也从来不调 `useOverlayContainer`；它们的 props 是从 `Content` 派生的，而 `Content` 没有 `container`，所以调用方也传不进去。两者现在都会读它——并且在指定了 container 时从 `fixed` 切到 `absolute`，因为一块 `fixed` 面板无论被 portal 进哪个元素，都是对着视口解析的，所以只认 container 而不做这次切换，等于只挪了标记、画面纹丝不动。一个装在有界框架里的模态，现在会留在这个框架里，并继承那里设定的 `dir`、`data-density` 和主题各轴。',
  [fingerprint(
    '**`SearchableMenu` filtered on the id instead of the label.** cmdk derives an item\'s value from the first string in `[value, children, ref]` and only falls back to the row\'s text when `value` is absent; this passed `action.id`, so with the opaque ids an application actually has, typing the words a reader can see matched nothing and the menu showed its empty state. The label\'s own text is now lifted into the row\'s keywords, with the id still the identity. A label built only from elements prints no text to lift, and development says so (`SEARCHABLE_MENU_LABEL_UNREADABLE`) rather than shipping a row nothing matches.',
  )]: '**`SearchableMenu` 是拿 id 而不是拿标签去过滤的。** cmdk 从 `[value, children, ref]` 里的第一个字符串推出一项的 value，只有在 `value` 缺席时才退回到这一行的文字；而这里传的是 `action.id`，于是配上一个应用真实拥有的那些不知所云的 id，读者照着看得见的字去打，什么也匹配不上，菜单就摆出它的空状态。标签自己的文字现在会被提取到这一行的关键词里，而 id 仍然是身份。一个纯由元素搭出来的标签印不出可提取的文字，开发期会把这件事说出来（`SEARCHABLE_MENU_LABEL_UNREADABLE`），而不是发一行谁也匹配不上的东西出去。',
  [fingerprint(
    '**`icon` meant opposite things one import apart.** `DropdownMenuItem.icon` and `ContextMenuItem.icon` took the Lucide component; `CommandItem.icon` took the rendered element. All three now take either, and the wrong guess no longer fails at render.',
  )]: '**隔着一行 import，`icon` 的意思正好相反。** `DropdownMenuItem.icon` 和 `ContextMenuItem.icon` 收的是 Lucide 组件；`CommandItem.icon` 收的是渲染好的元素。现在三个都两种都收，猜错也不会在渲染时炸掉。',
  [fingerprint(
    '**`DropdownMenuGroup` and `ContextMenuGroup` are new.** Radix\'s `MenuLabel` is a bare `<div>` with no role and no `aria-labelledby` wiring, and `MenuGroup` — the one that carries `role="group"` — was not re-exported at all, so the sections a sighted reader saw arrived as one undivided list. The group renders the label inside itself and points the one at the other, which is not something a caller should have to remember. `DropdownMenuLabel` stays, for a line that heads nothing.',
  )]: '**`DropdownMenuGroup` 和 `ContextMenuGroup` 是新增的。** Radix 的 `MenuLabel` 是一个光秃秃的 `<div>`，没有角色，也没有 `aria-labelledby` 的接线，而 `MenuGroup`——那个带着 `role="group"` 的——压根没有被再导出，于是一个视力正常的读者看到的那些分区，到了另一边就是一整条不分段的列表。这个 group 会把标签渲染在自己内部，并把这一个指向另一个，而这不该是一件要靠调用方记住的事。`DropdownMenuLabel` 保留，供一行什么也不领的标题使用。',
  [fingerprint(
    '**A dialog with no title says so.** The fallback accessible name is the literal string "Dialog", so every unnamed modal in an application announced identically — and passed an automated accessibility check while doing it, which is how the problem survives a review. The fallback still renders, because an unnamed modal is worse; development now warns `DIALOG_TITLE_MISSING`.',
  )]: '**一个没有标题的 dialog，现在会把这件事说出来。** 兜底的无障碍名字是字面量「Dialog」，于是一个应用里每一个没命名的模态念出来都一模一样——而且一边这样一边还能通过自动化无障碍检查，这正是这个问题挺过一次评审的方式。兜底仍然会渲染，因为一个没有名字的模态更糟；开发期现在会警告 `DIALOG_TITLE_MISSING`。',
  [fingerprint(
    '**`SheetContent` carries `data-m22-animated`.** Its scrim always asserted that its fade was decorative and the panel never did, so under `prefers-reduced-motion` the fade was cancelled and the panel still travelled the full width of itself.',
  )]: '**`SheetContent` 现在带上了 `data-m22-animated`。** 它的遮罩一直在声明自己的淡入淡出是装饰性的，面板却从来没有声明过，于是在 `prefers-reduced-motion` 下，淡入淡出被取消了，面板照样把自己的整个宽度滑了一遍。',
  [fingerprint(
    '**The portable CSS recipe was missing a layer.** `README.md` told an app that compiles its own Tailwind to import `tokens.css`, `semantic.css` and `keyframes.css`. `data-mode` and `data-density` live in `tokens.css` and survived; `data-surface`, `data-radius`, `data-rules`, `data-type`, `data-motion` and `data-chart-palette` are declared only in `themes.css`, which the recipe never mentioned — so a consumer wrote `data-radius="sharp"` and got no error, no warning and no corner. The split is deliberate: `themes.css` is its own export, attribute-scoped where `semantic.css` is `:root`-scoped, and the package\'s own tests hold the two apart. So the recipe names all four layers, and a test derives the axes from the stylesheets and fails when a documented recipe stops reaching one.',
  )]: '**那份可移植的 CSS 配方少了一层。** `README.md` 告诉一个自己编译 Tailwind 的应用去引入 `tokens.css`、`semantic.css` 和 `keyframes.css`。`data-mode` 和 `data-density` 住在 `tokens.css` 里，活了下来；而 `data-surface`、`data-radius`、`data-rules`、`data-type`、`data-motion` 和 `data-chart-palette` 只在 `themes.css` 里声明，而这份配方从来没提过它——于是一个使用者写下 `data-radius="sharp"`，得到的是没有报错、没有警告，也没有圆角。这个拆分是刻意的：`themes.css` 是它自己的一个导出，作用域挂在属性上，而 `semantic.css` 的作用域是 `:root`，这个包自己的测试也把两者分得清清楚楚。所以配方现在把四层全都点名，而且有一个测试会从样式表里推出这些轴，一旦一份写进文档的配方漏掉了其中一条，它就红。',
  [fingerprint(
    'Eight components that rendered correctly and described something else.',
  )]: '八个组件，渲染得没错，描述的却是另一回事。',
  [fingerprint(
    'Every defect here shipped a component that looks finished: no error, no warning, no missing box. What they had in common is that the failure was invisible in the browser and invisible in review, which is the only kind of defect a documentation pass cannot find.',
  )]: '这里的每一个缺陷，发出去的都是一个看起来做完了的组件：没有报错、没有警告、没有缺失的框。它们的共同点是：这个失败在浏览器里看不见，在评审里也看不见——而这正是唯一一类过一遍文档也找不出来的缺陷。',
  [fingerprint(
    '**`Avatar` announced nothing without a photograph.** `alt` reached the DOM only through `AvatarPrimitive.Image`, which renders only under `src`, and the initials are `aria-hidden` — so every row of a user list where photographs are optional was an unnamed circle, however carefully `alt` was written. The ROOT now carries the name as `role="img"`, in both cases, and the image\'s own `alt` is empty so nobody is read twice. An empty `alt` still takes no role at all, which keeps the deliberate decorative case out of the tree rather than putting an unnamed image in it.',
  )]: '**没有照片时，`Avatar` 什么也不念。** `alt` 只经由 `AvatarPrimitive.Image` 抵达 DOM，而那个东西只在有 `src` 时才渲染，姓名首字母又是 `aria-hidden` 的——于是在一份照片可有可无的用户列表里，每一行都是一个没有名字的圆圈，不管 `alt` 写得多用心。现在由**根节点**以 `role="img"` 承载这个名字，两种情况下都是如此，而图片自己的 `alt` 为空，这样没有谁会被念两遍。一个空的 `alt` 仍然不取任何角色，这就把那个刻意为之的装饰性场景挡在树外面，而不是往里面塞一张没有名字的图片。',
  [fingerprint(
    '**`StatusPill`\'s `tone` reached nothing a reader could hear.** It was forwarded solely to the inner `StatusDot`, which is `aria-hidden` by law, so "Degraded" in a warning pill and "Degraded" in a neutral one were the same sentence. The `warning` and `danger` tones now carry a visually-hidden severity word. `success` and `neutral` add nothing on purpose: they are the absence of alarm, which is what a reader already assumes.',
  )]: '**`StatusPill` 的 `tone` 没有抵达任何读者听得见的地方。** 它只被转发给内层的 `StatusDot`，而那个东西按规矩就是 `aria-hidden` 的，于是一个警告色药丸里的「Degraded」和一个中性药丸里的「Degraded」，是同一句话。`warning` 和 `danger` 两种色调现在会带上一个视觉隐藏的严重程度词。`success` 和 `neutral` 故意什么也不加：它们代表的是没有警报，而这本来就是读者默认的假设。',
  [fingerprint(
    '**`Diagram` drew a confident picture of a different spec.** Three silent no-ops, all now reported by name in development and none reaching a production bundle. An edge between non-adjacent nodes, or one written `to`→`from`, drew no arrow and said nothing (`DIAGRAM_EDGE_NOT_ADJACENT`, `DIAGRAM_EDGE_UNKNOWN_NODE`). The same `edges` array was handed to every rank, so a pair of ids reused two levels down drew the arrow again down there — it is now resolved once for the whole figure and spent at the first pair that matches, so one edge is one arrow, and the duplicate id that caused it says so (`DIAGRAM_DUPLICATE_ID`). `accent` on a container and `direction` on a leaf both type-check and paint nothing; both are now reported (`DIAGRAM_ACCENT_ON_CONTAINER`, `DIAGRAM_DIRECTION_ON_LEAF`).',
  )]: '**`Diagram` 为另一份 spec 画了一张笃定的图。** 三处无声的空操作，现在都会在开发期指名道姓地报出来，而且一个也不会进到生产包里。一条连接非相邻节点的边，或者一条写成 `to`→`from` 的边，画不出箭头，也不吭声（`DIAGRAM_EDGE_NOT_ADJACENT`、`DIAGRAM_EDGE_UNKNOWN_NODE`）。同一个 `edges` 数组会被交给每一层，于是一对在两层之下被复用的 id，会在下面那里把箭头再画一遍——它现在对整张图只解析一次，并在第一对匹配上的地方就用掉，于是一条边就是一支箭头，而造成这件事的那个重复 id 也会把自己说出来（`DIAGRAM_DUPLICATE_ID`）。容器上的 `accent` 和叶子上的 `direction` 都能通过类型检查，也都什么都不画；现在两者都会被报出来（`DIAGRAM_ACCENT_ON_CONTAINER`、`DIAGRAM_DIRECTION_ON_LEAF`）。',
  [fingerprint(
    '**`Table`\'s scroll container was not a positioning context.** `sr-only` is `position: absolute`, so a visually-hidden label inside a cell resolved against the document — escaping the table\'s own scroll container and any `overflow-hidden` around it, and widening the page by however far the table happened to be scrolled. It is `relative` now. `ScrollArea`\'s root already was; its viewport is now too, so an absolutely-positioned descendant travels with the content instead of hanging still over it.',
  )]: '**`Table` 的滚动容器不是一个定位上下文。** `sr-only` 是 `position: absolute`，于是一个单元格里的视觉隐藏标签，是对着整份文档解析的——它逃出了表格自己的滚动容器，也逃出了外面任何 `overflow-hidden`，并且把页面撑宽了，宽出来的量正好是表格恰巧滚过的距离。它现在是 `relative` 的。`ScrollArea` 的根本来就是；它的视口现在也是了，于是一个绝对定位的后代会跟着内容一起走，而不是纹丝不动地悬在它上面。',
  [fingerprint(
    '**`ScrollArea` clipped the axis it did not scroll.** Radix sets the viewport\'s `overflowX`/`overflowY` from which `Scrollbar` children are mounted, so the old `orientation="vertical"` default left the horizontal axis `hidden`: content wider than the box was not merely unmarked, it was unreachable by every key and every gesture. The default is `both`. Narrowing it is still available, and is now a decision someone wrote down.',
  )]: '**`ScrollArea` 把它不滚动的那条轴裁掉了。** Radix 是根据挂载了哪些 `Scrollbar` 子元素来设视口的 `overflowX`/`overflowY` 的，于是旧的 `orientation="vertical"` 默认值把水平轴留成了 `hidden`：比盒子更宽的内容不只是没有标记出来，而是任何按键、任何手势都够不到。默认值现在是 `both`。收窄它这条路仍然在，只不过现在它是一个有人写下来的决定。',
  [fingerprint(
    '**`Breadcrumb` shipped crumbs that impersonated the current page.** A middle crumb with no `href` renders as a `<span>` inheriting the nav\'s `--ink-3-aa` — the same colour as the links beside it — and takes no `aria-current` either. Invisible in the browser, invisible in review; named in the console instead (`BREADCRUMB_CRUMB_NOT_LINKED`).',
  )]: '**`Breadcrumb` 发出去的面包屑里，有的在冒充当前页。** 一个中间的、没有 `href` 的面包屑，会渲染成一个继承了 nav 的 `--ink-3-aa` 的 `<span>`——和它旁边那些链接是同一个颜色——而且也不带 `aria-current`。在浏览器里看不见，在评审里也看不见；那就改到控制台里点它的名（`BREADCRUMB_CRUMB_NOT_LINKED`）。',
  [fingerprint(
    '**`Card` rounded its corners and did not clip them.** A full-bleed image or a filled first child laid its square corners over the card\'s round ones. The box clips now; pass `overflow-visible` for the rarer card that deliberately overhangs.',
  )]: '**`Card` 把自己的角磨圆了，却没有裁掉它们。** 一张出血图片，或者一个填了底色的首个子元素，会把自己的方角铺在卡片的圆角之上。这个盒子现在会裁剪；对那种刻意要溢出来的、更少见的卡片，传 `overflow-visible`。',
  [fingerprint(
    '`prefers-reduced-motion` is now honoured by everything, instead of by whatever remembered to ask.',
  )]: '`prefers-reduced-motion` 现在是所有东西都遵守，而不是谁记得去问才遵守。',
  [fingerprint(
    'The rule in `keyframes.css` was an opt-in: a surface that animated carried `data-m22-animated`, and that attribute was what got cancelled. Four independent documentation passes each found a different piece of the same failure.',
  )]: '`keyframes.css` 里的那条规则是要主动加入的：一个会动的表面带上 `data-m22-animated`，而被取消掉的正是这个属性。四轮各自独立的文档梳理，各自找到了同一个失败的不同一块。',
  [fingerprint(
    'Half the selector matched nothing at all. `[class*=\'m22-anim\']` was written for a class-name scheme the package never adopted — Tailwind emits `animate-[m22-collapsible-down_…]`, which contains no `m22-anim` — so that branch had never once fired, and nothing anywhere said so.',
  )]: '选择器有一半压根什么也匹配不上。`[class*=\'m22-anim\']` 是照着一套这个包从未采用过的类名方案写的——Tailwind 发出来的是 `animate-[m22-collapsible-down_…]`，里面根本没有 `m22-anim`——所以那条分支一次都没有触发过，而且没有任何地方说过这件事。',
  [fingerprint(
    'The rule only ever set `animation`. Anything animated by `transition` escaped it entirely, which is most things that slide: `SheetContent` and `AppShell`\'s drawer both move on `transition-transform`.',
  )]: '这条规则从头到尾只设了 `animation`。任何靠 `transition` 动起来的东西都完全逃了出去，而那正是大多数会滑动的东西：`SheetContent` 和 `AppShell` 的抽屉，都是靠 `transition-transform` 移动的。',
  [fingerprint(
    'Two siblings disagreed. `CollapsibleContent` carried `motion-reduce:animate-none`; `CollapsibleSection` — the composed one its own JSDoc calls what most call sites want — carried nothing, and neither did `Accordion`\'s panel.',
  )]: '两个兄弟对不上。`CollapsibleContent` 带着 `motion-reduce:animate-none`；而 `CollapsibleSection`——那个组合好的、被它自己的 JSDoc 称为「大多数调用点想要的那一个」——什么也没带，`Accordion` 的面板同样什么也没带。',
  [fingerprint(
    'Four authors forgetting the same thing in four components is a fact about the mechanism, not about the authors. So the guarantee is no longer the marker: the block now carries the universal reduced-motion reset, capping both `animation-duration` and `transition-duration`. A component added tomorrow is covered before its author has read the file.',
  )]: '四个作者在四个组件里忘掉同一件事，这说明的是机制的问题，不是作者的问题。所以保证不再挂在那个标记上：这一块现在承载的是通用的减少动效重置，把 `animation-duration` 和 `transition-duration` 一起封顶。明天新加的一个组件，在它的作者读到这个文件之前就已经被覆盖了。',
  [fingerprint(
    'This is a `*` rule in a stylesheet consumers import, and that is intended. It fires only when the reader has asked their operating system for less motion, and a caller with motion they consider essential can still keep it — an `!important` on `*` is the weakest one there is, so any class-level `animation-duration: … !important` outranks it. What changes is which way round the default falls: keeping motion under this preference is now something you write down, rather than something you get by forgetting.',
  )]: '这是一条写在使用者会引入的样式表里的 `*` 规则，而这是有意为之。它只在读者向自己的操作系统要求减少动效时才生效，而一个认为自己的动效是必要的调用方，仍然可以把它留住——加在 `*` 上的 `!important` 是所有 `!important` 里最弱的一个，所以任何类一级的 `animation-duration: … !important` 都压得过它。变的是默认值倒向哪一边：在这个偏好下保留动效，现在是一件你得写下来的事，而不是一件你靠忘记就能得到的事。',
  [fingerprint(
    'Durations collapse to `0.01ms` rather than to `none`, because JavaScript listens — Radix unmounts a closing panel on `animationend`, and consumer code may await `transitionend`. A near-zero duration still fires both.',
  )]: '时长塌缩到 `0.01ms` 而不是 `none`，因为 JavaScript 在听——Radix 是在 `animationend` 上卸载一块正在关闭的面板的，而使用者的代码可能在等 `transitionend`。一个趋近于零的时长，这两个事件照样都会发。',
  [fingerprint(
    '`data-m22-animated` stays and is now deliberately redundant: it is a component asserting its motion is decorative, and it goes further than the floor by removing the animation outright. `Accordion`\'s panel and both `Collapsible` panels now carry it, so the two siblings finally agree. `src/__tests__/reduced-motion.test.tsx` fails if the block stops being universal, stops naming transitions, grows a selector that matches nothing, or if a component reaches for a system keyframe without making the assertion.',
  )]: '`data-m22-animated` 保留下来，而且现在是刻意冗余的：它是一个组件在声明自己的动效是装饰性的，并且比那条底线走得更远——它把动画整个去掉。`Accordion` 的面板和两块 `Collapsible` 面板现在都带上了它，于是那两个兄弟终于说到一块儿去了。`src/__tests__/reduced-motion.test.tsx` 会在以下情况红：这一块不再是通用的、不再点名 transition、长出了一个什么也匹配不上的选择器，或者某个组件伸手去用一个系统关键帧却没有做出那句声明。',
  // ─── 0.7.0 ───
  [fingerprint(
    'Add `@misoto22/design/diagrams`: five diagram figures and the chrome to explore one.',
  )]: '新增 `@misoto22/design/diagrams`：五种图示，以及把其中一张读下去所需的那套外围界面。',
  [fingerprint(
    '`ArchitectureFigure`, `WorkflowFigure`, `SequenceFigure`, `DataflowFigure` and `LifecycleFigure` render the JSON schemas published by [archify](https://github.com/tt-a1i/archify), so a specification authored for that tool renders here with no translation step — in this system\'s own terms rather than in archify\'s palette. Where archify separates seven kinds of node by hue, these carry the kind twice, as a drawn sigil and as a word on the plate\'s eyebrow, so the distinction survives a greyscale print and a colour-blind reader. The only colour any of them spends is `--success` and `--danger` on a terminal lifecycle state, which is what those two tokens were reserved for.',
  )]: '`ArchitectureFigure`、`WorkflowFigure`、`SequenceFigure`、`DataflowFigure` 和 `LifecycleFigure` 渲染的是 [archify](https://github.com/tt-a1i/archify) 公布的那几份 JSON schema，所以一份为那个工具写的规格，不经任何转换步骤就能在这里画出来——而且用的是这套系统自己的语汇，而不是 archify 的配色。archify 靠七种色相把七类节点分开；这里则把类别说两遍——一个画出来的记号，加上底板引题上的一个词——于是这个区分挺得过一次灰度打印，也挺得住一位色盲读者。它们唯一花掉的颜色，是终态生命周期状态上的 `--success` 和 `--danger`，而这两个 token 当初留出来就是为了这个。',
  [fingerprint(
    'Every position comes out of the specification, so the figures render on a server and produce identical markup twice — there is no layout to do and therefore no shift on hydration. The `<svg>` is `role="img"` with a name, and each figure publishes its nodes and relationships beside it as an ordinary list; passing `onSelectNode` turns that list into the keyboard\'s route to a selection.',
  )]: '每一个位置都出自那份规格，所以这些图能在服务端渲染，两次产出的标记完全一致——压根没有布局要做，因此水合时也不会有任何抖动。`<svg>` 是带名字的 `role="img"`，而每张图都会把自己的节点和关系当成一份普通列表，一并陈列在它旁边；传入 `onSelectNode`，这份列表就变成键盘通往一次选中的那条路。',
  [fingerprint(
    '`DiagramCanvas`, `DiagramToolbar`, `DiagramExportMenu`, `DiagramInspector`, `DiagramMinimap` and `DiagramLegend` are the reader-facing half: pan and zoom, a grouped action bar, PNG / JPEG / WebP / SVG / share-card export with the theme\'s custom properties baked into real colours, a detail panel and an overview map.',
  )]: '`DiagramCanvas`、`DiagramToolbar`、`DiagramExportMenu`、`DiagramInspector`、`DiagramMinimap` 和 `DiagramLegend` 是面向读者的那一半：平移与缩放、一条分了组的动作栏、把主题的自定义属性烘成真实颜色的 PNG / JPEG / WebP / SVG / 分享卡导出、一块详情面板，以及一张总览地图。',
  [fingerprint(
    'They ship from their own entry point so a page rendering a `Badge` does not pay for a routing engine; `check-size` fails if they ever leak into the main barrel. The shared SVG export helpers now live in `src/lib/svg-export.ts`.',
  )]: '它们从自己的入口点发出，这样一个只渲染 `Badge` 的页面就不会为一台布线引擎付钱；一旦它们漏进主 barrel，`check-size` 就会红。共享的 SVG 导出辅助函数现在住在 `src/lib/svg-export.ts` 里。',
  [fingerprint(
    'Fold the chart PNG export onto the shared SVG export.',
  )]: '把图表的 PNG 导出并到共享的 SVG 导出上。',
  [fingerprint(
    '`charts/lib/export.ts` and `lib/svg-export.ts` each carried the same computed- style walker, the same standalone-document builder and the same canvas rasteriser — arrived at independently, for charts and for diagrams, and already diverging: the shared copy had picked up `marker-start`/`mid`/`end`, without which an exported arrow comes out headless. Two copies of a paint walker means the next fix lands in one of them.',
  )]: '`charts/lib/export.ts` 和 `lib/svg-export.ts` 各自带着同一个计算样式遍历器、同一个独立文档构造器，以及同一个 canvas 栅格化器——一个为图表、一个为图示，各自独立地走到了这里，而且已经开始分岔：共享的那一份已经补上了 `marker-start`/`mid`/`end`，少了它，导出来的箭头是没有头的。一个上色遍历器存着两份拷贝，意思就是下一次修复只会落进其中一份里。',
  [fingerprint(
    'The chart module keeps only what a Recharts chart knows and a diagram does not: which `<svg>` in the subtree is the plot, what a row of chart data looks like as a CSV record, and that the ground behind an exported plot is `--chart-surface`. It is 387 lines down to 182, and `chartToPng`\'s signature is unchanged.',
  )]: '图表模块只留下「Recharts 图表知道、而图示不知道」的那些事：子树里哪一个 `<svg>` 才是绘图区、一行图表数据写成 CSV 记录长什么样，以及导出的绘图区背后那层底是 `--chart-surface`。387 行降到 182 行，而 `chartToPng` 的签名没有变。',
  [fingerprint(
    '`findPlotSvg` now has a test, which it did not before. Both of its narrowings are load-bearing and each fails the same silent way — the toolbar sits outside the plot wrapper and every control in it is an `<svg>`, the legend draws its swatches inside it — so an export that skipped either one would be a picture of an icon, which looks like a working download until somebody opens the file.',
  )]: '`findPlotSvg` 现在有测试了，之前没有。它的两处收窄都是承重的，而且各自都以同样一种无声的方式失败——工具栏坐在绘图区包装层外面，而它里面每一个控件都是一个 `<svg>`；图例则把自己的色块画在包装层里面——所以一次跳过其中任何一处的导出，出来会是一张图标的图片，而它看上去和一次正常的下载没有区别，直到有人真的打开那个文件。',
  [fingerprint(
    'Two visible differences, both from the shared serialiser: the exported title band is 34px at 15px rather than 30px at 13px, and a chart exported before it has been measured now says `serializeSvg:` rather than `chartToPng:` in the error it throws.',
  )]: '两处看得见的差别，都来自那个共享的序列化器：导出的标题带从 30px 高、13px 字号变成 34px 高、15px 字号；而一张还没被测量就被导出的图表，现在抛出的错误里写的是 `serializeSvg:` 而不是 `chartToPng:`。',

  // ─── 0.6.1 ───
  [fingerprint(
    'Fix the `Import:` line the offline documentation prints for a chart.',
  )]: '修正离线文档给图表打印的 `Import:` 那一行。',
  [fingerprint(
    '`dist/agent/AreaChart.md` said `import { AreaChart } from \'@misoto22/design\'`, which throws. Charts ship from `@misoto22/design/charts` behind optional peers, and that separation is the whole reason an app rendering a Badge never resolves `recharts` — so the root barrel does not export them and never will. Twenty components carried the wrong line, in the tarball and in the site\'s `llms.txt` alike. It is the one line an agent pastes without checking.',
  )]: '`dist/agent/AreaChart.md` 写的是 `import { AreaChart } from \'@misoto22/design\'`，而这句会 throw。图表从 `@misoto22/design/charts` 发出，后面挂着可选 peer，而这道分界线的全部意义就在于：一个只渲染 Badge 的应用永远不会去解析 `recharts`——所以根 barrel 不导出它们，将来也不会。二十个组件带着错的那一行，npm 包里和站点的 `llms.txt` 里都是。而这恰恰是 agent 会直接粘走、不会去核对的一行。',
  [fingerprint(
    'Which specifier a component is imported from is now derived from the tree its directory sits in — `ENTRY_POINTS` maps each specifier to one directory under `src/`, and nothing is authored per component. The alternative was a field on every entry, which is a second copy of something the filesystem already says. `catalog.test.ts` fails when a catalog entry names no entry point\'s tree.',
  )]: '一个组件从哪个 specifier 导入，现在由它目录所在的那棵树推导出来——`ENTRY_POINTS` 把每个 specifier 映射到 `src/` 下的一个目录，没有任何东西是按组件手写的。另一条路是给每条记录加一个字段，那等于把文件系统已经说过的事再抄一遍。当一条 catalog 记录不属于任何入口的目录树时，`catalog.test.ts` 会红。',
  [fingerprint(
    'The skill was stale in the same direction and is corrected with it: it said 52 primitives when there are 72, never mentioned the charts entry or `@misoto22/design/tokens`, and still offered `data-accent` — an attribute that has never existed, in the same skill whose own `rules/tokens.md` says so. Two tests now hold that line: every specifier in `exports` has to appear in `SKILL.md`, and no skill file may offer `data-accent` as something to set.',
  )]: 'skill 在同一个方向上也过期了，这次一并修正：它写着 52 个 primitive，实际有 72 个；从没提过 charts 入口和 `@misoto22/design/tokens`；还在把 `data-accent` 当成可设的轴列出来——而这个属性从来就不存在，同一个 skill 自己的 `rules/tokens.md` 里就是这么写的。现在有两条测试守着这一点：`exports` 里的每个 specifier 都必须出现在 `SKILL.md` 里，而且任何 skill 文件都不许把 `data-accent` 当作可设置项。',

  // ─── 0.6.0 ───
  [fingerprint('The package documents itself for agents, offline: a `misoto22-design` CLI, a skill, and a README.')]: '这个包现在离线为 agent 记录自己：一个 `misoto22-design` CLI、一个 skill，以及一个 README。',
  [fingerprint(
    'The docs were on a website while the version being written against was in `node_modules`, and neither side could see the disagreement. Everything an agent needs now ships in the same tarball as the source it was generated from.',
  )]:
    '文档在一个网站上，而真正被写代码所针对的那个版本躺在 `node_modules` 里，两边谁也看不见这处分歧。现在 agent 需要的一切，都和生成它的那份源码装在同一个 tarball 里发出去。',
  [fingerprint(
    '`npx misoto22-design docs <Component>` prints one component in full — every prop with its type and default, the exported unions, the keyboard contract, the accessibility promises, the `@example` blocks. The median component is about 500 tokens, against roughly 28,000 for all fifty-two. It resolves parts and types too, so `docs CardBody`, `docs TH` and `docs ButtonVariant` all land on the right file — which is what you have when an import just failed.',
  )]:
    '`npx misoto22-design docs <Component>` 会把一个组件完整打印出来——每个 prop 连同它的类型和默认值、导出的联合类型、键盘契约、无障碍承诺，以及 `@example` 代码块。组件的中位数大约是 500 token，而全部 52 个加起来约 28,000。它同样能解析部件和类型，所以 `docs CardBody`、`docs TH` 和 `docs ButtonVariant` 都会落到正确的那个文件上——而一次 import 刚刚失败时，你手上有的正是这样一个名字。',
  [fingerprint(
    '`npx misoto22-design docs --installed` is the cheap half: the resolved version and every component name, a few hundred tokens.',
  )]:
    '`npx misoto22-design docs --installed` 是便宜的那一半：解析出来的版本号和每一个组件名，几百个 token。',
  [fingerprint(
    '`npx misoto22-design init --agents-md` installs the skill under `.claude/skills/` and points `AGENTS.md` at it. Its name and description are about 110 tokens and are all a session carries until something touches the package; the body and the five rule files load from there.',
  )]:
    '`npx misoto22-design init --agents-md` 会把这个 skill 装到 `.claude/skills/` 下，并让 `AGENTS.md` 指向它。它的名字和描述加起来约 110 token，在有东西真的碰到这个包之前，一个会话随身带的就只有这些；正文和那五个规则文件从那里再往下加载。',
  [fingerprint('`README.md` was listed in `files` and did not exist, so the npm page has been blank. It exists now.')]: '`README.md` 列在 `files` 里，却并不存在，所以 npm 页面一直是空白的。现在它存在了。',
  [fingerprint(
    'Two things the old documentation said were not true. There has never been a `data-accent` attribute — `--accent` is a custom property — and `data-surface="glass"` was never listed, so nothing pointed at an axis value that does work. The axes are now read out of the stylesheets that define them rather than described by hand, and a test fails when the authored half stops matching.',
  )]:
    '旧文档说的有两件事不是真的。从来就没有过 `data-accent` 属性——`--accent` 是一个自定义属性——而 `data-surface="glass"` 从来没被列出来，于是没有任何地方指向一个确实生效的轴值。这些轴现在是从定义它们的样式表里读出来的，而不是靠手写描述；当手写的那一半不再对得上时，会有一个测试失败。',
  [fingerprint('Nothing about the runtime changed: same exports, same CSS, same bundle.')]: '运行时没有任何变化：一样的导出、一样的 CSS、一样的打包产物。',
  [fingerprint('Add twenty data-visualisation primitives.')]: '新增二十个数据可视化原语。',
  [fingerprint(
    'Sixteen ship from a new `@misoto22/design/charts` entry with `recharts` and `motion` as OPTIONAL peer dependencies — `AreaChart`, `BarChart`, `LineChart`, `ComposedChart`, `ScatterChart`, `PieChart`, `RadarChart`, `RadialChart`, `FunnelChart`, `TreemapChart`, `SankeyChart`, `BoxPlot`, `Histogram`, `WaterfallChart`, `Facet` and the toolbar-driven zoom — each a compound component composed from axes, grid, tooltip, legend, dots, a background plate and a keyboard-driven zoom brush. The main entry and its size budget are unchanged: an app that renders a Badge does not pay for a rendering engine.',
  )]: '其中十六个来自新的 `@misoto22/design/charts` 入口，`recharts` 和 `motion` 是**可选**的 peer 依赖——`AreaChart`、`BarChart`、`LineChart`、`ComposedChart`、`ScatterChart`、`PieChart`、`RadarChart`、`RadialChart`、`FunnelChart`、`TreemapChart`、`SankeyChart`、`BoxPlot`、`Histogram`、`WaterfallChart`、`Facet`，以及由工具栏驱动的缩放——每一个都是一个复合组件，由坐标轴、网格、tooltip、图例、点、一块背景板和一把键盘驱动的缩放刷子组合出来。主入口和它的体积预算没有变：一个只渲染 Badge 的应用，不会为一台渲染引擎付钱。',
  [fingerprint(
    '`Heatmap`, `Sparkline`, `BarList`, `BigNumber` and `BulletChart` ship from the same entry and need NO engine at all. The heatmap is a real `<table>` with weighted cells, so the structure a screen reader walks is the structure the eye reads; the sparkline is one `<path>`, so a hundred of them in a table cost nothing.',
  )]: '`Heatmap`、`Sparkline`、`BarList`、`BigNumber` 和 `BulletChart` 从同一个入口发出，而且**完全不**需要引擎。热力图是一张真正的 `<table>`，格子按轻重着色，所以读屏软件走过的结构就是眼睛读的结构；迷你折线就是一条 `<path>`，所以在一张表格里放一百条也不花什么代价。',
  [fingerprint(
    'The token layer gains a data block: `--series-1` … `--series-8` (a neutral ramp whose adjacent steps clear ΔE 21 and 3:1 on their own ground), the `--chart-*` roles, and `--chart-fill` / `--chart-texture` — the only tokens in the system that hold different numbers on the two grounds, because ink at 14% over paper is a legible band and paper-white at 14% over near-black is nothing. Texture is the primary carrier of series identity; the ramp supports it. `data-chart-palette` is a seventh theme axis that swaps the ramp for a validated categorical palette.',
  )]: 'token 层多了一块数据部分：`--series-1` … `--series-8`（一条中性色阶，相邻两级之间过 ΔE 21，而且每一级在自己的底色上都过 3:1）、`--chart-*` 这组角色，以及 `--chart-fill` / `--chart-texture`——它们是整套系统里唯一在两种底色上取不同数值的 token，因为墨色以 14% 压在纸白上是一条读得出的带，而纸白以 14% 压在近黑上什么都不是。纹理才是序列身份的第一载体，色阶是给它托底的。`data-chart-palette` 是第七条主题轴，把这条色阶换成一套验证过的分类色板。',
  [fingerprint(
    'Every chart requires a `title`, renders its rows again as a visually hidden table, and drops its intro animation under `prefers-reduced-motion`.',
  )]: '每一张图都必须有 `title`，都会把自己的数据行再渲染一遍成一张视觉上隐藏的表格，并且在 `prefers-reduced-motion` 下丢掉入场动画。',
  [fingerprint(
    'Borrowed from a survey of the field, and each one fixing something that was missing rather than adding a variant:',
  )]: '以下这些借自对这个领域的一轮普查，而且每一项补的都是一处缺失，而不是多加一个变体：',
  [fingerprint(
    '**An annotation layer** — `ReferenceLine`, `ReferenceBand` and `Annotation` on every cartesian chart, stacked in the order editorial charting settled on (band behind the grid, line above the marks, note above both). Most charts that look like they need a second series need a target line instead.',
  )]: '**一层注记**——每一张笛卡尔图表上都有 `ReferenceLine`、`ReferenceBand` 和 `Annotation`，按编辑类制图最后定下来的顺序叠放（带在网格后面，线在标记上面，注解在两者之上）。大多数看起来需要第二条序列的图，需要的其实是一条目标线。',
  [fingerprint(
    '**Axis titles** (`<Chart.XAxis label>`), because an axis reading 0 · 100 · 200 says nothing about whether those are people, milliseconds or dollars.',
  )]: '**坐标轴标题**（`<Chart.XAxis label>`），因为一根读作 0 · 100 · 200 的坐标轴，完全没说这些到底是人数、毫秒还是美元。',
  [fingerprint(
    '**Selective value labels** — `<Chart.Values show="last | first-last | extremes | all">`. The default prints one number, not one per point.',
  )]: '**有选择的数值标签**——`<Chart.Values show="last | first-last | extremes | all">`。默认只印一个数字，而不是每个点印一个。',
  [fingerprint(
    '**`formatNumber`** with compact, percent, currency, duration and byte styles, and a compact default on every value axis above four digits.',
  )]: '**`formatNumber`**，带紧凑、百分比、货币、时长和字节几种写法，并且在每一根超过四位数的数值轴上默认走紧凑写法。',
  [fingerprint(
    '**An empty state.** `data: []` now renders `ChartEmpty` rather than a bare pair of axes, which is indistinguishable from a failed load.',
  )]: '**一个空状态。** `data: []` 现在渲染的是 `ChartEmpty`，而不是光秃秃的一对坐标轴——后者和一次加载失败根本分不出来。',
  [fingerprint(
    '**Forced-colours support** in `tokens.css`. Browsers do not remap SVG, so the chart tokens re-point onto system colours there and texture carries the series apart; `Heatmap` reveals its numbers, since its wash is gone.',
  )]: '**强制颜色模式的支持**，写在 `tokens.css` 里。浏览器不会重新映射 SVG，所以图表 token 在那里改指向系统颜色，由纹理把各条序列分开；`Heatmap` 则把自己的数字亮出来，因为它那层色底已经没了。',
  [fingerprint(
    '**`BarList`** — a ranked list with the bar behind the name, which a horizontal bar chart cannot do.',
  )]: '**`BarList`**——一个排行榜，条形在名字后面，而这是横向柱状图做不到的。',
  [fingerprint(
    '**`BigNumber`** — one figure at headline size with a delta whose direction is stated by the call site, never inferred from the sign.',
  )]: '**`BigNumber`**——一个用标题字号印出来的数字，配一个变化量，它的方向由调用处说明，绝不从正负号推断。',
  [fingerprint(
    '**`BulletChart`** — Stephen Few\'s replacement for the dashboard gauge: a measure, its target and its qualitative bands in the height of a line of text. Plain HTML, so ten of them stack into a status page for free.',
  )]: '**`BulletChart`**——Stephen Few 用来取代仪表盘表盘的那个东西：一个度量、它的目标值，以及它的定性区间带，都装在一行文字的高度里。纯 HTML，所以十个叠起来就白得一页状态页。',
  [fingerprint(
    '**The statistical family** — `BoxPlot`, `Histogram` and `WaterfallChart`. Each documents what it HIDES rather than only what it shows: a box cannot tell one hump from two, a histogram\'s shape is a property of its bin width, and a waterfall\'s connectors imply a sequence most breakdowns do not have.',
  )]: '**统计那一族**——`BoxPlot`、`Histogram` 和 `WaterfallChart`。每一个都把自己**藏起来**的东西写进文档，而不只写它展示了什么：一个箱子分不出一个峰和两个峰，一张直方图的形状是它分箱宽度的属性，而一张瀑布图的连接线，暗示着大多数拆解压根没有的先后顺序。',
  [fingerprint(
    '**`Facet`** — the same chart once per group on one shared scale, which is the answer to eight series overplotted into a hairball. The shared domain is the default: on independent scales a group peaking at 40 and one peaking at 4,000 draw the same shape, and the comparison is not merely lost but inverted.',
  )]: '**`Facet`**——同一张图每组重复一次，共用同一把刻度，这就是八条序列叠画成一团乱麻的答案。共享 domain 是默认：刻度各自独立时，一组峰值 40 和一组峰值 4,000 画出来是同一个形状，而比较不只是丢了，是反过来了。',
  [fingerprint(
    '**Sonification** — `<Chart.Sonify>` plays a series as pitch over time for a reader who cannot see the plot. Never autoplays; sound only ever starts from an explicit user action, which is a different question from `prefers-reduced-motion`.',
  )]: '**声音化**——`<Chart.Sonify>` 把一条序列播成随时间变化的音高，给看不见这张图的读者。从不自动播放；声音永远只从一次明确的用户操作开始，而这和 `prefers-reduced-motion` 是两个不同的问题。',
  [fingerprint(
    '**A chart toolbar** — step zoom, reset, and taking the figure away as a PNG or a CSV. Capped at five controls with no overflow menu, so a cartesian chart does not statically reach a menu component every consumer would then ship. Zoom and the brush drive ONE window, so they cannot disagree.',
  )]: '**一条图表工具栏**——步进缩放、重置，以及把这张图作为 PNG 或 CSV 带走。上限五个控件，不带溢出菜单，这样一张笛卡尔图表就不会静态地依赖到一个菜单组件、逼得每个使用者都把它打包进去。缩放和刷子驱动的是**同一个**窗口，所以它们不可能互相矛盾。',

  // ─── 0.5.0 ───
  [fingerprint('`AppShell` takes `sidebarLabel`, `navLabel`, `openLabel` and `closeLabel`.')]:
    '`AppShell` 接受 `sidebarLabel`、`navLabel`、`openLabel` 和 `closeLabel`。',
  [fingerprint(
    'Both landmark names were hardcoded English. Two `complementary` landmarks with the same name cannot be told apart, which is exactly the pair a shell rendered inside another page makes — a preview, a screenshot harness — and it was the only part of the component a non-English app could not translate.',
  )]:
    '两个地标的名字之前都是写死的英文。两个同名的 `complementary` 地标是无法区分的，而一个渲染在另一个页面内部的外壳——一个预览、一套截图夹具——造出来的恰好就是这一对；这也是这个组件里唯一一处非英语应用翻译不了的地方。',

  // ─── 0.4.0 ───
  [fingerprint('One radius ladder driven by one factor, a calendar that picks a month in place of the grid, a reading surface for long-form content, and a numbered rail for the sequences a diagram should not be drawing.')]:
    '一条由单一系数驱动的圆角阶梯、一个用月份网格就地替换日期网格的日历、一个长文阅读版面，以及一条带编号的轨道——那些本来就不该用图去画的顺序。',
  [fingerprint('**The radius is a ladder now, and a theme moves one number.** The four steps were four independent values, and the radius theme re-typed all four — so nothing held them in proportion and a corner nested inside another corner was right at the one setting somebody checked and wrong at every other. Every step is now `calc(<n>px * var(--radius-factor))` — 4, 6, 8, 12 and the pill, which is where Tailwind\'s scale, shadcn\'s `--radius` ± 2 and ± 4, Radix Themes\' steps 3 and 4 and Material\'s `xs`/`sm`/`md` all land within a pixel of each other. `sharp` sets the factor to `0` and `round` to `2`, and the pill is on the ladder with everything else: a square theme that left every button a capsule was not a square theme. A true circle — an avatar, a status dot, a spinner, a radio — is geometry and stays round.')]:
    '**圆角现在是一条阶梯，一个主题只动一个数。** 原本四级是四个各自独立的值，圆角主题会把四个全部重写一遍——于是没有任何东西维持它们之间的比例，一个套在另一个圆角里的圆角，只在某人检查过的那一档是对的，其余每一档都是错的。现在每一级都是 `calc(<n>px * var(--radius-factor))`——4、6、8、12 以及药丸形，这也正是 Tailwind 的尺度、shadcn 的 `--radius` ±2 与 ±4、Radix Themes 的第 3 与第 4 级、Material 的 `xs`/`sm`/`md` 彼此相差不到一个像素的落点。`sharp` 把系数设为 `0`，`round` 设为 `2`；药丸形和其他一切一样在这条阶梯上：一个把每个按钮都留成胶囊的直角主题，不是直角主题。真正的圆——头像、状态点、spinner、单选框——是几何形状，保持圆形。',
  [fingerprint('**`Button` now draws `--radius`, the control step**, which is the same corner an `Input`, a `Select` trigger and a `Textarea` draw. It was a pill, and a pill beside an 8px field is two different ideas of what a control is — the one inconsistency in the system that every reader noticed and no component page could explain. The capsule is kept for the things that genuinely are one: a badge, a status pill, a segmented strip, a progress track. `Calendar`\'s own chrome buttons follow, and its caption arrows are now the same height as the month they sit beside rather than ten pixels above it.')]:
    '**`Button` 现在画的是 `--radius`，也就是控件那一级**，和 `Input`、`Select` 触发器、`Textarea` 画的是同一个角。它以前是药丸形，而一个药丸紧挨着一个 8px 的字段，是关于「控件是什么」的两种不同想法——这是整套系统里每个读者都注意到、却没有任何一个组件页解释得了的那处不一致。胶囊形留给那些本来就是胶囊的东西：徽章、状态药丸、分段条、进度轨道。`Calendar` 自己的控件按钮跟着改，它标题栏的箭头现在和旁边的月份等高，而不是高出十个像素。',
  [fingerprint('Two rounded edges separated by a gap of `p` are concentric only when the inner radius is the outer minus `p`. Both directions are named rather than left for each surface to guess: `--radius-row` subtracts (a row inside a panel padded by 6px) and `--radius-frame` adds (a frame sitting 16px outside a `--radius-lg` panel), with the adding one gated so a square theme stays square. Menus, popovers, selects and the command palette now round their panel at `--radius-lg` and their rows at `--radius-row`, which is the pairing that actually holds at every setting.')]:
    '两条被 `p` 的间距隔开的圆边，只有在内圆角等于外圆角减去 `p` 时才是同心的。两个方向都被命名了，而不是留给每个表面自己去猜：`--radius-row` 做减法（一行嵌在内边距 6px 的面板里），`--radius-frame` 做加法（一个框套在 `--radius-lg` 面板外 16px 处），并且加法那一侧加了闸门，好让直角主题保持直角。菜单、popover、select 和命令面板现在面板用 `--radius-lg`、行用 `--radius-row`，这才是在每一档设置下都成立的配对。',
  [fingerprint('The ladder is declared for `:root` **and** `[data-radius]`. A custom property substitutes `var()` where it is declared, so a ladder written only on the root bakes the root\'s factor in and a themed subtree never reaches its own — which is exactly what the themes page does, five radii on five wrappers.')]:
    '这条阶梯为 `:root` **和** `[data-radius]` 各声明了一遍。自定义属性会在**声明它的地方**代换 `var()`，所以只写在根上的阶梯会把根的系数烤死，被主题化的子树永远够不到自己的那个——而这恰恰是主题页在做的事：五个包装元素上的五种圆角。',
  [fingerprint('**New `Article`** — the long-form reading surface. Everything a Markdown pipeline emits, set in this system\'s type, colour and rules: headings and their anchors, lists, tables, quotations, code, figures, footnotes and MathML. The styles ship as `@misoto22/design/article.css` and are scoped to a data attribute, so a site with its own pipeline can take the reading surface without taking the components.')]:
    '**新增 `Article`**——长文阅读版面。Markdown 流水线会吐出的一切，都用这套系统的字体、颜色和分隔线来排：标题及其锚点、列表、表格、引文、代码、图注、脚注和 MathML。样式作为 `@misoto22/design/article.css` 单独发布，并限定在一个 data 属性下，所以一个已经有自己流水线的站点，可以只取这个阅读版面而不取组件。',
  [fingerprint('**New `Diagram`** — a flow or architecture figure drawn from the system\'s own parts. Nesting is containment and an edge is a step between siblings; it takes a spec rather than markup, so a fenced ```diagram block and a hand-written figure are one renderer, and it server-renders because it is markup rather than a canvas.')]:
    '**新增 `Diagram`**——用系统自己的部件画出的流程或架构图。嵌套表示包含，连线表示同级之间的一步；它接受的是一份描述而不是标记，所以一个 ```diagram 代码块和一张手写的图共用同一个渲染器，而且因为它是标记而不是画布，它能在服务端渲染。',
  [fingerprint('**`Calendar` picks a month in place of the grid.** The month and year were two `Select`s that portalled a ten-rem list over the calendar — three visible months out of twelve, with a scroll arrow at each end, floating on top of the thing the reader opened it to change. The caption is now one control reading "September 2026", and it swaps the day grid for a 3×4 month grid or a 4×6 year grid at the same size. Nothing overlaps, nothing scrolls, Escape closes it and hands focus back, and the year pages tile the range from its first year so every year in the span is reachable — the old arrangement could offer a year it never showed.')]:
    '**`Calendar` 用月份网格就地替换日期网格。** 月份和年份原本是两个 `Select`，会把一个十 rem 高的列表浮到日历上方——十二个月里只看得见三个，两端各一个滚动箭头，飘在读者正是为了改它才打开面板的那个东西上面。现在标题栏是一个写着「September 2026」的单一控件，点开后在同样的尺寸里把日期网格换成 3×4 的月份网格或 4×6 的年份网格。没有遮挡，没有滚动，Escape 关闭并把焦点交回去；年份分页从范围的第一年开始铺，所以跨度里的每一年都够得到——旧的排法可能给出一个它自己从来没显示过的年份。',
  [fingerprint('The picker BROWSES; it does not navigate. Stepping the year moves the grid under the arrows and leaves the calendar where it was, so one click does one thing: choosing a month is what moves the calendar and closes the panel. It used to navigate and close on the arrow, which meant `‹` on "2026" left the reader looking at a different month with the picker gone.')]:
    '这个选择器是在**浏览**，不是在导航。翻年份只是让箭头下方的网格移动，日历本身留在原地，所以一次点击只做一件事：选中某个月份才会移动日历并关闭面板。它以前是按箭头就导航并关闭，于是在「2026」上点 `‹`，读者抬头看到的是另一个月份，而面板已经没了。',
  [fingerprint('**New `Steps`** — a numbered sequence as a rail: a marker, a rule through them, a name and a line of detail. It is the figure a technical page reaches for after a diagram and is not one, because nothing branches and nothing points at anything; drawing an order with boxes and arrows says otherwise. An `<ol>`, with the connector on the item so it stops between markers rather than running through them and off the end.')]:
    '**新增 `Steps`**——把一个带编号的顺序做成一条轨道：一个标记点、一条贯穿它们的线、一个名称和一行细节。这是技术页面在图之后会伸手去拿、但它本身并不是图的那种图形，因为没有分支、也没有任何东西指向任何东西；用方框和箭头去画一个顺序，说的是另一回事。它是一个 `<ol>`，连接线挂在条目上，所以线止于标记点之间，而不是穿过它们、再从末端跑出去。',
  [fingerprint('**New floating-surface tokens, and a glass theme that spends them.** `--panel-bg`, `--panel-border` and `--panel-filter` are what a surface that FLOATS fills with and what it does to whatever is behind it — read by `Dialog`, `Sheet`, `Popover`, `DropdownMenu`, `ContextMenu`, `Select` and `Command`, and by nothing that sits in the page, because a card has nothing behind it to treat. All three default to the plain surface, and `--panel-filter: none` is not a blur of zero: any `backdrop-filter` value promotes its element to a compositing layer and makes it a containing block for fixed descendants, which is a cost every menu would pay for a theme most readers never turn on.')]:
    '**新增浮层表面的 token，以及一个花掉它们的玻璃主题。** `--panel-bg`、`--panel-border` 和 `--panel-filter` 是一个**浮起来**的表面用什么填充、以及它对身后的东西做什么——由 `Dialog`、`Sheet`、`Popover`、`DropdownMenu`、`ContextMenu`、`Select` 和 `Command` 读取，页面里坐着不动的东西一概不读，因为一张卡片身后没有任何东西需要处理。三者都默认取普通表面，而 `--panel-filter: none` 不等于零模糊：任何 `backdrop-filter` 值都会把元素提升为合成层，并使它成为固定定位后代的包含块——这个代价，会由每一个菜单为一个大多数读者从不打开的主题付掉。',
  [fingerprint('`[data-surface=\'glass\']` then sets a translucent panel, a specular edge and `blur(20px) saturate(180%)`. It does not break law 2: the blur is not UNDER a surface pretending to be a shadow, it is BEHIND one. A shadow claims a light source this system does not have; a frosted panel claims a material, and says honestly that the page is still there behind it.')]:
    '`[data-surface=\'glass\']` 于是设上半透明面板、一道高光边缘和 `blur(20px) saturate(180%)`。它没有违反法则 2：这层模糊不是**垫在**某个表面下面假装成阴影，而是**透过**它看到的。阴影宣称有一个这套系统并不存在的光源；磨砂面板宣称的是一种材质，并且诚实地说：页面还在它后面。',
  [fingerprint('`Collapsible` also exports `CollapsibleTrigger` and `CollapsibleContent`, for a disclosure that needs its own header layout.')]:
    '`Collapsible` 同时导出 `CollapsibleTrigger` 和 `CollapsibleContent`，供需要自己排头部布局的展开块使用。',
  [fingerprint('**`FigureBand` reaches four columns again.** Its container query was declared on the same element it queried, which can never match, so the band stayed two columns at every width — four figures on a full page came out as a 2×2 block with a hole in it.')]:
    '**`FigureBand` 又能排到四列了。** 它的容器查询声明在它自己要查询的那个元素上，而那是永远匹配不到的，所以这条带子在任何宽度下都停在两列——整页宽度下的四个数字，出来是一个中间带洞的 2×2 方块。',
  [fingerprint('`ToggleGroup`\'s sliding pill lands on its segment inside a scaled container.')]:
    '`ToggleGroup` 的滑动药丸在被缩放的容器里也能落到它自己那一段上。',
  [fingerprint('The indicator measured with `getBoundingClientRect`, which reports visual pixels, and positioned with `transform`, which is interpreted in the element\'s own coordinate space. Inside anything zoomed or scaled — a thumbnail, a device preview — the two disagreed by exactly the scale factor and the pill sat short of its segment. It now accumulates layout offsets up to the strip instead.')]:
    '指示器用 `getBoundingClientRect` 测量——它返回的是视觉像素——却用 `transform` 定位，而后者是在元素自身的坐标系里解释的。在任何被 zoom 或 scale 过的东西里面——一张缩略图、一个设备预览——两者恰好差了一个缩放系数，药丸就落在它那一段的前面。现在改成向上累加布局偏移到那条strip为止。',
  // ─── Section headings ───
  [fingerprint('Minor Changes')]: '次要变更',
  [fingerprint('Patch Changes')]: '补丁变更',
  [fingerprint('Changed')]: '变更',
  [fingerprint('Added')]: '新增',
  [fingerprint('Fixed')]: '修复',

  // ─── 0.4.0 ───
  cd289de0:
    '一条由一个因子驱动的圆角阶梯、一本用选月份代替翻月网格的日历、一个长文阅读面，以及一条编号轨——给那些图不该拿去画的顺序用。',
  '26d31c1e':
    '**圆角现在是一条阶梯，一个主题只改一个数。** 原来四档是四个彼此独立的值，圆角主题把四个全部重打一遍——于是没有任何东西维持它们之间的比例，一个嵌在另一个里面的圆角，只在某个有人检查过的设置下是对的，在其余每一个设置下都是错的。现在每一档都是 `calc(<n>px * var(--radius-factor))`——4、6、8、12 加上胶囊，而这几个数正是 Tailwind 的刻度、shadcn 的 `--radius` ± 2 和 ± 4、Radix Themes 的第 3、第 4 档，以及 Material 的 `xs`/`sm`/`md` 彼此相差不超过一个像素的地方。`sharp` 把因子设成 `0`，`round` 设成 `2`；胶囊和其它所有东西一样待在这条阶梯上：一个把每个按钮都留成胶囊的方形主题，不是方形主题。真正的圆——头像、状态点、加载圈、单选框——是几何，所以还是圆的。',
  '652a3af8':
    '**`Button` 现在画 `--radius`，也就是控件那一档**，和它旁边的 `Input`、`Select` 触发器、`Textarea` 画的是同一个角。它以前是胶囊，而一个胶囊挨着一个 8px 的输入框，是对「控件是什么」的两种不同说法——这是整套系统里每个读者都注意到、却没有任何一个组件页解释得了的那处不一致。胶囊留给那些本来就是胶囊的东西：徽章、状态胶囊、分段控件、进度条。`Calendar` 自己的那几个控制按钮跟着一起改了，而且它标题栏的箭头现在和旁边的月份一样高，不再高出十个像素。',
  aeed6e28:
    '两条相隔 `p` 的圆角边，只有当内圆角等于外圆角减去 `p` 时才是同心的。两个方向都起了名字，而不是留给每个表面自己去猜：`--radius-row` 做减法（一个内边距 6px 的面板里的一行），`--radius-frame` 做加法（一个套在 `--radius-lg` 面板外 16px 的框），做加法的那个带了闸门，所以方形主题仍然是方的。菜单、浮层、下拉和命令面板现在面板用 `--radius-lg`、行用 `--radius-row`，这一对在每一个设置下都真的成立。',
  '57fb5882':
    '这条阶梯为 `:root` **和** `[data-radius]` 各声明了一次。自定义属性是在它被声明的地方代入 `var()` 的，所以一条只写在根上的阶梯会把根的因子烘进去，一棵带主题的子树永远够不到自己的那个——而主题页做的正是这件事：五个包装元素上五种圆角。',
  c1e609a7:
    '**新增 `Article`**——长文阅读面。一条 Markdown 管线能产出的一切，都套上这套系统的字体、颜色和线：标题和它们的锚点、列表、表格、引文、代码、图注、脚注，以及 MathML。这套样式单独发布为 `@misoto22/design/article.css`，并且限定在一个 data 属性下，所以一个自带管线的站点可以只拿阅读面、不拿组件。',
  a99fd011:
    '**新增 `Diagram`**——一张用系统自己的零件画出来的流程图或架构图。嵌套即包含，箭头是相邻兄弟之间的一步；它接受一份 spec 而不是标记，所以文章里的 diagram 代码块和页面上手写的图是同一个渲染器，而且因为它是标记而不是画布，服务端就能渲染。',
  f92bda38:
    '**`Calendar` 用选月份代替了翻月网格。** 月份和年份原来是两个 `Select`，它们会把一个十来 rem 高的列表 portal 到日历上方——十二个月里只看得见三个，两端各一个滚动箭头，而且正盖在读者打开它就是为了改的那个东西上面。标题栏现在是一个控件，写着「2026 年 9 月」，点开它会把日期网格换成同样大小的 3×4 月份网格或 4×6 年份网格。没有东西重叠，没有东西要滚动，Escape 关掉它并把焦点交还；年份分页从范围的第一年开始铺，所以跨度里的每一年都够得到——旧的那套会给出一个它从来不显示的年份。',
  '087d657a':
    '这个选择器是在浏览，不是在导航。步进年份只是把箭头下面的网格换掉，日历留在原处，所以一次点击只做一件事：选中一个月份才会移动日历并关掉面板。旧的做法是点箭头就导航加关闭，意思是在「2026」上点 `‹`，读者会发现自己在看另一个月，而选择器已经没了。',
  '9a45dde7':
    '**新增 `Steps`**——把一个编号序列画成一条轨：一个标记、一条穿过它们的线、一个名字，和一行细节。这是技术页面在图之后会伸手去拿、而它本身并不是图的那种图形，因为没有任何东西分叉、也没有任何东西指向任何东西；用方框加箭头去画一个顺序，说的是另一回事。它是一个 `<ol>`，连接线挂在条目上，所以线停在两个标记之间，而不是从头贯穿到底再甩出去。',
  '6cd58766':
    '**新增浮层表面的 token，以及一个把它们花出去的 glass 主题。** `--panel-bg`、`--panel-border` 和 `--panel-filter` 说的是一个浮着的表面用什么填充、以及它对身后的东西做什么——由 `Dialog`、`Sheet`、`Popover`、`DropdownMenu`、`ContextMenu`、`Select` 和 `Command` 读取，而任何待在页面里的东西都不读，因为一张卡片身后没有东西需要处理。三个默认都取普通表面；而 `--panel-filter: none` 不是「模糊半径为零」：任何 `backdrop-filter` 值都会把它所在的元素提升成一个合成层，并让它成为 fixed 后代的包含块——这是每一个菜单都要为一个大多数读者从不打开的主题付的代价。',
  d9a77cf9:
    "`[data-surface='glass']` 随后设置一块半透明面板、一道高光边，以及 `blur(20px) saturate(180%)`。它没有破坏第 2 条法则：这团模糊不是垫在一个表面**下面**假装成阴影，而是在它**后面**。阴影宣称有一个这套系统并不存在的光源；一块磨砂面板宣称的是一种材质，并且诚实地说出：页面仍然在它后面。",
  '1a5f15fb':
    '`Collapsible` 现在也导出 `CollapsibleTrigger` 和 `CollapsibleContent`，给需要自己排版头部的展开块用。',
  '81e91548':
    '**`FigureBand` 又能排到四列了。** 它的容器查询声明在它自己要查询的那个元素上，而这永远不可能匹配，于是这条带子在任何宽度下都停在两列——整页宽的四张图排出来是一个 2×2 的块，中间还空着一处。',

  e26beae7: '`ToggleGroup` 的滑动胶囊，在缩放过的容器里也能落在自己那一段上了。',
  c352b760:
    '指示器用 `getBoundingClientRect` 测量，它报的是视觉像素；又用 `transform` 定位，而 transform 是在元素自己的坐标系里解释的。在任何被缩放过的东西里面——一张缩略图、一个设备预览——两者正好差一个缩放系数，胶囊就落在它那一段前面。现在改成向上累加到整条控件为止的布局偏移。',

  // ─── 0.3.1 ───
  '5ac774fb': '修好表格的列间距——一个没带单位的零一直在悄悄把它吃掉。',
  d0491473:
    '`--table-pad-x` 写的是 `0` 而不是 `0px`。单元格的分割线会在一个 calc 里加到它上面，于是解析成 `calc(0 + 1.5rem)`——在计算值阶段就是无效的，而这会**整条丢掉**声明，不是退回默认值。所以每一张 `borders="rows"` 或 `borders="none"` 的表格里，除最后一个以外的每个单元格都完全没有 `padding-inline-end`，一个 `align="end"` 的列会直接顶在邻居身上。带边框的那几种没事，因为它们把这个变量设成了 `0.75rem`，单位跟着一起来了。',

  cad31ded: '走了一遍线上站点，修掉十个问题。',
  '9944fede':
    '`FigureBand` 塌成了两列零宽、文字互相重叠。它声明了 `@container`，而容器查询会在**不看内容**的情况下计算自身宽度——作为一个按内容收缩的 flex 子项，那个宽度解析成了 0。',
  '2b886cab': '反色 `plate` 上的 `CardTitle` 是墨色压近黑色，对比度 1.25:1。',
  '91c81c74':
    '`ToggleGroup` 会被它的 flex 父级拉满，最后一段之后留下一片死区。`inline-flex` 并不能退出这种拉伸，`w-fit` 才可以。',
  bada2098: '锚定的面板从它的触发器长出来，现在收回去时也有动画了。',
  d7501450:
    '`Select` 接受 `contentClassName`，日历的年份列表用上了它：默认那 18rem 会盖住读者正是为了改它才打开的那本日历。',
  '92c8d148':
    '`Combobox` 和 `SearchableMenu` 给自己的筛选框起了名字，说明它是干什么的。之前它继承了控件本身的名字，于是读屏用户会遇到两个同名的 combobox，一个套在另一个里面。',
  c12cc3bb: '新增 `scroll-hairline`，给有边界的面板用；命令面板已经在用它。',

  // ─── 0.3.0 ───
  '02de5ed5': '可配置的 Table、一个可搜索的动作菜单，以及日历/日期选择器的修复。',
  e9c789af:
    '`Table` 接受 `borders`（`rows` | `grid` | `bordered` | `bordered-grid` | `none`）、`density`、按列的 `align`，以及按列开启的 `sortable` 配 `sortDirection` / `onSort`。所有分割线都画在外层，所以组件仍然可以在服务端渲染。',
  ef19a5bc:
    '新增 `SearchableMenu`：一个可筛选的动作菜单，用于 `DropdownMenu` 已经装不下、而 `Combobox` 又不合适（它不设置值）的场景。',
  b853d373:
    '`Calendar` 的月份和年份选择器改用我们自己的 `Select`，而不是原生下拉；范围也从整个世纪收成前后各 10 年。',
  '3e6f5e0a':
    '被选中的日期重新变圆。在范围模式下，只选一天时它既是范围起点又是范围终点，两条覆盖规则叠加起来正好等于 `border-radius: 0`。',
  dcb178e0:
    '`DatePicker` 和 `DateRangePicker` 接受 `presets`：一条快捷选项栏（最近 30 天、最近 90 天、年初至今……），点击时才计算，所以“今天”真的是今天。',

  '747f18f4': '`Command` 的每一行都带上了图标和一行注解，面板也会说明每个键做什么。',
  '17ffc9f9':
    '`CommandItem` 接受 `icon` 和 `meta`。四十行纯文字是扫不动的——眼睛先按形状分类，然后才读字。',
  f6684b9f:
    '新增 `CommandFooter` 和 `CommandHint`：一个命令面板需要的按键提示条，因为屏幕上没有任何别的东西会告诉你方向键能移动选中行。',
  '639448fe': '高亮那一行改成读 `--accent` 并带一条前导竖线，而不是一块平铺的灰底。',
  '6d0b2a7a': '`CommandDialog` 更宽了，并且落在偏上的位置——命令面板本来就该在那里。',

  '6fb4ee90': '修好那些画了但没接线的交互，并让“选中”这件事有东西在动。',
  b9524863:
    '`Select` 现在是带样式的那个控件，原生的那个改名 `NativeSelect`。旧的默认值在打开的那一刻就不再属于这套系统了——选项列表是操作系统画的，一个 token 都不读。坚持用原生唯一站得住的理由是键盘约定，而 Radix 把它答上了：首字母跳转、方向键、Home 和 End、以及按 Escape 不选任何东西地关掉。',
  '04417a5f':
    '`Slider` 显示的数字从来不动。它是从 props 上读值的，而一个非受控滑块的 `defaultValue` 不会变——于是滑块在走、数字停在起点，而这恰恰是 `showValue` 存在的意义所要防止的事。',
  ec855ec9:
    '`ToggleGroup` 不管装一个值还是好几个值，长得都一样，所以多选组看起来像坏掉的单选组。现在单值的那条会把**一颗**胶囊在选项之间移动，多值的那条则分别填充每个被按下的选项。`Pagination` 同样处理：一个会移动的形状读起来就是“变的是这个”，而两块背景交叉淡入读起来是两件事。',
  '0a14af02':
    '`Combobox` 可以取多个值，选的时候面板不会关，并且把命令列表裁到自己的圆角里——之前列表的直角一直从面板的圆角里戳出来。',
  e8b25ab4:
    '`Calendar` 改用月份和年份下拉来导航，而不是两个箭头。点二十四下才回到两年前，那不叫导航。它的导航条之前还压在网格上方而不是标题两侧，因为 nav 在 DOM 里排在前面，而且被留在了正常流里。',
  a2d45c1a:
    '新增 `DateRangePicker`。它同时显示两个月，并且只有在真的点过两天之后才关闭——库在**第一次**点击时就会返回 `{ from, to }`，所以一个“是否完整”的判断会立刻把面板关掉，每次都得到一个一天的范围。',
  '432619f4':
    '`Switch` 的滑块在移动时会变窄，`Slider` 的滑块被按住时会变大，所以两者读起来都是“有个东西正在被移动”，而不是一个值忽然跳到了新状态。',

  '345a9217': '把每一个表示“被选中”的表面都接到那唯一的指针上。',
  '3ef99ad7':
    '法则 7 说这套系统只有一个指针，而这个指针就是墨色。可有一半组件是直接读 `--ink` 的——主按钮、勾选框、当前标签页、当前页码、滑块的已填充段、被选中的日期。在强调色**就是**墨色的时候，两者渲染出来一模一样，这正是没人发现的原因，也是为什么这条法则在原则页上成立、在代码里不成立。',
  '90105f6a':
    '它们现在读 `--accent`。默认值下什么都没变，而重新指向这一个 token 就能给整套系统换皮，不用碰任何组件——这才是“有一个指针”的意义。',

  '6b83a24d': '浮层和流体尺度都可以重新挂到一个有边界的框上。',
  d0a67543:
    '新增 `OverlayContainer`：指明 `Popover`、`Select`、`DropdownMenu`、`ContextMenu` 和 `Tooltip` 应该渲染进哪个元素。面板于是跟那个元素的边界碰撞，而不是跟视口，并且会继承它上面设的 `dir` 和 `data-density`。`Dialog` 和 `Sheet` 仍然覆盖整个视口——它们本来就是干这个的。',
  f73437e8:
    '新增 `--fluid` token，默认 `1vw`。一个声明了 `container-type: inline-size` 的框，只要在它内部某个带 `data-fluid-frame` 的元素上把 `--fluid` 设成 `1cqi`，整条字号与间距的坡道就会重新以这个框的宽度为基准。',
  '9f7a38e7':
    '`FigureBand` 是一个查询容器，读的是它自己的宽度，所以“一排放四个数字”是关于这条带子的决定，而不是关于窗口的。',

  '0181fe40': '改为公开发布到 npmjs，不再发到 GitHub Packages。',
  ea0872f6:
    '这个仓库已经公开、并且是 MIT 协议有一阵子了，但它发出去的包却被限制在一个需要 token 才能读的 registry 上——于是安装说明与其说是一条命令，不如说是一道门。现在它带着 `access: public` 发到默认 registry，任何客户端不用 `.npmrc` 就能读。',
  e7b51d98:
    '对已经在安装它的人有两点影响。scope 不再需要指向任何地方，所以消费方 `.npmrc` 里的 `@misoto22:registry` 和 `_authToken` 两行可以删掉；而已经发到 GitHub Packages 的那些版本原地不动——没有搬迁任何东西，`0.3.0` 是 npmjs 上的第一个版本。',
  f2c4913f:
    'manifest 里的 `description` 也改了。它、仓库的 About 字段、README 的开头各写着一句不同的话，所以其中总有两句是过时的；现在三处说同一句，而且不再带组件数量——一个写在 manifest 里的数字没有任何东西能校对它，事实上已经差了两个。',

  d8e562ba: '新增 `themes.css`：主题不再只是强调色。',
  '65d60ced':
    '六条轴，每一条都是一个属性，把包里已经定义好的 token 重新指向别处——`data-surface`、`data-radius`、`data-rules`、`data-type`、`data-motion`，以及已有的 `data-density`。没有任何组件读它们，这一层也不引入自己的 token；主题是重新指向，不是发明。',
  '90367361':
    '没有任何东西锚定在 `:root` 上，所以一条轴可以放在任意元素上，它下面的子树就跟着变。正是这一点让一个页面能并排印出五种主题，而不需要五个文档。',
  dea0c449: '可以通过 `@misoto22/design/themes.css` 单独引入，也已经打包进 `styles.css`。',

  // ─── 0.2.0 ───
  '922cdf32': '新增十一个组件，并让表格真正做到一张表格该做的事。',
  '813f033a':
    '`Popover`、`Sheet`、`ContextMenu`、`Command`（⌘K 面板）、`Combobox`、`Slider`、`ToggleGroup`、`Collapsible`、`ScrollArea`、`Calendar` 和 `DatePicker`。每一个都写清楚了它最容易和哪个邻居混淆，因为真正有意思的问题很少是“它长什么样”：气泡提示装不下控件；只有一项的手风琴在管理一个没人会读的值；选项不到十几个时原生 select 胜过 combobox；分段控件改的是一个值，而标签页换的是一块面板。',
  '949f8731':
    '`Table` 有了可排序的表头和吸顶的表头行。排序控件是 `<th>` 里面的一个 `<button>`，而不是挂在单元格上的点击回调——带 `onClick` 的单元格既不可聚焦也不会被播报，那样的排序只对鼠标存在——并且它会设置 `aria-sort`，这是读屏用户得知这张表已被排序的唯一途径。',
  '0ce4d9cf':
    '`Dialog` 增加了 `hideTitle`，用于那些“看得见的人一眼就明白它是干什么的”的界面。标题本身仍然是必填的。',
  bfeb0064:
    '浏览器测试在合入路上抓到的两个缺陷：日历里非本月的日期用描边色画，对比度只有 1.38:1；以及 `cmdk` 会在 `role="listbox"` 里面渲染一个 `role="separator"`，这是 ARIA 明令禁止的，等于在每一个命令面板里塞了一条严重级别的违规。',

  '9055034c': '加入密度轴，让每个组件都与书写方向无关，并把 token 以机器可读的形式发出去。',
  f41ae1da:
    '任意容器上写 `data-density="compact"`，它下面的每个控件都会收紧——默认 44px，这是 WCAG 2.5.5 要求的指针目标；紧凑模式 36px，仍然满足 2.5.8，但不再满足 2.5.5。它是给鼠标驱动的密集桌面工具用的，文档如实这么写，而不是把它说成白拿的好处。',
  '4c73d817':
    '每个组件现在都用逻辑属性，所以 `dir="rtl"` 不需要任何额外样式表就能镜像整套系统。一个源码测试会在出现物理属性、或出现没有配对 `rtl:` 的行内轴 transform 时让构建失败；另一个浏览器测试检查结果是否真的镜像了——这是源码测试做不到的。',
  d090c1e5:
    '`@misoto22/design/tokens` 导出每一个 token 及其亮色值、暗色值、分类和解释性注释，既有 JSON 也有带类型的模块——供 Figma 同步、原生应用，或者任何需要这些值却读不了样式表的消费方使用。文档站现在读的是这份产物，而不是再解析一遍 CSS，所以站点和包不可能再对“某个 token 是什么”产生分歧。',
  '87103575':
    '`FloatingIconButton` 的 `position` 从 `left` / `right` 改成了 `start` / `end`，这样这个 API 就不会把某一种文字方向写死。',

  a2fda076:
    '给这个包补上许可证、发布目标和更新日志。它采用 MIT 协议，以 `@misoto22` scope 发布到 GitHub Packages，并由 changesets 管理版本——这样使用者既能装得上，也能不翻提交记录就知道两个版本之间改了什么。',
  '875b5289': '给构建加上体积与 tree-shaking 预算（`pnpm check:size`）。',
  c081a887:
    '绝对数字是无聊的那一半，有用的是比例：把单个组件打包出来跟整个包比，是唯一能发现 tree shaking 已经悄悄失效的办法——一次桶文件导入、入口里一个副作用，每个使用者就都会为了渲染一个徽章而把整个日历打进去。这种事在代码评审里看不见，几个月后才以“谁也解释不了的包体积”的形式冒出来。',
  d12c564f: '修复三个只有真实浏览器能看见、jsdom 测试看不见的缺陷。',
  e2c68ef8:
    '`Table` 的滚动容器键盘够不着：一个可滚动区域，如果里面的内容本身不可聚焦，就没有任何东西可以 Tab 过去，于是对不用鼠标的人来说，折叠线之外的每一列都不存在。现在它是一个可聚焦、有名字的区域。',
  '5e7ce649':
    '`RadioGroup` 用方向键移动了焦点，却没有移动选中项。上游原语把这件事挂在一个由 `keyup` 清除的标志上，而它跑不赢自己的焦点移动——一次正常的按键在 React 提交之前就已经抬起，所以外框移动了、什么都没被选中。改成用时间戳记录，就不会在焦点处理器脚下被清掉。',
  c03ed7f7:
    '`AppShell` 会渲染一个 `<main>`，这对一个应用外壳是对的，对一个嵌在别的页面里的外壳是错的——一个文档只能有一个。现在它接受 `contentAs`。',

  // ─── 0.1.0 ───
  '9000ad5d': '第一个与它从中抽取出来的那个站点相符的版本。',
  '1d662f45':
    '**把 token 层重新移植到归白。** 这个包一直发的是已经退役的暖奶油主题——oklch 表面、8/12/18px 的圆角刻度、带模糊的高度坡道。任何照着它做出来的东西，从构造上就是偏离品牌的。',
  '11b8ec17':
    '**把 token 和语义拆开。** `tokens.css` 放原始值，`semantic.css` 放角色，组件只读角色——正是这一点让暗色模式成为一次数值互换，而不是第二套配色。',
  c4e3a74d:
    '**换掉了字体**，改用 Hanken Grotesk、Newsreader 和 IBM Plex Mono，由一个脚本负责内嵌并管理字重清单。',
  '20fc95b4':
    '十四个原语：`Skeleton`、`Progress`、`Alert`、`Tooltip`、`Table`、`Breadcrumb`、`Pagination`、`Accordion`、`RadioGroup`、`Avatar`、`Separator`、`Kbd`、`LinkArrow`、`FigureBand`。',
  b059f49f: '`cn`——现在每个组件的 class 列表最后都要经过的那个合并器。',
  f1cab993: '`CONTROL_BASE` / `CONTROL_BORDER` / `isInvalid`——共用的文本控件外观。',
  '09d6f69f':
    '一个文档站，地址是 [ui.misoto22.com](https://ui.misoto22.com)，由这个包自己的源码生成。',
  '578ab284':
    '**在没有 `next/font` 的宿主里，字体栈会整条塌回系统字体。** 没有兜底的 `var(--font-hanken)` 在计算值阶段就是无效的，而 IACVT 丢掉的是整条声明，不是那一项。',
  '44995bbe':
    '**每一个 `hover:shadow-(--shadow)` 都是空转。** 这个 token 解析出来是 `none`，所以那些悬停状态一直是看不见的，却还在为一次过渡付费。',
  b42e8429:
    '**调用方传的 `className` 不一定能覆盖。** `clsx` 会把冲突的两边都输出，然后交给样式表顺序去裁决；`cn` 按工具类分组合并。',
  c243e6f2:
    '**没有显式 `htmlFor` 时，`Field` 什么都不播报。** 提示信息的 id 是从它推出来的，所以提示渲染出来了，却从来没有被念过。',
  '62d0c9f8': '**省略 `icon` 时 `NavItem asChild` 什么都不渲染**——两个子元素进了一个只允许一个的 Slot。',
  '7fe8f132':
    '**Input、Textarea 和 Select 已经各走各的了**：聚焦和禁用的处理各不相同，每个都揣着一份自己的控件 class 字符串。',
  '9eb63729': '`Spinner` 是一个强调色的环，而这套系统的强调色是墨色。',
  [fingerprint(
    '`Heatmap` lays its grid out as a fixed table now, so its cells keep a real width instead of collapsing to 0px.',
  )]: '`Heatmap` 现在把网格排成一张固定布局的表格，好让每一格都保住一个真实的宽度，而不是塌缩成 0px。',
  [fingerprint(
    "Every cell's printed reading is `sr-only`, so automatic table layout had no content to size a data column by and handed the row-header column all the slack it could find. Measured in a consumer at 1440px: 919 of 1035px went to the header, and every one of a year calendar's 392 cells came out 0px wide — an invisible grid. `CalendarHeatmap` inherits `Heatmap`, so it carried the same defect.",
  )]: '每一格里打印出来的读数都是 `sr-only` 的，于是自动表格布局找不到内容来决定数据列的宽度，就把所有能找到的余量都让给了行标题列。在一个使用方那边按 1440px 实测：1035px 里有 919px 分给了表头，而一年日历的 392 格无一例外都算成了 0px 宽——一张看不见的网格。`CalendarHeatmap` 继承自 `Heatmap`，所以带着同一个缺陷。',
  [fingerprint(
    "The row-header column gets its width from a `colgroup` rather than from a cell, because fixed layout only ever reads a column's width off a cell in the table's first row, and that row's own corner cell is `sr-only` — `position: absolute` — so a width placed there was never seen. A `col` is read regardless of which cell in the column, or which row, is hidden.",
  )]: '行标题列的宽度来自一个 `colgroup`，而不是某个单元格，因为固定布局只会从表格第一行里的某个单元格读取列宽，而那一行自己的角落单元格是 `sr-only` 的——`position: absolute`——放在那里的宽度从来不会被看到。`col` 则不管列里哪个单元格、或者哪一行被隐藏，都照样会被读到。',
  [fingerprint(
    '`SiteNavigation` takes its width from its containing block, so a transformed or contained frame keeps the whole masthead inside it.',
  )]: '`SiteNavigation` 现在按包含块取宽度，于是放在做了变换或包含的框里时，整条页头都会留在框内。',
  [fingerprint(
    "The header pinned itself to `window.innerWidth` so that an overlay's scroll lock could not change its width in a WebView. That is right against the viewport and wrong anywhere else: under an ancestor with a `transform` or `contain: layout` — a device preview, an embedded console, a documentation card — a fixed header is laid out against that ancestor, and a window-wide width pushed its links and preferences out past the frame's edge.",
  )]: '页头原先把自己的宽度钉在 `window.innerWidth` 上，好让浮层的滚动锁定不会在 WebView 里改变它的宽度。这对视口是对的，换到别处就错了：祖先元素带有 `transform` 或 `contain: layout` 时——设备预览、嵌入式控制台、文档里的示例卡片——fixed 页头是相对那个祖先来布局的，而一个与窗口同宽的宽度，把它的链接和偏好设置推出了框的边缘。',
  [fingerprint(
    "It now pins a width only when the stylesheet's `inline-size: 100%` already resolves to the viewport, and otherwise leaves the width to the containing block.",
  )]: '现在只有当样式表里的 `inline-size: 100%` 本来就解析为视口宽度时，它才会钉住宽度；否则就把宽度交给包含块。',
  [fingerprint(
    "`CommandItem`'s active-row accent bar now clips to the row's own corner radius, so it no longer pokes past a rounded highlight.",
  )]: '`CommandItem` 高亮行左侧的强调竖线现在会按行自身的圆角裁切，不再在圆角主题下探出高亮区域。',
  [fingerprint(
    'The bar is an absolutely-positioned `::before`, and a rounded parent does not clip an absolutely-positioned child by default — only `overflow-hidden` on the row does. At `data-radius="round"`, `--radius-row` reaches 18px and the bar\'s flat edge stuck out past the highlight\'s curve by close to 7px; at the default radius the miss was under a pixel, and at `sharp` there was none, which is why the defect went unnoticed until the round theme was checked directly.',
  )]: '这根竖线是一个绝对定位的 `::before`，圆角父元素默认并不会裁切绝对定位的子元素——只有在行自身加上 `overflow-hidden` 才会。在 `data-radius="round"` 下，`--radius-row` 达到 18px，竖线的直边会探出高亮曲线将近 7px；在默认圆角下这个偏差不到 1px，在 `sharp` 下则完全没有——这正是这个缺陷直到直接检查圆角主题才被发现的原因。',
  [fingerprint(
    "Every other child — icon, meta, shortcut — stays clear of the newly-clipped corners at every radius, the closest any of them comes to a corner's arc centre being about 7px on an 18px arc. The focus ring is unaffected too: `outline` paints outside an element's border box, which its own `overflow` never clips. `Combobox` and `SearchableMenu` render their rows through this same `CommandItem`, so both pick up the fix without a separate change; `DropdownMenu`, `ContextMenu`, `Select`, `NavItem` and `Sidebar` highlight a row with a plain background fill and carry no accent bar, so none of them shared the defect.",
  )]: '行内其余的子元素——图标、说明文字、快捷键——在任何圆角下都离新裁切的角很远，其中离圆角弧心最近的一个，在 18px 的弧上也留了约 7px 的余量。焦点环同样不受影响：`outline` 画在元素边框盒之外，不会被元素自身的 `overflow` 裁掉。`Combobox` 和 `SearchableMenu` 的行都经由同一个 `CommandItem` 渲染，所以两者都无需单独改动就一并修好；`DropdownMenu`、`ContextMenu`、`Select`、`NavItem` 和 `Sidebar` 高亮一行用的是纯背景填色，没有这根强调竖线，因此都不受此缺陷影响。',
}

/** The English a translation was made from, for the orphan check. */
export const CHANGELOG_ZH = ZH

/**
 * The Chinese for one changelog string, or the English when there is none.
 *
 * Falling back rather than failing is the point: an untranslated line is
 * readable, and a stale one is not.
 */
export function changelogText(locale: Locale, english: string): string {
  if (locale !== 'zh') return english
  return ZH[fingerprint(english)] ?? english
}
