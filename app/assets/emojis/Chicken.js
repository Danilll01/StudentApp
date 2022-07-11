import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Chicken = (props) => (
  <Svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8.34 6.269 4.704 2.635c.527-.633.5-1.57-.093-2.164A1.607 1.607 0 0 0 1.89 1.89 1.607 1.607 0 0 0 .471 4.612c.594.594 1.531.62 2.164.093L6.269 8.34l2.07-2.07Z"
      fill="#FFD983"
    />
    <Path
      d="M20.114 20.115c1.036-1.035 3.653-5.478.03-9.1-2.525-2.524-4.557-2.38-8.343-3.318-1.553-.517-3.576-2.383-4.094-2.9-.518.517-.337 2.407-.337 2.407s-2.254.183-2.772.701c.518.518 2.922 2.792 3.342 3.86 1.132 3.59 1.003 5.416 3.526 7.94 4.142 4.141 7.614 1.445 8.649.41Z"
      fill="#C1694F"
    />
  </Svg>
)

export default Chicken;