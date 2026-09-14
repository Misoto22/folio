import { BY_SLUG, type ComponentGroup } from '@/content/registry'
import { fingerprint } from './api-hash'
import type { Locale } from './locales'
import { ACTIONS_ZH } from './components-zh/actions'
import { FORMS_ZH } from './components-zh/forms'
import { NAVIGATION_ZH } from './components-zh/navigation'
import { OVERLAYS_ZH } from './components-zh/overlays'
import { FEEDBACK_ZH } from './components-zh/feedback'
import { DISPLAY_ZH } from './components-zh/display'
import { SURFACES_ZH } from './components-zh/surfaces'
import { DATA_ZH } from './components-zh/data'
import { CHARTS_ZH } from './components-zh/charts'
import { DIAGRAMS_ZH } from './components-zh/diagrams'
import { WEBSITE_ZH } from './components-zh/website'

/**
 * The editorial layer, translated.
 *
 * What IS translated: everything this site wrote — group names, component
 * summaries, the "when to reach for it" note, the foundations prose, the
 * principles, the templates.
 *
 * The API reference — prop descriptions and the "Notes" section — is translated
 * too, and lives in `api.ts` rather than here because it is parsed out of the
 * package's source and needs a register keyed by prop rather than by slug.
 *
 * What is NOT translated: type signatures and identifiers. They are code.
 *
 * Anything missing here falls back to English rather than rendering blank,
 * which is the same rule misoto22.com follows for its own translated content.
 *
 * The COMPONENT catalogue below needs the same drift guard `api.ts` has, and
 * for a stronger reason: its prose is authored in the package, at
 * `agent/catalog/`, so every line here is a copy the original can move out from
 * under. `content.test.ts` used to check only that the lists were the same
 * LENGTH, which sees a row added or removed and cannot see one rewritten — and
 * a rewritten row is the failure that matters, because it prints as a
 * translation while telling a Chinese reader the opposite of what the English
 * says. See `Translated` for the shape and `componentCopy` for the fallback.
 */

/**
 * One translated line, and a fingerprint of the English it was made from.
 *
 * A TUPLE rather than the `{ hash, zh }` `api.ts` uses, because that register
 * is one entry per line and can afford two field names, and these fields are
 * LISTS: six of those objects stacked inside a `practices` array push the
 * sentence off the right of the screen, and the sentence is the column a
 * translator reads down. `['a1b2c3d4', '……']` keeps the hashes in a narrow
 * gutter and the prose where it was.
 *
 * ONE HASH PER LINE, not one per field. A hash over the joined array is a
 * quarter of the bytes and useless twice over: the failure it reports is
 * "something in progress.practices moved", which is not a line anyone can go
 * and fix, and the fallback it forces drops five sound translations because a
 * sixth drifted. It is also brittle in the ordinary case — inserting a line
 * into the middle of both languages invalidates every hash below it, and a
 * check that cries wolf on a correct edit is one people learn to re-stamp
 * without reading. Per line, the hash travels WITH the sentence: an insertion
 * leaves its neighbours alone, and the only entry without a hash is the new one.
 *
 * Never hand-written. `fingerprint` is FNV-1a over the English with whitespace
 * collapsed; the whole tree was stamped by machine from `agent/catalog/`.
 */
export type Translated = readonly [hash: string, zh: string]

/**
 * A component's entry as AUTHORED, under `components-zh/`.
 *
 * Every prose field carries its fingerprint. `name` deliberately does not: the
 * English `name` is the export identifier — `Button`, the thing you type in an
 * import — and `componentName` prints the Chinese AFTER it rather than instead
 * of it, so 按钮 is an addition and not a translation that can contradict
 * anything. A component renamed in the package is caught already, by the test
 * that refuses a slug the registry does not have.
 */
export interface ComponentCopyZh {
  /** The Chinese name, printed after the English one — see `componentName`. */
  name?: string
  summary?: Translated
  when?: Translated
  accessibility?: Translated[]
  keyboard?: Translated[]
  /**
   * The anatomy table. ONE hash for the row, over both halves.
   *
   * The row is the unit here, not the string: `content.test.ts` already refuses
   * a row with only one side written, because an English noun beside a Chinese
   * sentence is the half-translated state this file exists to avoid. So the row
   * is what a translator repairs and the row is what falls back.
   */
  anatomy?: { hash: string; element: string; description: string }[]
  practices?: Translated[]
}

/** A component's copy as RESOLVED for a page: plain strings, English where stale. */
export interface ComponentCopy {
  /** The Chinese name, printed after the English one — see `componentName`. */
  name?: string
  summary?: string
  when?: string
  accessibility?: string[]
  /**
   * The `does` column of the keyboard table, in the registry's own order.
   *
   * Positional rather than keyed by the keys themselves, because a key list is
   * `['↑', '↓']` and would make a poor object key. `content.test.ts` fails when
   * the two lists are different lengths, which is the drift this shape risks.
   */
  keyboard?: string[]
  /**
   * The anatomy table, in the registry's own order.
   *
   * Both halves are prose, so both are translated. `required` is not here: it
   * is a flag the package sets, and a translation that could disagree with it
   * would be a second answer to a question the catalog already answers.
   */
  anatomy?: { element: string; description: string }[]
  /**
   * The best-practices lines, in the registry's own order — do and don't in
   * ONE list, not two, because the order is the English list's order.
   *
   * Plain strings rather than objects: `kind` is structural, and translating a
   * flag would let the Chinese say "do" where the English says "don't".
   *
   * Positional, like `keyboard`, and with the same failure mode: a line added
   * in English without one here shifts every sentence below it onto the wrong
   * judgement — and, because the halves are filtered out of this one list, can
   * move a sentence across the do/don't divide.
   */
  practices?: string[]
}

const GROUPS_ZH: Record<ComponentGroup, string> = {
  Actions: '动作',
  Forms: '表单',
  Navigation: '导航',
  Overlays: '浮层',
  Feedback: '反馈',
  Display: '展示',
  Surfaces: '容器',
  Data: '数据',
  Charts: '图表',
  Diagrams: '图示',
  Website: '网站',
}

