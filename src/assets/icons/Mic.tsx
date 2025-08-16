import * as React from "react"
import { SVGProps } from "react"
const Mic = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#525866"
      d="M8 2.6a1.8 1.8 0 0 0-1.8 1.8v2.4a1.8 1.8 0 1 0 3.6 0V4.4A1.8 1.8 0 0 0 8 2.6Zm0-1.2a3 3 0 0 1 3 3v2.4a3 3 0 0 1-6 0V4.4a3 3 0 0 1 3-3Zm-5.367 6h1.209a4.201 4.201 0 0 0 8.315 0h1.21A5.402 5.402 0 0 1 8.6 12.167V14.6H7.4v-2.433A5.403 5.403 0 0 1 2.633 7.4Z"
    />
  </svg>
)
export default Mic