/**
 * The Overlays group of the Chinese catalogue — 浮层 — and nothing else.
 *
 * `content.ts` is still the module every consumer imports. It keeps
 * `ComponentCopyZh`, the foundations, the page copy and the lookups, and
 * assembles `COMPONENTS_ZH` by spreading these ten files in `GROUPS_ZH`
 * order. Nothing imports this one directly.
 *
 * A group is the unit for the same reason it is in the package's own
 * `agent/catalog/overlays.mjs`, which this file mirrors slug for slug and in the
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

export const OVERLAYS_ZH: Record<string, ComponentCopyZh> = {
  dialog: {
    name: '对话框',
    summary: ['1564c537', '一个模态表面：portal、遮罩、居中面板。'],
    accessibility: [['4d68e62a', '焦点陷阱、Escape、滚动锁定和 aria-modal 都由 Radix 负责。'], ['ee8fdf8e', '没有可见标题的对话框仍然会渲染一个隐藏标题，而不是交付一个没有名字的模态。']],
    keyboard: [['fecab73a', '关闭对话框，焦点回到它来的那个触发器。'], ['a097538c', '在对话框内部循环；打开期间焦点出不去。']],
    anatomy: [
      { hash: 'f27b555c', element: '遮罩', description: '铺满视口的那层 --scrim，停在 --z-overlay（200）。点击外部落在的就是它，而页面钉在这一档以下的所有东西都会被它盖住——包括停在 100 的 FloatingIconButton。锚定面板不在此列：那些停在 220，正是为了让在这个对话框里打开的 Select 依然够得到。' },
      { hash: '48cbbd47', element: '面板', description: '居中的那个盒子，停在 --z-modal（210），宽度上限 min(92vw, 32rem)，高度上限 85vh，超过就自己滚正文。它靠一次 translate 让自己居中，而这件事对里面任何 fixed 定位的东西都有后果。' },
      { hash: 'd5489aff', element: '标题', description: 'title，渲染成 Radix 的 Title。它一直在：不传 title 时会渲染一个视觉上隐藏的标题，念的就是「Dialog」这个词本身，同时开发环境会警告 DIALOG_TITLE_MISSING——这个兜底存在的意义，是让没名字的模态发不出去，不是让它发得出去。' },
      { hash: 'ad1301e2', element: '描述', description: 'description，标题底下轻声的一行。它和标题共用一个外层容器，所以 hideTitle 是把两个一起藏起来。' },
      { hash: '359e3cd9', element: '关闭', description: '顶部末端角上那个 36px 的 X，在 showClose 为 true（默认值）时渲染，并且自带一个 aria-label「Close」。' },
    ],
    practices: [
      ['5553f97d', '设了 hideTitle 也照样要传 title：完全不传时，兜底的无障碍名称就是「Dialog」这个字面字符串，于是应用里每一个没名字的模态，播报出来都是同一句话——而且它一路还能通过自动化可访问性检查，所以这件事由开发环境发警告，而不是留给评审。'],
      ['d1a40dd2', '取消的那个控件要用 DialogClose 包住，别自己翻一个 state——这样关闭走的是 Radix，焦点会被送回触发器，而不是被丢在文档最开头。'],
      ['88fb0996', '装得下多少就放多少。面板到 32rem × 85vh 就停住，再多就自己滚正文——所以一张长到要滚动的表单，其实已经是一个 Sheet（它拿的是整个视口的高度），或者干脆是一个页面。'],
      ['1d6fb4e8', '除非面板自己给了出口，否则别关掉 showClose：另外两条出路只有 Escape 和遮罩，两个都看不见——所以在一个装满内容的对话框上写 showClose={false}，是一间门上没有标记的房间。'],
      ['72634420', '元素本身没有定位的 OverlayContainer，会把错的那个盒子交给对话框：一旦指定 container，面板就从 fixed 切成 absolute，而一个没有定位的 container 把它送到的是最近那个有定位的祖先——通常就是页面，看起来就像 container 被无视了。'],
      ['5d3bb3a8', '同时开着的两个对话框，先后由 DOM 决定，不是由层级决定：两个都停在 --z-modal，所以后挂载的那个画在先来的那个上面——在对话框之上召出来的命令面板压在上面，只是因为它是第二个打开的；把这个顺序倒过来，画面也跟着倒过来。'],
      ['42e2df9d', '面板靠一次 transform 让自己居中，于是它成了每一个 position: fixed 后代的包含块——扔进对话框里的 FloatingIconButton 会钉在面板的角上，而不是屏幕的角上。'],
    ],
  },
  'dropdown-menu': {
    name: '下拉菜单',
    summary: ['a104453b', '一组动作构成的菜单。'],
    when: ['6de1533d', '动作。会跳转的项属于导航；会设定某个值的是 Select 或 RadioGroup。'],
    accessibility: [['9a8c0730', '在有边界的框里——设备预览、内嵌控制台——用 `<OverlayContainer container={el}>` 包住这棵子树。面板会渲染进那个元素，按它的边界翻转，而不是按视口；框上设的 `dir` 和 `data-density` 也就跟着生效了。'], ['f69dc1e9', '高亮由 data-highlighted 驱动，同时覆盖悬停和键盘焦点——只写 :hover 会让键盘用户看不见自己在哪。'], ['ec2ffde0', 'DropdownMenuGroup 是同时为读屏软件和眼睛把菜单分段的；光一个 Label 只为眼睛分。']],
    keyboard: [['8c8da4a6', '打开菜单并落到第一项。'], ['585f0181', '在菜单项之间移动。'], ['3bdf6c2b', '跳到下一个以该字母开头的项。'], ['2e48bbe4', '关闭菜单并把焦点还给触发器。']],
    anatomy: [
      { hash: '68c335a5', element: '触发器', description: '直接透传给 Radix；不写 asChild，它就渲染自己那个光秃秃的 button。它带着 aria-haspopup 和 data-state，Button 能表现出自己的菜单是开着的，靠的就是这个。' },
      { hash: 'e82ab289', element: '面板', description: 'portal 出去的那个菜单：至少 11rem 宽，离触发器 6px，以 8px 的内边距去撞视口或者 OverlayContainer 的框。它没有最大高度，所以它是翻边，不是滚动。' },
      { hash: '7fbff550', element: '菜单项', description: '一行。icon 两种写法都收——图标组件本身，在这里被定成 16px；或者一个渲染好的元素，你给什么就摆什么；destructive 把这一行画成 --danger；disabled 去掉指针事件并压低透明度。' },
      { hash: '9d2a84dc', element: '分组标签', description: '一行孤零零的等宽小标。纯视觉——Radix 把它渲染成一个普通 div，方向键会跳过它。真正给若干行当标题的是 DropdownMenuGroup：它渲染 role="group"，并把自己的 aria-labelledby 指向这一个。' },
      { hash: '929634d3', element: '分组', description: '一个有名字的区段：role="group" 包住那些行，label 在它内部渲染成 Label，再通过 aria-labelledby 完成命名。这套接线由组件来做，是因为调用方自己动手就得凭空造一个 id。' },
      { hash: 'a4ede456', element: '分隔线', description: '组与组之间的一条发丝线，而且是真正的 role="separator"——菜单允许这么写，Command 面板赖以搭建的那个 listbox 不允许。' },
    ],
    practices: [
      ['1bfb0952', 'icon 要传组件——icon={Settings}——把定尺寸交给行本身，这样一个十行的菜单画出来的是十个同一尺寸的图标，而不是十个尺寸。元素那种写法现在也收；它过去和隔着一次 import 的 CommandItem 所要的东西恰好相反。'],
      ['da4902f6', '触发器要写 asChild 并交给它一个真正的 Button：不写，Radix 就渲染自己那个没有样式的 button，菜单最后挂在一个不属于这套系统的控件上。'],
      ['20d565dc', '要开对话框，就自己拿着它的 open 状态，并在这一项的 onSelect 里调 event.preventDefault()——选中一行会关掉菜单，而 Radix 的关闭会把焦点送回触发器，这一下发生在对话框已经接过焦点之后，读者刚进去就被拽了出来。'],
      ['a9039503', '大概十几行就该停。面板没有最大高度，更长的菜单会一直长到撞上碰撞内边距，然后翻到触发器上方——SearchableMenu 就是同一份列表长过这里之后的样子。'],
      ['c9274833', 'Radix 的 modal 默认就是 true，这里没有任何东西改它，所以菜单开着的时候，后面的页面被锁住滚动、指针事件也关着——需要读者一边用一边翻页面的东西，不该放进菜单。'],
      ['8cc40b10', '光把一个 DropdownMenuLabel 摆在几行上面，得到的是一张标题的图片：Radix 的 MenuLabel 是一个没有 role、也没有任何东西把它和后面内容绑起来的普通 div，于是看得见的读者眼里那几个分区，到另一边就是一份没有分段的列表。DropdownMenuGroup 会把两半都渲染出来，并且接在一起。'],
      ['14708193', '这个包的导出里没有复选项、没有单选项，也没有二级菜单——需要勾选状态的菜单只能直接从 @radix-ui/react-dropdown-menu import，而那样拿到的行，一点这个文件里的样式都没有。'],
    ],
  },
  tooltip: {
    name: '文字提示',
    summary: ['d4808a07', '悬停和获得焦点时出现的一句短标签。'],
    when: ['41f31bb3', '任何读者“需要”的东西都不能只放在这里：触屏摸不到它，扫读的人也看不见它。'],
    accessibility: [['9a8c0730', '在有边界的框里——设备预览、内嵌控制台——用 `<OverlayContainer container={el}>` 包住这棵子树。面板会渲染进那个元素，按它的边界翻转，而不是按视口；框上设的 `dir` 和 `data-density` 也就跟着生效了。'], ['b9076af8', '触发器用 asChild，所以子元素必须可聚焦——一个 div 触发器就是没有键盘 tooltip，这个 API 形状让它显性而不是无声。'], ['47dcda68', '它不是无障碍名称。只有图标的按钮仍然需要自己的 aria-label。']],
    keyboard: [['fb051819', '显示提示——聚焦就会出现，不是只有悬停才行。'], ['bf7f6a26', '关掉提示。']],
    anatomy: [
      { hash: '17822e72', element: '提供者', description: 'TooltipProvider，在应用外面、或者在有 tooltip 的那棵最小子树外面包一次。共享的 700ms 打开延迟和 300ms 跳过窗口都在它身上；没有它，Radix 是直接抛错，而不是渲染一个没有节奏的提示。' },
      { hash: '83aede72', element: '触发器', description: 'children，以 asChild 交给 Radix——所以子元素本身就是触发器，外面不会插进任何包装元素。' },
      { hash: '71082902', element: '提示', description: 'content，装在 portal 出去的那个面板里：--feature-surface 底上的 11px 等宽字，宽度上限 16rem，离所选那一侧 6px，停在 --z-toast（300），所以它在自己被打开的那个模态之上仍然看得见。' },
      { hash: '0e771e6c', element: 'portal 落点', description: '提示最终落在哪——document.body，或者外层 OverlayContainer 指名的那个元素；它同时也是提示以 8px 内边距去碰撞的那个盒子。' },
    ],
    practices: [
      ['9c6871a8', 'Provider 要放得高，而且必须放一个。没有它 Radix 会抛错；而每个 tooltip 各配一个 provider，就废掉了那份共享节奏——正是它挡住了一排图标按钮在每次悬停时各闪各的提示。'],
      ['3f8b8fe6', '提示要和控件的 aria-label 逐字一致：一个控件两个名字，就是「名称中的标签」这条失败（WCAG 2.5.3），而语音控制用户念出来的，是他看得见的那几个字。'],
      ['183ba142', '提示只写一个短语。它的宽度上限是 16rem，字号是 11px 等宽，所以一整句话会折成五行的一块，把它本来要描述的那个东西盖住。'],
      ['2b4bd637', '把它放在一个没有它也照样能用的控件上：指针类型是触摸时 Radix 直接提前返回，所以在手机上这个提示压根不会打开，凡是只由它承载的东西，在那里就是缺失的。'],
      ['007619d5', 'delayDuration={0} 不只是让它更快——状态会变成 instant-open 而不是 delayed-open，而淡入是绑在 delayed-open 上的，所以提示是完全没有过渡地直接出现。'],
      ['cfd32f39', '在单个 Tooltip 上设 delayDuration，只为那一个触发器覆盖 provider——于是一条工具栏里有一个瞬间弹出的提示，紧挨着一排 700ms 的邻居，读起来是卡顿，不是强调。'],
      ['4a53305f', 'content 里不该有任何可聚焦的东西：提示不在 Tab 顺序里，触发器一失焦它就关，所以放在里面的链接或按钮，除了指针没有第二种够得到的方式。那是 Popover 的活。'],
    ],
  },
  popover: {
    name: '气泡卡片',
    summary: ['0fa520b0', '锚在控件上的面板，里面装可以交互的内容。'],
    when: ['8fd4e3d8', '任何带链接、字段或按钮的东西。tooltip 描述而不能被进入——把控件放进 tooltip，它就再也够不到了。'],
    accessibility: [['9a8c0730', '在有边界的框里——设备预览、内嵌控制台——用 `<OverlayContainer container={el}>` 包住这棵子树。面板会渲染进那个元素，按它的边界翻转，而不是按视口；框上设的 `dir` 和 `data-density` 也就跟着生效了。'], ['96fe962a', 'label 必填：popover 是一个 dialog，没有名字的 dialog 什么都没播报。'], ['44524024', '里面的内容像页面其他部分一样用 Tab 走，不像菜单那样用方向键。']],
    keyboard: [['252188bb', '打开它。'], ['8c44a2bf', '像页面其他地方一样用 Tab 走过里面的内容。'], ['1369faeb', '关闭它，并把焦点还给触发器。']],
    anatomy: [
      { hash: 'e1557520', element: '触发器', description: 'PopoverTrigger，一个透传。写 asChild 就能保住你自己那个控件；面板被 Escape 关掉时，Radix 把焦点送回这里。' },
      { hash: '6d89e47a', element: '面板', description: '锚定的那个 dialog：宽度写死 18rem，内边距 1rem，离触发器 8px，名字由 label 给。打开时焦点会移进去，但不会被困在里面。' },
      { hash: '7d7a92dc', element: '锚点', description: 'PopoverAnchor，用在面板该对着的不是打开它的那个控件时——溢出按钮所作用的那一行，或者正文里的一段选区。' },
      { hash: '04554ebf', element: '关闭', description: 'PopoverClose，以及 showClose 在顶部末端角上渲染的那个 32px 的 X。和 Dialog 不一样，它默认是关的。' },
    ],
    practices: [
      ['c933d3be', 'label 要说明面板里装的是什么，而不是把触发器再念一遍：它是在进入时播报的，所以「Filter options」告诉读者他落到了哪里，而把按钮上的字重复一遍，什么新消息都没有。'],
      ['067d8a7c', '视觉上的锚点不是触发器时，用 PopoverAnchor——比如一个作用在选中行上的工具栏按钮——否则面板跟着按钮走，会离它正在编辑的那个东西越来越远。'],
      ['641767c2', '关掉面板的那个控件要用 PopoverClose 包住，别自己翻 state，这样关闭走的是 Radix，焦点回到触发器，而不是回到文档最开头。'],
      ['2ee570cc', '面板里放表单时，把 showClose 打开。它默认是关的，而一个非模态、唯一出路是点到别处的面板，让一次进行中的编辑没有任何一个明确的收尾动作。'],
      ['062ddedc', '它不是模态的——Radix 的 modal 默认是 false，这里没有任何东西改它，所以既没有焦点陷阱也没有滚动锁定：从里面最后一个控件继续 Tab，焦点就走进页面，Radix 把这读成焦点跑到了外面，于是在任务做到一半时关掉面板。'],
      ['0bb61e90', '一串动作该放进 DropdownMenu。popover 里的内容就是普通的 Tab 停靠点，十个动作就是十个停靠点，还没有首字母跳转；而菜单是一个停靠点，方向键和按字母跳都在它里面。'],
      ['da0e7e9f', '面板停在 --z-dropdown，解析出来是 220——高过 Dialog 的 210，好让从对话框里打开的 popover 够得到。反过来说，一个由页面打开、又被你自己的 state 一直按着开的 popover，会盖在随后到来的模态上面；Radix 会在外部交互时把它关掉，而一个无视这一点的受控 open，是唯一能看到这一幕的写法。'],
    ],
  },
  sheet: {
    name: '抽屉',
    summary: ['cb02b219', '停靠在视口某一边的面板。'],
    when: ['1884c605', '需要空间的模态——筛选面板、详情视图。它本身就是一个 Dialog，只是靠边；边名按阅读顺序取，所以 end 在英文里是右、在阿拉伯语里是左。'],
    accessibility: [['949e727b', '复用 Dialog 的焦点陷阱、Escape 与滚动锁定，而不是再实现一遍——第二个焦点陷阱就是第二个会出错的焦点陷阱。'], ['0f54e3c9', '标题必填，无论可不可见。']],
    keyboard: [['59dbb221', '关闭它，焦点回到触发器。'], ['c7559f98', '在面板内部循环。']],
    anatomy: [
      { hash: 'fff06edb', element: '遮罩', description: '和 Dialog 用的是同一层停在 --z-overlay 的 --scrim——事实上就是同一个组件，所以后面的页面是惰性的、被锁住滚动的，跟在对话框底下一模一样。' },
      { hash: '31565c1f', element: '面板', description: '靠边停住的那个盒子。start 和 end 是一列 min(24rem, 92vw) 宽的满高栏；top 和 bottom 是一条满宽、高度上限 85vh 的带。它是一个自己滚动的 flex 竖列。' },
      { hash: '8bebbe19', element: '标题', description: 'title，类型上是必填而不是可选——这里没有一条通向「没名字的抽屉」的路，只有经 hideTitle 把标题藏起来那一条。' },
      { hash: '70965592', element: '描述', description: 'description，在标题下面，和它共用那个被 hideTitle 藏起来的外层容器。' },
      { hash: '427f4f92', element: '关闭', description: '顶部末端角上那个 X。和 Dialog 不同，这里没有 showClose 能把它关掉，所以无论停靠在哪一边，每个抽屉都有一个。' },
    ],
    practices: [
      ['53f3bca7', '内容是一份列表、或者一张长到要滚动的表单时，选 Sheet 而不是 Dialog：它拿的是整个视口的高度，而不是 Dialog 那个 32rem × 85vh 的盒子，读者也还留着页面边缘作参照。'],
      ['c181285f', '内容又宽又矮时用 top 或 bottom——一条筛选栏、一个日期区间。start 和 end 是一列 24rem 的窄栏，硬塞一张表格进去，它会折成一条带子。'],
      ['6ec6d620', '边名写 start 和 end，别去伸手拿 left 和 right：每条边都有自己那串字面类名，各自带着自己的 rtl: 变体，所以 end 在英文里从右边进来、在阿拉伯语里从左边进来，不需要第二条代码路径。'],
      ['493b6686', '取消的那个控件要用 SheetClose 包住，好让关闭走 Radix——用自己那个 setState 关掉的抽屉，会把焦点留在一个已经不在页面上的面板里。'],
      ['f179b2e1', '别在 className 里把这段位移再声明一遍。面板带着 data-folio-animated，在减少动效下它的 transform 是被整个去掉的；而你自己加的第二个 transform 只吃得到那条通用兜底，所以它照样会到——晚百分之一毫秒，从你写的那个位置。'],
      ['b05665a7', '元素本身没有定位的 OverlayContainer，会把抽屉停靠到错的那个盒子上：一旦指定 container，面板就从 fixed 切成 absolute，于是一个没有定位的 container 把它送到的是最近那个有定位的祖先，而不是那个框。'],
      ['3293770e', '它是一个模态对话框，所以后面的页面被锁住滚动、指针也是惰性的：需要读者一边看页面一边调的筛选面板，不该住在这里。那是 Popover 的活，或者干脆在布局里开一栏。'],
    ],
  },
  'context-menu': {
    name: '右键菜单',
    summary: ['557cae70', '右键打开的菜单。'],
    when: ['b8cabde6', '永远不能是通往某个动作的唯一路径。触屏、触控板和纯键盘用户可能根本打不开它。'],
    keyboard: [['296c7b9c', '在平台支持的地方，用键盘打开菜单。'], ['585f0181', '在菜单项之间移动。'], ['8d664449', '关闭它。']],
    anatomy: [
      { hash: 'ef7ce514', element: '触发区', description: '次级点击会在其上打开菜单的那块区域。不写 asChild，Radix 就把 children 包进自己那个 inline 的 span，并在上面设 -webkit-touch-callout: none，免得系统的文本气泡先弹出来。' },
      { hash: 'e33914e7', element: '面板', description: 'portal 出去的那个菜单，落点是指针的位置，而不是贴着触发区——这里没有 side 或 align 可设，只有那 8px 的碰撞内边距，把它留在视口或者 OverlayContainer 的框里面。' },
      { hash: '8b521d5d', element: '菜单项', description: '一行，收的 icon、destructive 和 disabled 属性都和 DropdownMenuItem 一样——icon 两种写法都行——高亮也走同一个 data-highlighted。' },
      { hash: '581ab9f0', element: '分组标签', description: '一行孤零零的等宽小标，而且只是视觉上的。真正给若干行当标题的是 ContextMenuGroup：它渲染 role="group"，并把自己的 aria-labelledby 指向这一个。' },
      { hash: '283fc032', element: '分组', description: '一个有名字的区段：role="group" 包住那些行，label 在它内部渲染成 Label，再通过 aria-labelledby 完成命名。' },
      { hash: 'd19b2ffc', element: '分隔线', description: '组与组之间的一条发丝线，而且是真正的 role="separator"。' },
    ],
    practices: [
      ['5a3b6aaf', '写 asChild，把元素本身交给它：不写，Radix 就在你和你的子元素之间插进一个 span，成为 flex 项或 grid 项的是那个 span，而你的卡片是作为行内内容排在它里面的。'],
      ['03f92e14', '把同一份动作数组也做成一个藏在溢出按钮后面的 DropdownMenu——两者收的 icon、destructive 和 disabled 属性完全一样，所以一份列表喂两边，右键就成了快捷方式，而不是唯一那扇门。'],
      ['c942d7cc', '可右键的区域住在一个会滚动、或者有边界的框里时，用 OverlayContainer 把这棵子树包住：这是唯一一个位置由读者亲手指定的面板，而对着一条他看不见的视口边翻过去，会把它落在他没有指的地方。'],
      ['53bdda95', '别把「不支持触摸」当成事情的全部：对触摸和触控笔，Radix 是靠 700ms 长按打开菜单的，但指针一动就取消——所以在一份能滚动的列表上，长按和滚动手势彼此竞争，而通常是滚动赢。'],
      ['6fb189ca', '光把一个 ContextMenuLabel 摆在几行上面，得到的是一张标题的图片：Radix 的 MenuLabel 是一个没有 role、也没有任何东西把它和后面内容绑起来的普通 div，于是看得见的读者眼里那几个分区，到另一边就是一份没有分段的列表。ContextMenuGroup 会把两半都渲染出来，并且接在一起。'],
      ['ba0022ef', '这里 Radix 的 modal 默认同样是 true，所以菜单开着时，后面的页面被锁住滚动、指针也是惰性的——开在一份长列表上的右键菜单，会让列表在它底下动不了；这对一份短动作列表是对的，对任何需要读者滚动才能作答的东西都是错的。'],
    ],
  },
  'searchable-menu': {
    name: '可搜索菜单',
    summary: ['fbb8f942', '一个能打字筛选的动作菜单。'],
    when: ['134a0c69', 'DropdownMenu 超过十几行就不再能扫读，而用二级菜单去救只会更糟。这就是同一份列表加上一个过滤框。它不是 Command 面板：那个是页面级的、模态的；这个锚在某个控件上。'],
    accessibility: [
      ['9a8c0730', '在有边界的框里——设备预览、内嵌控制台——用 `<OverlayContainer container={el}>` 包住这棵子树。面板会渲染进那个元素，按它的边界翻转，而不是按视口；框上设的 `dir` 和 `data-density` 也就跟着生效了。'],
      ['bca05372', '行是 listbox 里的 option 而不是 menuitem，因为过滤这件事要求如此——高亮通过 aria-activedescendant 移动，焦点留在输入框里，而菜单做不到。'],
      ['e8af46d1', '这个取舍是刻意的：一个没法筛的菜单，对读者来说比一个会执行动作的 listbox 更糟。'],
    ],
    keyboard: [['4e1fc0f6', '打开菜单。'], ['0f32dfd7', '移动高亮，焦点始终留在筛选框里。'], ['d3a821ed', '执行高亮那一项动作。'], ['d3d8f53f', '什么都不执行，直接关闭。']],
    anatomy: [
      { hash: '72a9e314', element: '触发器', description: '这里自己搭的一个胶囊按钮，不是 Button：--control-h-sm 高，一条发丝线边框，带一个尖角。它的无障碍名称是 label，不是你当作它的文字传进去的 children。' },
      { hash: '765c0a9c', element: '面板', description: '一个去掉了内边距、宽度写死 16rem 的 Popover，所以筛选框和列表在里面是齐边铺满的。它不是模态的——这是 Popover，不是 Dialog。' },
      { hash: '8db8c6f0', element: '筛选框', description: 'Command 的输入框。打开时焦点落在这里，而且一直留在这里；高亮是通过 aria-activedescendant 在它下面移动的。' },
      { hash: 'f47b5aca', element: '行', description: '每个 MenuAction 一行，形态是 listbox 里的 option。shortcut 在行尾印成一个 Kbd，destructive 把它画成 --danger，而选中一行是先关掉菜单，再执行 onSelect。' },
      { hash: '1df05d2b', element: '空状态', description: 'emptyMessage，筛选什么都匹配不到时显示。要说清什么才匹配得上，而不是写一句「没有结果」。' },
    ],
    practices: [
      ['2f0632fa', '给动作配 keywords，是为了那些读者会伸手去打、而标签上没印出来的词——Export 配「download」，Delete 配「bin」。标签自己的文字会被替你提进筛选里；而一个纯由元素拼出来的标签一个字都印不出来，开发环境会警告 SEARCHABLE_MENU_LABEL_UNREADABLE，而不是把一行什么都匹配不上的东西发出去。'],
      ['2ebf73df', 'label 要就是触发器上看得见的那行字。它是作为 aria-label 设在触发器上的，会盖过 children——所以一个显示「Status」、label 却是「Row actions」的按钮，播报出来的是读者念不出口的东西（WCAG 2.5.3）。'],
      ['edc7bec9', '同一组的动作在数组里要挨着放：分组是靠遍历这份列表、并且只往最后一组里追加建起来的，所以同一个组名在别的行之后再次出现，会多出一个文字完全一样的第二个标题。'],
      ['5870b7b1', '它底下是一个 Popover，所以不是模态的：筛选框开着的时候后面的页面照样滚，而面板会跟着重新锚定。真要把页面按住不动，那是 CommandDialog。'],
      ['48f05880', 'className 落在触发器上，不是面板上——面板宽度写死 16rem，没有任何属性能把它撑宽，所以一行长标签是折到第二行，而不是盒子长大把它装下。'],
      ['5c0b3a4c', '触发器是 --control-h-sm——默认密度下 36px，data-density="compact" 下 30px——低于 44px 的指针目标（WCAG 2.5.5）；而且它不是系统那个 Button，所以 variant 和 size 都够不到它。'],
    ],
  },
  command: {
    name: '命令面板',
    summary: ['0713ba1f', '可筛选的动作列表——⌘K 那个面。'],
    accessibility: [['34f9e213', '列表随打字过滤，高亮随方向键移动，焦点始终留在输入框里。最后这条是 ARIA combobox 模式，也是自制面板一定会做错的地方。']],
    keyboard: [['ffb7a819', '移动高亮。焦点留在输入框里，所以你打的字还能继续改。'], ['b212271e', '执行高亮那一项。'], ['65c183f6', '关闭面板。']],
    anatomy: [
      { hash: '7e3c31ea', element: '输入框', description: 'CommandInput，也就是那个 combobox，带一个搜索字形，底下一条发丝线。它的高度是写死的 52px，不是 --control-h 那类 token，所以它不跟着 data-density 走。' },
      { hash: '92be1437', element: '列表', description: 'CommandList，内联时高度上限 18rem，放进 CommandDialog 里抬到 26rem，靠自己那条六像素的发丝滚动条滚动。' },
      { hash: '774c4604', element: '行', description: '一行：一个图标元素、标签、一条可选的附注，以及印成 Kbd 的快捷键。高亮那一行拿的是 --accent-muted 加行首一道强调色竖线，因为只靠一块填充，在滚动中很难抓住。' },
      { hash: 'a8253e2b', element: '空状态', description: 'CommandEmpty。只有树里真的存在一个空状态，cmdk 才会渲染它——所以没有它，一次没匹配上的筛选留下的是输入框底下一条空白。' },
      { hash: 'b67b6cf7', element: '页脚', description: 'CommandFooter 和它里面的 CommandHint 行。命令面板是一块键盘界面，而它的按键是看不见的；这里是唯一会把它们印出来的地方。' },
    ],
    practices: [
      ['88e5222f', '要用就用 CommandDialog，不要用光秃秃的 Command。根节点只是一个内联的带边框盒子，没有遮罩、没有焦点陷阱，自己也不处理 Escape——所以只用它搭起来的面板会一直开着，直到别的东西来关它。'],
      ['2e0108b3', '永远要渲染 CommandEmpty。只有它在场，cmdk 才会显示空状态——所以漏掉它的面板，对一次什么都没匹配到的筛选给出的回答，是一个输入框加一条空白，外加零解释。'],
      ['a287dc0c', '字形需要自己的尺寸或颜色时，给 CommandItem 传元素——icon={<Search size={16} />}；不需要时就传组件——icon={Search}。两种写法在这里和在 DropdownMenuItem 里都行；它们过去隔着一次 import，彼此恰好相反。'],
      ['637343bf', '⌘K 要自己绑，然后再把它印出来：这个组件里没有任何东西在监听按键，所以在应用加上 keydown 处理之前，这个面板根本没有快捷键；而读者是从 CommandFooter 里知道它存在的。'],
      ['9cb80dfd', '除非那个值正是读者会打出来的东西，否则别给 CommandItem 传 value——cmdk 优先按 value 过滤，只有在没有 value 时才退回到行自己的文字，所以把一个 id 当 value 传进去，会让看得见的那个标签搜不到。id 必须留作 value 时，把标签里的那些词当作 keywords 传进去，SearchableMenu 就是这么做的。'],
      ['bbebb80c', 'CommandDialog 是带着 hideTitle 和 showClose={false} 渲染的，所以这个面板既没有可见标题，也没有可见的关闭：出口只有 Escape 和遮罩，两个都不会自报家门。把 Escape 印在 CommandFooter 里，别假定人人都知道。'],
      ['c45d7b6e', '别指望这个面板跟着 data-density 走——CommandInput 是写死的 52px，不是 --control-h 那类 token，所以在 compact 下，应用里其他控件全都缩了，只有它这个输入框纹丝不动。'],
    ],
  },
}