/**
 * Every component's Chinese copy, keyed by slug.
 *
 * The entries live one group to a file under `components-zh/`, mirroring the
 * package's `agent/catalog/`, and this is where they are put back together —
 * spread in `GROUPS_ZH` order, which is the order the sidebar prints. Nothing
 * else moved: this is still the module every consumer imports, and
 * `content.test.ts` fails if the assembly loses a slug or if two group files
 * claim the same one.
 */
export const COMPONENTS_ZH: Record<string, ComponentCopyZh> = {
  ...ACTIONS_ZH,
  ...FORMS_ZH,
  ...NAVIGATION_ZH,
  ...OVERLAYS_ZH,
  ...FEEDBACK_ZH,
  ...DISPLAY_ZH,
  ...SURFACES_ZH,
  ...DATA_ZH,
  ...CHARTS_ZH,
  ...DIAGRAMS_ZH,
  ...WEBSITE_ZH,
}

/** The Chinese if it was made from THIS English, and the English otherwise. */
function current(translated: Translated | undefined, english: string): string {
  if (!translated) return english
  return translated[0] === fingerprint(english) ? translated[1] : english
}

/**
 * The two halves of an anatomy row as one string, for one hash.
 *
 * NUL between them rather than a space, because `fingerprint` collapses
 * whitespace: with a space, a word moved from the end of the element name to
 * the start of the description would hash identically.
 */
function anatomySource(row: { element: string; description: string }): string {
  return `${row.element}\u0000${row.description}`
}

/**
 * Component copy for a locale, resolved against the English it was made from.
 *
 * Every field comes back as a plain string — the Chinese where its fingerprint
 * still matches the registry, and the ENGLISH where it does not. Never blank,
 * and never the stale Chinese: a line that says the opposite of the English is
 * worse than a line the reader has to read in English, which is the whole
 * argument for the hash. It is the same rule `apiCopy` follows.
 *
 * Callers keep their own `?? entry.summary` as well. That is now belt and
 * braces rather than the mechanism, and it is what covers a slug with no
 * translation at all.
 */
export function componentCopy(locale: Locale, slug: string): ComponentCopy {
  if (locale === 'en') return {}
  const zh = COMPONENTS_ZH[slug]
  const english = BY_SLUG.get(slug)
  if (!zh || !english) return {}
  return {
    name: zh.name,
    summary: current(zh.summary, english.summary),
    when: english.when === undefined ? undefined : current(zh.when, english.when),
    accessibility: english.accessibility?.map((line, index) =>
      current(zh.accessibility?.[index], line),
    ),
    keyboard: english.keyboard?.map((row, index) => current(zh.keyboard?.[index], row.does)),
    anatomy: english.anatomy?.map((row, index) => {
      const translated = zh.anatomy?.[index]
      return translated && translated.hash === fingerprint(anatomySource(row))
        ? { element: translated.element, description: translated.description }
        : { element: row.element, description: row.description }
    }),
    practices: english.practices?.map((row, index) =>
      current(zh.practices?.[index], row.text),
    ),
  }
}

/**
 * A component's name on a Chinese page: `Button 按钮`.
 *
 * Both, in that order, which is what every Chinese design system settled on —
 * Ant Design, Arco, Semi and TDesign all print the English identifier first and
 * the Chinese name after it. The reason is that the English word is not a label
 * here, it is the IMPORT: a reader who translates `Button` to 按钮 in the
 * sidebar then has to translate it back to type `import { Button }`, and the
 * one thing a component page must never do is hide the name of the thing it is
 * documenting. The Chinese is what makes it findable; the English is what makes
 * it usable, and neither substitutes for the other.
 */
export function componentName(locale: Locale, slug: string, name: string): string {
  const zh = locale === 'zh' ? COMPONENTS_ZH[slug]?.name : undefined
  // A separator, not a space. Both halves are names — `AreaChart` and 面积图 —
  // and a space between two names reads as one name in two scripts. The dash
  // says they are two labels for the same thing, which is what they are.
  return zh ? `${name} - ${zh}` : name
}

export function groupName(locale: Locale, group: ComponentGroup): string {
  return locale === 'zh' ? GROUPS_ZH[group] : group
}

/** Foundations pages: title, summary, the intro paragraphs, and category headings. */
export interface FoundationCopy {
  title?: string
  summary?: string
  intro?: string[]
  categories?: Record<string, { title?: string; note?: string }>
  /**
   * The prose sections, keyed by `FoundationSection.id`.
   *
   * `rows` is keyed by the English `term` rather than by position, because a
   * term is a specifier or a URL and stays English on both sides: the key is
   * stable, and a row that loses its translation is a gap the test can name
   * instead of a detail silently paired with the wrong term.
   *
   * There is deliberately no field for `snippets` or `commands`. A reader
   * copies those, and a command that is not byte-identical in both languages
   * is worse than one that was never translated.
   */
  sections?: Record<string, { title?: string; body?: string[]; rows?: Record<string, string> }>
}

