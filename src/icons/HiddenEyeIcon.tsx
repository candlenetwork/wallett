import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'
import Colors from 'src/styles/colors'

export interface Props {
  size?: number
  color?: Colors
}

function HiddenEyeIcon({ color, size }: Props) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" testID="HiddenEyeIcon">
      <G fill={color} stroke={color} clipPath="url(#a)">
        <Path d="m19.665 12.356.108-.22-.108-.22A8.494 8.494 0 0 0 12 7.136a8.494 8.494 0 0 0-7.665 4.78l-.108.22.108.22A8.485 8.485 0 0 0 12 17.136a8.485 8.485 0 0 0 7.665-4.78Zm-16.125-.22C4.928 8.826 8.192 6.5 12 6.5c3.808 0 7.072 2.326 8.46 5.636-1.388 3.311-4.652 5.637-8.46 5.637-3.808 0-7.072-2.326-8.46-5.637Zm11.006 0a2.546 2.546 0 1 0-5.093.002 2.546 2.546 0 0 0 5.093-.002Zm-5.728 0A3.187 3.187 0 0 1 12 8.955a3.187 3.187 0 0 1 3.182 3.181A3.187 3.187 0 0 1 12 15.318a3.187 3.187 0 0 1-3.182-3.182Z" />
        <Path d="m19.666 11.622.106-.219-.107-.218A8.494 8.494 0 0 0 12 6.405c-.505 0-.991.056-1.461.14l-.555-.555A9.212 9.212 0 0 1 12 5.768c3.808 0 7.072 2.326 8.46 5.637a9.137 9.137 0 0 1-2.05 3.011l-.442-.443a8.357 8.357 0 0 0 1.698-2.35Zm-7.441-3.391a3.17 3.17 0 0 1 2.942 2.941l-.885-.885a2.546 2.546 0 0 0-1.173-1.172l-.884-.884ZM4.98 4.708 18.78 18.514l-.446.447-2.445-2.445-.232-.232-.305.121a9.095 9.095 0 0 1-3.351.636c-3.808 0-7.073-2.326-8.46-5.637a9.111 9.111 0 0 1 2.788-3.656L6.77 7.4 6.373 7l-1.84-1.84.448-.453Zm5.335 6.237-.853-.854V11.292a.88.88 0 0 0-.008.113A2.546 2.546 0 0 0 12 13.95c.098 0 .185-.023.214-.03l.005-.001.857-.215-.624-.624-2.136-2.135ZM7.534 8.163l-.308-.309-.348.264a8.601 8.601 0 0 0-2.543 3.067l-.108.22.108.22A8.494 8.494 0 0 0 12 16.404c.827 0 1.624-.122 2.382-.329l.83-.227-.608-.609-.802-.802-.24-.239-.31.133a3.187 3.187 0 0 1-4.434-2.927c0-.446.092-.872.256-1.264l.13-.31-.238-.236-1.432-1.432Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={Colors.contentInverse} d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

HiddenEyeIcon.defaultProps = {
  size: 24,
  color: Colors.contentPrimary,
}

export default HiddenEyeIcon
