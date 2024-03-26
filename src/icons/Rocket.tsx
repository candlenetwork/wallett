import * as React from 'react'
import Colors from 'src/styles/colors'
import Svg, { Path } from 'svgs'

interface Props {
  size?: number
  color?: string
}

const Rocket = ({ size = 24, color = Colors.black }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="m3.65 8.025 1.95.825c.233-.467.475-.917.725-1.35.25-.433.525-.867.825-1.3l-1.4-.275-2.1 2.1ZM7.2 10.1l2.85 2.825c.7-.267 1.45-.675 2.25-1.225s1.55-1.175 2.25-1.875a13.455 13.455 0 0 0 2.738-3.887c.658-1.425.945-2.738.862-3.938-1.2-.083-2.517.204-3.95.863A13.4 13.4 0 0 0 10.3 5.6c-.7.7-1.325 1.45-1.875 2.25S7.467 9.4 7.2 10.1Zm4.45-1.625a1.92 1.92 0 0 1-.575-1.412c0-.559.192-1.03.575-1.413.383-.383.858-.575 1.425-.575.567 0 1.042.192 1.425.575.383.383.575.854.575 1.413a1.92 1.92 0 0 1-.575 1.412c-.383.383-.858.575-1.425.575-.567 0-1.042-.192-1.425-.575Zm.475 8.025 2.1-2.1-.275-1.4c-.433.3-.867.57-1.3.813-.433.241-.883.479-1.35.712l.825 1.975ZM19.95.175c.317 2.017.12 3.98-.587 5.888-.709 1.908-1.93 3.729-3.663 5.462L16.2 14c.067.333.05.658-.05.975-.1.317-.267.592-.5.825l-4.2 4.2-2.1-4.925L5.075 10.8.15 8.7l4.175-4.2c.233-.233.512-.4.837-.5.325-.1.655-.117.988-.05l2.475.5c1.733-1.733 3.55-2.958 5.45-3.675 1.9-.717 3.858-.917 5.875-.6Zm-18.025 13.8c.583-.583 1.296-.88 2.137-.887.842-.009 1.555.279 2.138.862s.87 1.296.862 2.138c-.008.841-.304 1.554-.887 2.137-.417.417-1.113.775-2.088 1.075-.975.3-2.32.567-4.037.8.233-1.717.5-3.062.8-4.037.3-.975.658-1.671 1.075-2.088Zm1.425 1.4c-.167.167-.333.47-.5.913a6.463 6.463 0 0 0-.35 1.337c.45-.067.896-.18 1.337-.337.442-.159.746-.321.913-.488.2-.2.308-.442.325-.725a.907.907 0 0 0-.275-.725.946.946 0 0 0-.725-.287 1.033 1.033 0 0 0-.725.312Z"
    />
  </Svg>
)
export default Rocket