const FOUNDATIONS_ZH: Record<string, FoundationCopy> = {
  'getting-started': {
    title: '快速开始',
    summary: '装上它，选一张样式表，渲染第一个控件。',
    intro: [
      '组件是编译好发出来的。你 import 它们，而不是把它们抄进自己的项目；也没有哪个 CLI 会往你的源码树里写一个 Button 交给你维护。这就是这个包做的取舍：升级是改一个版本号，而不是四十个从此归你的文件上的一份 diff。',
      '四个 peer dependency，其中只有两个是 React。react 与 react-dom，^19.0.0，是必需的；motion 和 recharts 声明为可选，它们是一个入口点的代价——@misoto22/design/charts 两个都要 import，没装上就解析不到。@misoto22/design/diagrams 两个都不要。组件需要的其余东西——Radix、cmdk、sonner、Remix Icon、react-day-picker、tailwind-merge——都是真正的 dependency，随包一起下来。Node 24 或更新，而且这个包只有 ESM：exports map 里带的是 import 条件，没有 require，所以 CommonJS 构建解析不到它。',
      '这一页剩下的部分，正是 README 写得最薄的那一块：exports map 里的十二个入口，你真正要的是哪一个，以及每一个漏掉了什么。',
    ],
    sections: {
      install: {
        title: '安装',
        body: [
          '一个包。样式和组件是两次分开的 import——没有任何东西替你把 CSS 拉进来，只 import 了组件的项目渲染出的是没有样式的标记，而不是一个报错。',
        ],
      },
      stylesheets: {
        title: 'CSS 入口点',
        body: [
          '真正要选的其实是两套配方。`styles.css` 是整张编译好的样式表：Tailwind、原始 token、语义角色、主题轴、长文样式、动效关键帧，以及附在末尾的自带 @font-face 规则。一次 import，不用再做别的决定，Tailwind 也一并带过来。',
          '另一套配方是给已经自己编译 Tailwind、不想要第二份 utility 的应用的。它是三次 import——`tokens.css`、`semantic.css`、`keyframes.css`——而在选它之前值得知道的，是这三张表没有带上什么。',
          '`data-mode="dark"` 和 `data-density="compact"` 声明在 `tokens.css` 里，活得下来。另外五条轴——`data-surface`、`data-radius`、`data-rules`、`data-type`、`data-motion`——只声明在 `themes.css` 里，那是一个单独的导出，既不在 README 的配方里，也不在上面那段代码里。没有它就写 `data-radius="sharp"`，属性会落到元素上，然后什么都不改变。字体在 `fonts.css`，同样是单独的；长文正文样式在 `article.css`。要哪一张，就按名字自己加上。',
        ],
        rows: {
          '@misoto22/design': '组件、类型，以及 `cn`、`CONTROL_BASE`、`CONTROL_BORDER`、`isInvalid`、`BRAND`。',
          '/charts': '图表，也是那两个可选 peer 存在的唯一理由——它 import 了 `recharts` 和 `motion/react`。放在自己的入口后面，所以一个只渲染 Badge 的页面两样都不必付。',
          '/diagrams': '五个图形渲染器，以及读者用来查看它们的画布、工具条、图例、缩略图和检视面板。除 React 之外不需要任何 peer。',
          '/styles.css': '全部，已编译：Tailwind + 下面每一层 + 自带的字体。一次 import 走完的那条路。',
          '/tokens.css': '原始 token，外加默认的暗色换值和 compact 密度轴。',
          '/semantic.css': '组件真正读的那些角色——`--background`、`--foreground-muted`、`--border-color`。',
          '/keyframes.css': '动画，以及把它们停下来的那一条减少动效规则。',
          '/themes.css': '剩下的五条主题轴。不在那套三层配方里；只要你设了其中任何一条，就得把它加上。',
          '/fonts.css': '自带的 @font-face 规则。已经附在 `styles.css` 里面了。',
          '/article.css': '长文正文的排版样式，给 `Article` 组件用。',
          '/tokens.json + /tokens': '同一批 token，作为数据——JSON 给构建脚本，带类型的 `TOKENS` 记录和 `TokenName` 联合类型给 TypeScript。',
        },
      },
      tailwind: {
        title: 'Tailwind 互操作',
        body: [
          '语义色刻意没有被提升成 Tailwind 的颜色 utility。它们是用任意属性语法消费的——`text-(--ink)`、`bg-(--paper)`、`border-(--rule)`——所以新增一个角色或给它换色，是 `semantic.css` 里的一处改动，别的地方一处都不用动。没有 `bg-paper` 这个 class，以后也不会有。',
          '如果你自己编译 Tailwind，把 `@source` 指向这个包的 `dist`，好让库组件内部用到的 utility 也在你的构建里生成出来，并且把 dark 变体声明成对属性而不是对 class 的匹配。`data-mode` 放在 `<html>` 上是有意的：它可以由一段内联脚本在首次绘制之前写好，没有 class 列表要对齐，也不会闪过错误的主题。',
        ],
      },
      'first-component': {
        title: '第一个组件',
        body: [
          '一个有标签、必填的字段，以及提交它的那个按钮。`Field` 会把 ARIA 接线——`aria-describedby`、`aria-required`、`aria-invalid`——接到它包住的那唯一一个元素子节点上，这也正是为什么手写一个 `<label>`、一个输入框和一个错误 div，是这套系统唯一帮不上忙的写法。一个 `Field` 里塞两个控件，两个都接不上，而且没有声音。',
          '错误写在 `Field` 的 `error` 属性里，而不是摆在它的 `hint` 旁边：它们是同一个槽位，不是上下叠着的两条消息；而且传了 `error` 就已经在控件上设了 `aria-invalid`——所以别再同时传 `invalid`。',
        ],
      },
    },
  },
  colour: {
    title: '色彩',
    summary: '一张白纸做底，一个近黑的记号，三种线的粗细，以及状态色。',
    intro: [
      '这套系统是单色的。底是纸白，记号是近黑，文件里剩下的唯一彩色是状态——它绑定在状态上，永远不绑定品牌。过去由色相承担的事，现在由字重、线条和反色承担。',
      '文字只有两级，再往下就没有了。下限是 --ink-3-aa，它在白底上以 6.7:1 通过 WCAG AA；比它高的每一级都更深。会落到这条线以下的浅色，不是这套系统可以做的选择。',
      '暗色模式是同一批名字的换值，不是第二套配色。这正是组件从不直接读原始 token 的原因：它读的是语义别名，模式属性一翻，别名自己就重新解析了。',
    ],
    categories: {
      colour: { title: '色彩 token' },
      data: {
        title: '数据',
        note: '这是整套系统唯一一处必须回答一个单色方案宁愿不被问到的问题的地方：没有色相可以花，怎么把六条序列分开？答案是纹理——每张图都提供填充样式，而下面这条色阶是第二层编码，不是第一层。八级是交错排列的，所以相邻序列在明度上尽可能拉开（ΔE 21，下限是 15），而且每一级在自己的底色上都过 3:1。彩色色板能通过的六项检查里，有两项在这里是刻意不通过的，而且是明说而不是藏着：色度下限（这些都是灰）和明度带（--series-1 就是墨色本身）。真的需要色相的使用者，是去设 data-chart-palette="chroma"，而不是自己挑十六进制；如果图表要穿的是一个品牌而不是八个分类，那就是 data-chart-palette="accent"，它把同样这八个名字从 --clay 上派生出来。--chart-fill 和 --chart-texture 是全系统唯一一对在两种底色上取值不同的 token：墨色以 14% 压在纸白上是一条读得出的带，纸白以 14% 压在近黑上什么都不是。',
      },
      depth: {
        title: '深度',
        note: '其中四个刻意什么都不画：--shadow-sm、--shadow 和 --shadow-lg 解析为 none，--shadow-color 解析为 transparent。这套系统里的 box-shadow 永远不带模糊；--lift 是取代高度阶梯的那道硬墨偏移。',
      },
      focus: { title: '焦点' },
    },
  },
  typography: {
    title: '字体排印',
    summary: '三种字体，一条标题阶梯，页面标题之上什么都没有。',
    intro: [
      'Hanken Grotesk 用于界面，Newsreader 用于标题与编辑性声音，IBM Plex Mono 用于标签与数据。每条字体栈都指名了 CJK 回退，所以中文页面用的是配好的字，而不是平台随手替换的那个。',
      '标题是一条所有界面共用的阶梯，在手机与 1288px 页面之间流体变化。--fs-title 之上什么都没有：一个页面只有一样东西比它自己的记录更大。各级之间刻意靠得很近——这条阶梯分的是同类记录，不是标题和它自己的子标题，所以嵌套的两个标题必须跳一级。',
    ],
    categories: { type: { title: '排印 token' } },
  },
  space: {
    title: '空间与形状',
    summary: '页面的边距、几种度量宽度，以及五个圆角。',
    intro: [
      '度量宽度以 ch 而不是 px 为上限，所以它跟随它所排的字。--measure-record 是列表记录描述文字的天花板，不是宽度：更窄的栏依然胜出。',
      '只有一条阶梯，以及带动整条阶梯的一个系数：每一级都是 --radius-factor 的倍数，所以主题只改一个数，各级之间的比例不变。这正是嵌套能对上的前提——两条相隔 p 的圆角边只有在“内圆角 = 外圆角 − p”时才是同心的，--radius-row 和 --radius-frame 分别给出了这两个方向。50% 的圆是几何形状而不是圆角，它压根不在这条阶梯上。',
      '每个组件都用逻辑属性书写——ps-/pe- 而不是 pl-/pr-，start-/end- 而不是 left-/right-——所以从右到左的文档不需要自己的样式表就能镜像。构建时有测试会因为一个物理属性而失败：事后给四十个组件补方向支持，是没人会排期的清扫，而且它出错时没有任何声音。上面任何一个例子都可以切到 RTL 看看。',
    ],
    categories: {
      space: { title: '布局' },
      radius: { title: '圆角' },
      density: {
        title: '密度',
        note: '第二条主题轴，也是唯一的另一条。在任何容器上写 data-density="compact"，它下面所有控件一起收紧，不需要逐个告知。默认状态下一个中号控件是 44px，也就是 WCAG 2.5.5 要求的指针目标；紧凑模式降到 36px，仍然宽裕地通过 2.5.8，但不再满足 2.5.5。它是给鼠标驱动的密集桌面工具用的，是一笔真实的取舍而不是白拿。上面任何一个例子都可以切过去看。',
      },
      icon: { title: '图标' },
      layer: { title: '层叠顺序' },
    },
  },
  shape: {
    title: '形状',
    summary: '一个数生出五级，以及让其中两级保持同心的那道算术。',
    intro: [
      '五级，一个数带动全部。4px、6px、8px、12px 和 999px，每一个都写成 calc(N * var(--radius-factor)) 而不是字面量——主题只改这个系数，各级之间的比例就保持不变，不会像四个各自重新敲一遍的数字那样必然走形。data-radius="sharp" 把系数设为 0，整套系统方角化；data-radius="round" 设为 2，每一级翻倍。这两个取值都在 themes.css 里，那是一个单独的 CSS 入口。',
      '每一级都说明了自己是给什么用的，而这些分配不可互换。--radius-xs，4px，是紧盒子里的一个记号。--radius-sm，6px，是标签、按键、列表行。--radius，8px，是控件那一级——按钮、输入框、选择器触发器和多行文本框画的是同一个角，而这份一致是最近才有的：按钮过去是胶囊形，它挨着一个 8px 的输入框，就是关于「控件是什么」的两种说法，也是这套系统里每个读者都注意到、却没有任何一个组件页解释得了的那一处不一致。--radius-lg，12px，是卡片、对话框、菜单面板。--radius-pill 是胶囊和计数——徽标、状态标、分段条、进度轨。',
      '真正的圆不在这条阶梯上，也永远不会随主题变成方角。头像、状态点、加载圈和单选框都是 rounded-full，因为单选框是圆的，才不会被当成复选框——那是几何在承载含义，不是一种圆角处理。',
      '嵌套法则。两条相隔 p 的圆角边，只有在内圆角等于外圆角减 p 时才是同心的。别的写法都会夹紧：缝隙在转角处变窄，那正是你先看见、过一会儿才叫得出名字的那种不对。两个方向都有名字，任何表面都不必去猜。--radius-row 是减——max(0px, calc(var(--radius-lg) - 0.375rem))，也就是 12px 减去面板给行留的 6px 内边距，得 6px。--radius-frame 是加——calc(var(--radius-lg) + 1rem * var(--radius-gate))，所以一个坐在 12px 面板外 16px 处的外框是 28px。',
      '--radius-gate 是 min(1, var(--radius-factor))，它只守着加的那个方向。外框的留白是一个固定的像素数，所以一旦主题切到方角，没有闸门的 --radius-lg + 16px 会在一个完全方正的面板外面留下一圈圆角的外框；有闸门，外框跟着其余部分一起塌掉。减的方向不需要闸门，因为 max(0px, …) 已经给了它下限。在系数为 1 时把这道算术算一次，它在 0 和 2 上同样成立——一条这么粗暴的主题轴敢发出去，唯一的理由就是这个。',
    ],
    categories: {
      radius: {
        title: '圆角',
        note: '构建时从包的 CSS 里读出来的。哪一级用在哪里，以上面的正文为准——xs 是紧盒子里的记号，sm 是标签或列表行，--radius 是控件，lg 是卡片或面板，pill 是胶囊或计数。',
      },
    },
  },
  elevation: {
    title: '高度',
    summary: '没有东西会浮起来。四个阴影 token 的存在，就是为了保证这一点。',
    intro: [
      '这里没有高度阶梯，而那四个以阶梯命名的 token，存在就是为了把它中和掉。--shadow-sm、--shadow 和 --shadow-lg 全部解析为 none，--shadow-color 解析为 transparent。这不是一处等着被补上的疏漏：从一套带阴影的系统移植过来的组件保留着它的 shadow class，什么都画不出来，保持平的——声明它们的全部意义就在这里。第二条法则——box-shadow 永远不带模糊——是由取值执行的，不是由评审者执行的。',
      '这套系统真正拥有的唯一一个深度线索是 --lift：3px 3px 0 0 var(--shadow-offset)，一道完全不带模糊的硬墨偏移，以及 2px 的 --lift-sm。--shadow-offset 指向 --clay，所以这道偏移是强调色而不是灰色，强调色一改它就跟着改。在伸手去用之前值得知道：包里没有任何组件用过这两个中的任何一个——整个库里一个 shadow-(--lift) 都没有。它是作为一种经过认可的写法发布给自己做反色版面的使用者的，不是库自己倚仗的东西。',
      '库真正用来分隔的是三样东西，按这个顺序。发丝线：行与行之间是 --rule，盒子四周是 --rule-2。换底色：--paper、--paper-2、--stone，三级，没有第四级。以及反色，也就是 Card variant="plate" 伸手去拿的那一样——它用那唯一一块反色表面填充，并自带标题颜色，因为写死的墨色标题落在反色版面上只有 1.25:1，在唯一一个全部职责就是长得不一样的变体上反而看不见。一屏最多用一块 plate；两块就是一个没有底色可言的页面。',
      '在这里，高度和层叠是两个问题，而且只有第二个是真的。七个层级——从 1 的 --z-rule 到 300 的 --z-toast——说明谁压在谁上面，它们没有一个暗示阴影，因为根本没有阴影可投。一个表面的层级由它必须越过什么决定：抽屉要盖过吸顶的页头，遮罩要把这两者一起盖住，模态要压在自己的遮罩上，锚定面板要盖过把它打开的那个模态——对话框里放一个选择器是最寻常不过的形状，而层级排在模态之下，面板就会被画到召唤它的那个对话框背后——而提示条要在一个正在提问的模态之上仍然看得见。这条阶梯本身列在「空间与形状」那一页，不在这里重复。',
      '七个里有两个在语义层有面向组件的别名：--z-dropdown 和 --z-overlay。从组件里去拿这两个；只有当你要摆放的东西这套系统没有名字时，才去拿原始层级。',
    ],
    categories: {
      depth: {
        title: '深度',
        note: '其中四个刻意什么都不画：--shadow-sm、--shadow 和 --shadow-lg 解析为 none，--shadow-color 解析为 transparent。--lift 和 --lift-sm 是取代那条阶梯的偏移——目前包里没有任何组件使用，它们是发布给使用者的，不是在这里被消费的。',
      },
    },
  },
  icons: {
    title: '图标',
    summary: '填充路径而不是描边，三个尺寸 token 对着源码里的六个尺寸，以及一套重新提供品牌图标的图标集。',
    intro: [
      '包里每一个图标都来自 @remixicon/react 的 Line 变体，画在 24px 网格上。它们是填充路径而不是描边，这是唯一需要记在脑子里的差别：没有 strokeWidth 可设，于是这一页从前那条例外——坐在方框里的七个小记号被推到 2、2.5 或 3，因为 1.5 在十二像素上会细到比发丝线还薄——也跟着那个属性一起没有了。填充路径的粗细跟着它的盒子一起缩，所以 12px 的记号本来就比 16px 的轻，任何 API 都改不了这件事。最依赖旧那条后路的是复选框的勾和它旁边那根横杠，两个都画在 12px 的强调色底上——那里由对比度接手了粗细不再能承担的事。',
      '十六像素是默认值，扛着这套系统的大部分：折角箭头、关闭、勾、小三角。14px 用于落在控件自身内边距里的记号，16 在那里会挤到标签——选择器的指示符、浮层的关闭、组合框的清除。18px 用于领起一行而不是坐在一行里的记号：导航项、提示的语气记号、命令面板的搜索。20px 是应用外壳的菜单开关，24px 留给 EmptyState，那里图标是整个界面上唯一的东西。',
      '那六个尺寸里有三个有名字：--ico-s 是 14，--ico-m 是 16，--ico-l 是 20。本来有四个。--ico-stroke 跟着描边一起走了，因为一个命名了系统再也设不了的粗细的 token，比没有这个 token 更糟。12px、18px 和 24px 从来就没有过。把这三个当成规格来读，不要当成机制——包里没有任何东西读它们。src/components 里每一个图标在 TSX 里都写成 size={16}，因为尺寸是以属性而不是以样式落到 SVG 上的。所以 token 是评审拿来对照的那一份，数字是你在源码里会看到的那一份。别去找把两者接起来的那个 var()，没有那个东西。',
      '图标靠 flex 对齐，永远不靠基线。Button 在每个变体上都设了 inline-flex items-center gap-(--control-gap)，所以字形相对它的标签居中，间距来自密度轴而不是调用处写死的一个 margin。居中对一行文字是对的，对一整块文字就是错的：Alert 的语气记号旁边是一个标题加一段正文，所以它改用 mt-px shrink-0。包里大多数图标都带 shrink-0，这不是装饰——没有它，flex 行会先压扁字形再去折标签，而一个被压到 11 的 16px 图标，是所有人都看得见、没人叫得出名字的那种瑕疵。',
      '在被证明不是之前，图标一律算装饰，所以 aria-hidden 是默认值，包里几乎每个图标都带着它。折叠面板上的箭头、复选框里的勾、话里已经说清出了什么事的提示上的语气记号——把这些念出来，都是同一句话说两遍。现在它是写出来的，不是继承来的。lucide 会给任何没被交给 aria- 属性或 role 的图标盖上 aria-hidden="true"；@remixicon/react 什么都不加，只把收到的东西原样摊到 svg 上。所以每一个装饰性字形都在它自己的调用处带着这个属性，这就把它从一个库的默认值变成了评审的一行——也是评审绝不能漏掉的一行，因为一个完全没有文字的控件，没有别的东西可以拿来播报。FloatingIconButton 把这件事变成了类型的问题：label 是必填属性，没有它代码就编译不过。Button 没有——它的 JSDoc 写着纯图标按钮必须有 aria-label，却没有任何东西去检查。一个没有可访问名称的纯图标控件，是设计系统交付出不可用东西最常见的一种方式。',
      '品牌图标回来了。lucide 把它们一个不剩地删了：没有 Github 这个导出，也没有 Twitter、Slack、Figma、Gitlab、Linkedin、Youtube、Chrome、Codepen、Framer、Dribbble、Instagram 或 Facebook，所以 import { Github } from "lucide-react" 是一个编译错误，而不是一个缺失的字形。这个站点为此背了一只手绘章鱼猫，就放在 apps/docs/src/components/GithubMark.tsx 里。Remix Icon 提供它们——RiGithubFill、RiTwitterXFill、RiDiscordFill、RiFigmaFill、RiSlackFill，还有两百来个，大多数同时有 Fill 和 Line 两种——所以那个文件删掉了，顶栏像 import 别的东西一样 import RiGithubFill。@misoto22/design 把 @remixicon/react 以 ^4.9.0 声明为 dependency 而不是 peer，所以直接 import 它的应用会按自己的范围解析自己的那份副本，出事的是它的升级，不是我们的。',
    ],
    categories: {
      icon: {
        title: '图标 token',
        note: '这是那条规则被写下来的版本。没有组件读它们——数字在每个调用处都是字面量——所以把这里的 token 当成评审据以断言的值，而不是组件解析出来的值。',
      },
    },
  },
  motion: {
    title: '动效',
    summary: '一条曲线，三档时长，以及一条不可选的减少动效规则。',
    intro: [
      '整套系统一条缓动曲线。三档时长：--fast 用于状态翻转，--mid 用于面板，--slow 用于页面大小的东西。需要第四档的组件，通常是在做两件事。',
      '包里每一个动画都挡在 motion-safe 后面，动效层还带一条减少动效规则，会停掉任何标了 data-m22-animated 的东西。要求少一点动效的读者拿到的是终态，而不是同一段动作的快进版。',
    ],
    categories: { motion: { title: '动效 token' } },
  },
  agents: {
    title: '与 AI 协作',
    summary: '这个包把自己写了两遍文档。这是浏览器打不开的那一半。',
    intro: [
      '这个包有两类读者，只有一类打得开浏览器。第二类通常已经把它装上了——也就是说，它正在写的那个版本就躺在 node_modules 里，而它本来要读的文档在一个已经往前走了的网站上。下面这些全部由同一个 tarball 里的源码生成，所以它描述的是你手上真正那个版本，而不是最近发布的那个。',
      '这件事最要紧的地方，恰好是模型最自信的地方。有那么几处命名和 shadcn/ui 不一样，凭习惯写的模型每次都写错——是 CardBody 不是 CardContent，是 THead/TBody/TR/TH/TD 不是 TableHeader 那一套，是 DialogContent 上的 title 属性而不是一个 DialogTitle 子元素。猜的结果是根本不存在的 import，最快的修法是别猜。',
    ],
    sections: {
      cli: {
        title: '在终端里',
        body: [
          '这个包带了一个可执行文件。`docs <Component>` 会把一个组件完整打印出来——每个属性连同它的类型和默认值、导出的联合类型、键盘约定、可访问性承诺，以及组件自己 JSDoc 上的 `@example` 块。',
          '它解析的不只是组件，还有部件和类型：`docs CardBody`、`docs TH` 和 `docs ButtonVariant` 都会落到正确的文件上，而且它会说清楚，把你转过去的那个名字归哪个组件所有。这就是一次 import 刚失败时该伸手去拿的命令，因为你手上那个标识符通常是一个部件，而不是导出它的那个东西。',
          '`docs --installed` 是这笔交易里便宜的那一半：解析出来的版本号，以及分好组的名字，不带属性表。它是该放在一次会话开头的东西。`--json` 把同样的内容给成机器可读的，其中包含那四个样式表 specifier。',
        ],
      },
      skill: {
        title: '装上这个 skill',
        body: [
          '这个包在 `skills/misoto22-design/` 下带了一个 agent skill，`init` 会把它复制到你项目的 `.claude/skills/misoto22-design/`。`--agents-md` 还会往你的 `AGENTS.md` 里追加一小节指向它；如果那个文件已经提到了这个包，它就什么都不动。',
          '这个 skill 是刻意做成渐进式的。在真正有东西碰到这个包之前，留在会话里的只有它的名字和描述；正文等工作推进到那里才加载，之后五个规则文件——tokens、composition、forms、accessibility、naming——再一个一个加载。它开头就是那张 shadcn/ui 命名对照表，而且只要其中任何一行不再成立，这个包自己的测试就会让构建失败。',
          '升级之后重跑一次。这个 skill 是一份副本，不是一个链接，所以装过一次的项目手上拿着的，是当时那个版本说的话。',
        ],
      },
      web: {
        title: '在网上',
        body: [
          '同样的内容也由这个站点以纯文本提供，给那些能抓 URL、却什么都没装的 agent。三种形态，在它们之间做选择是一笔预算：索引是一页，单个组件是一页，而全部内联展开就是整套系统。',
          '包已经装上了，就优先用 CLI。站点记录的是最近发布的那一版；`node_modules` 里放着的才是你的代码真正编译时对着的那一版，而这个分歧两边都看不见。',
        ],
        rows: {
          'ui.misoto22.com/llms.txt': '索引——这套系统是什么、八条法则、主题轴，以及每个组件一行。',
          'ui.misoto22.com/components/<slug>/llms.txt': '单个组件：属性、类型、键盘、可访问性、示例。一次抓取，一个组件。',
          'ui.misoto22.com/llms-full.txt': '索引，后面内联跟着每一个组件。只有在你真的需要全部时才伸手去拿。',
        },
      },
      emitted: {
        title: 'tarball 里有什么',
        body: [
          '生成出来的文档是构建产物，随发布的包一起发出去，所以其中没有一样需要网络。`dist/agent/` 里每个组件一个 Markdown 文件，一个 `index.md` 给出名字和各一行说明，还有一个 `catalog.json` 供 CLI 把一个部件或一个类型解析回它的归属组件。CLI 只是这个目录上薄薄的一层读取器；在源码 checkout 里它由 `pnpm build:agent` 构建出来，没有构建时 CLI 会明说，而不是什么都不打印。',
          '`skills/misoto22-design/` 与它一同发布，那正是 `init` 复制的东西。两者都列在包的 `files` 字段里，所以 `npm pack` 会把它们带上。',
        ],
      },
    },
  },
}

