import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Meat = (props) => (
  <Svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11Z"
      fill="#99AAB5"
    />
    <Path
      d="M11 19.556a8.556 8.556 0 1 0 0-17.112 8.556 8.556 0 0 0 0 17.112Z"
      fill="#E1E8ED"
    />
    <Path
      d="M11 11.611a.611.611 0 0 1-.611-.611V3.667a.611.611 0 0 1 1.222 0V11a.61.61 0 0 1-.611.611Z"
      fill="#67757F"
    />
    <Path
      d="M11 11.611a.611.611 0 0 1-.547-.338L8.01 6.384a.611.611 0 0 1 1.093-.547l2.444 4.89a.611.611 0 0 1-.545.884Z"
      fill="#67757F"
    />
  </Svg>
)

export default Meat;