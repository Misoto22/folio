import { BulletChart } from '@misoto22/folio/charts'

// One shared 0–100 scale, so the bands mean the same thing on every row and
// the measures can be compared with each other as well as with their targets.
const data = [
  { name: 'Availability', value: 96, target: 99 },
  { name: 'Support CSAT', value: 84, target: 80 },
  { name: 'Onboarding completion', value: 61, target: 75 },
  { name: 'Docs coverage', value: 43, target: 70 },
]

/**
 * Four measures on one shared 0 to 100 scale, so the bands mean the same thing on
 * every row and the rows can be compared with each other as well as each against
 * its own target. The bar is the measurement and the rule across it is the target:
 * two different kinds of number, which is why the target is not drawn as a second
 * bar beside it. The bands are a judgement someone made, drawn in the same ink as
 * the measurement, and they compress — a value clearing a boundary by a point sits
 * in the same band as one clearing it by thirty, so a band answers whether a
 * number is acceptable and never by how much. No rendering engine and no state:
 * each row is one linear scale laid out as plain HTML with logical properties,
 * which is server-renderable and mirrors correctly in a right-to-left document
 * where an SVG drawn in user space would not.
 */
export function Example() {
  return (
    <BulletChart
      title="Quarterly targets"
      showTitle
      description="Bar is the measure, rule is the target"
      data={data}
      ranges={[50, 80]}
      domain={[0, 100]}
    />
  )
}