export function foundationCopy(locale: Locale, slug: string): FoundationCopy {
  return locale === 'zh' ? (FOUNDATIONS_ZH[slug] ?? {}) : {}
}

/** The eight laws. */
export interface LawCopy {
  title: string
  body: string
  rules_out: string
}

const LAWS_ZH: LawCopy[] = [
  {
    title: '底是纸。',
    body: '白色，不是米白，而且每一个表面都是同一个白。没有卡片色，没有抬升面板的色调，也没有那种悄悄变成第二种底色的“淡背景”。',
    rules_out: '一张靠“比页面白一点点”来把自己和页面分开的卡片。',
  },
  {
    title: '阴影永远不带模糊。',
    body: '这套系统没有光源，所以它没有高度阶梯。深度是一条细线、一次换底，或者一道没有模糊半径的硬墨偏移。',
    rules_out: 'box-shadow: 0 2px 8px rgba(0,0,0,.08)——以及它所属的整条刻度。',
  },
  {
    title: '线承担了色彩本该承担的工作。',
    body: '三种粗细，各自由它分隔的东西决定：细线分行，边线分块，实线压在报头下面。一个单色页面没有别的东西可以用来分隔。',
    rules_out: '五种逐个手调、谁也分不出差别的灰。',
  },
  {
    title: '文字只有两级，再往下就没有了。',
    body: '下限在白底上以 6.7:1 通过 AA。比它高的每一级都更深。第三种更浅的灰不是这里可以做的设计决定。',
    rules_out: '白底上的 #999，用来做一半读者看不见的“次要文字”。',
  },
  {
    title: '彩色绑定在状态上。',
    body: '绿、琥珀、红分别意味着成功、需要注意、失败。它们从不是装饰，而且含义永远被重复表达一次——用图标、用文字，或者两者都用。',
    rules_out: '因为这一行需要一点颜色，所以放了个蓝色徽章。',
  },
  {
    title: '一条阶梯，顶端属于页面自己。',
    body: '五级标题，在手机与整页之间流体变化，页面标题之上什么都没有。嵌套的两个标题必须跳一级，否则这套层级读起来不成立。',
    rules_out: '某个页面的卡片标题，比另一个页面自己的 h1 还大。',
  },
  {
    title: '主色就是墨色。',
    body: '在单色系统里，唯一的编辑性指针收拢到记号本身。过去由色相承担的，改由字重、下划线、填充胶囊或反色承担。',
    rules_out: '通过链接色或悬停态把品牌色重新引进来。',
  },
  {
    title: '暗色模式是换值，不是第二套配色。',
    body: '同一批 token 名字，不同的值。这正是组件读语义别名而从不读原始 token 的原因：模式一翻，别名自己就重新解析了。两个例外——照片上的文字，以及第三方品牌标——都在它们被定义的地方写明了，因为它们的底不是主题。',
    rules_out: '在某个组件自己的样式表里写一个 .dark 块，把这次换值的一侧冻住。',
  },
]

export function lawCopy(locale: Locale, index: number): LawCopy | undefined {
  return locale === 'zh' ? LAWS_ZH[index] : undefined
}

/** Templates. */
export const TEMPLATES_ZH: Record<string, { name?: string; summary?: string; tests?: string }> = {
  'activity-board': {
    name: '活动看板',
    summary: '一整屏的一周：四个数字、两条按类别分开的曲线、一列按严重程度排序的待办、一张分组表格，以及两张柱状图。',
    tests: '把控制台做成「网格」而不是一栏。每块瓦片的高度由行给定，而不是自己挑——正是在这里，一张按 16:9 给自己定尺寸的图表，和一个不这么做的空状态，会在同一格里读出两个高度。',
  },
  dashboard: {
    name: '控制台',
    summary: '一个后台：侧边栏、数字带、标签页、可筛选的表格，以及两张任务卡。',
    tests: '密度。十二个组件挤在一栏里，近到任何只在孤立状态下检查过的间距决定都会露出来。',
  },
  landing: {
    name: '落地页',
    summary: '一个营销页：主视觉、数字带、三个支点、一块反色定价板，以及一组常见问题。',
    tests: '留白。组件极少，空间极大，页面主要由排印阶梯撑着——和控制台恰好相反的失败模式。',
  },
  blog: {
    name: '博客列表',
    summary: '一个出版物索引：一条筛选栏、一篇头条，以及一列用细线分隔的记录。',
    tests: '长短不一的记录。卡片网格会把它们藏在等大的盒子里，细线列表不会——所以某一条摘要三行、下一条一行，立刻就看得出来。',
  },
  architecture: {
    name: '架构浏览器',
    summary: '把整块屏幕交给一张图：浮动工具条、可平移的画布、检查面板、缩略图、图例，以及它下面的结论。',
    tests: '围绕一个界面排布的 chrome，而不是和它堆在一栏里。画布之上的浮动条、出现在读者视线已经在的地方的面板、远角上的缩略图——只在一栏里检查过的间距决定，撑不过这一关。',
  },
  post: {
    name: '文章',
    summary: '一篇文章，由真正的 Markdown 文件经站点自己的管线渲染出来。',
    tests: '阅读面，面对的是这个仓库里没人手写过的标记：标题、表格、脚注、渲染成 MathML 的 LaTeX、任务列表、代码块和一张流程图，全部出自一个 .md 文件。',
  },
  settings: {
    name: '设置',
    summary: '一个工作区设置页：一条分区轨道、四组真实的控件，以及一条只在有改动时才存在的保存栏。',
    tests: '长页面上的表单密度。一行复选框、一行开关、一行单选，各自单独看间距都对，一旦叠起来它们就不再对“一行有多高”达成一致——而保存栏还得钉在最后一行之上，又不能把它盖住。',
  },
  'login-card': {
    name: '登录',
    summary: '一张居中的登录卡：邮箱和密码，一次被拒绝的尝试还留在屏幕上，一条分隔线下面是两个 SSO 按钮。',
    tests: '失败态——登录页真正被评判的就是这个态。只按顺利路径画出来的卡片，没有地方安放一次必须同时抵达表单、字段和读屏软件的拒绝。',
  },
  'table-filter': {
    name: '数据表格',
    summary: '一张什么都不缺的表格：筛选栏、已排序的列、带批量操作条的行选择，以及分页。',
    tests: '一张压在自己控件底下的表格。排序、选择、筛选各自单独看都对；放到一起，它们要抢同一行表头，批量条必须在不推动下面各行的前提下出现，而筛到一条不剩时也得落在“空状态”上，而不是一个空白矩形。',
  },
  'form-wizard': {
    name: '分步表单',
    summary: '创建一个部署环境的四个步骤：一侧是步骤条，旁边是当前步骤的字段，最后一步把填过的内容回读一遍。',
    tests: '它是一个序列，不是一个页面。Steps 只是一条展示用的轨道，它什么都不强制——它无从知道哪些字段属于当前标记的那一步——所以“轨道说到哪儿”和“表单显示什么”之间的接缝，要么在这里被收在一处，要么被悄悄抄成两份。',
  },
  'detail-page': {
    name: '记录详情',
    summary: '一条事故：一个带状态的标题块、正文、一条元信息侧栏，以及它身上发生过的活动。',
    tests: '两栏，但它们并不对等。正文是排在度量宽度上的散文，侧栏是十几条短事实，所以一个定义列表和一个段落必须共用同一套竖向节奏，而又不能让其中一边去定另一边的——这正是控制台永远检验不到的失败，因为控制台里所有东西形状都一样。',
  },
  states: {
    name: '加载、空、出错',
    summary: '每个真实页面都有的三种状态，并排画出来：一个骨架屏、一个空集合，以及一个失败了的页面。',
    tests: '没人会截图的那三种状态。它们各自写一次、发出去，之后再也不会被放在一起看——骨架屏因此长得和它所代表的东西不是一个形状，出错页因此读起来像一个空文件夹。',
  },
  'docs-shell': {
    name: '文档页',
    summary: '一个参考页：左边是章节侧栏，中间是带 props 表格和键盘说明的正文栏，右边还有一条目录。',
    tests: '三栏同时在场。一条侧栏加一条目录，把中间压得比任何其他模板都窄，而这个宽度正是表格、长标识符和标注框开始放不下、必须决定谁去横向滚动的那个宽度。',
  },
  pricing: {
    name: '定价',
    summary: '月付／年付开关后面的三档套餐、一张功能对照表，以及人们付钱前会问的那些问题。',
    tests: '一张必须在没有颜色的情况下胜出的卡片。这套系统只有一个主色、没有渐变，所以“推荐”是由 plate 变体、一种线宽和徽章的位置共同承担的——如果那读起来像是画错了而不是强调，就说明深度这条阶梯是错的。',
  },
}

export function templateCopy(locale: Locale, slug: string) {
  return locale === 'zh' ? (TEMPLATES_ZH[slug] ?? {}) : {}
}

/** The pages that are mostly prose. */
export const PAGE_ZH = {
  home: {
    eyebrow: 'misoto22 design',
    title: '归白',
    summary:
      '一套给软件、写作与摄影用的纯白单色设计系统。底是纸白，记号是近黑，文件里剩下的唯一彩色是状态——它绑定在状态上，永远不绑定品牌。',
    browse: '浏览组件',
    readPrinciples: '阅读设计原则',
    componentsCount: '{count} 个组件',
    builtOn: '构建于',
    figures: {
      components: '组件',
      tokens: 'Token',
      tokensNote: '亮色与暗色',
      radius: '圆角级数',
      radiusNote: '一个系数带动全部',
      shadow: '带模糊的阴影',
      shadowNote: '深度是一条细线',
    },
    installNote:
      '六个运行时依赖——Radix 负责没人该重写的行为，cmdk 负责 combobox 模式，react-day-picker 负责日历，Remix Icon 负责图标，sonner 负责 toast，clsx 加 tailwind-merge 负责让类名冲突按调用方的意思解决。没有路由、没有状态库、没有 CSS-in-JS。',
    tailwindNote:
      '把可移植的 token 层单独拿走，省掉第二份工具类。模式是 <html> 上的一个属性，所以它可以在首次绘制前写好，永远不会闪出错误的主题。',
  },
  principles: {
    title: '设计原则',
    summary: '八条规则，每一条都写成“可以拿一件具体的作品去指认它违反了哪条”。只说该往哪儿努力的原则，什么争论都解决不了。',
    rulesOut: '它排除了',
  },
  components: {
    title: '组件',
    summary: '{count} 个基础组件，按“它们做什么”分组，而不是按“它们由什么构成”。每一个都针对 token 层书写，所以没有一个自带颜色。',
  },
  templates: {
    title: '模板',
    summary:
      '组件目录回答“一张表格长什么样”。模板回答下一个问题——一个真实的屏幕需要哪些组件同时在场，以及当它们有十二个而不是一个时，彼此之间如何排布。',
    builtNote:
      '这里没有任何东西是为模板单独写的样式。只有这样它才能随着系统变化而保持诚实——带自己 CSS 的模板不再是对组件的检验，只是一张截图。',
  },
  changelog: {
    title: '更新日志',
    summary:
      '每一个对使用者可见的改动都随一个 changeset 一起发布，所以这些话是做这个改动的人在他理解它的那一刻写下的，而不是一个月后从提交标题里拼回来的。',
  },
} as const
