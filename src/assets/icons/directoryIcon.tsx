import React, { memo } from 'react'
import { IIconProps } from '../../global/interfaces'

const DirectoryIcon = (props: IIconProps) => {
    const { width = 48, height = 48 } = props

    return (<svg version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 640 640"
        width={`${width}px`}
        height={`${height}px`}>
        <defs>
            <path d="M291.71 105.04C284.21 97.55 274.04 93.33 263.43 93.33C243.75 93.33 86.34 93.33 66.67 93.33C51.93 93.33 40 105.27 40 120C40 160 40 480 40 520C40 534.73 51.93 546.67 66.67 546.67C117.33 546.67 522.67 546.67 573.33 546.67C588.07 546.67 600 534.73 600 520C600 485.33 600 208 600 173.33C600 158.6 588.07 146.67 573.33 146.67C550.44 146.67 367.27 146.67 344.37 146.67C337.31 146.67 330.52 143.85 325.52 138.85C318.76 132.09 295.09 108.42 291.71 105.04Z" id="dTOMN48q9">
            </path>
            <path d="M331.39 148.61C332.63 147.37 334.32 146.67 336.09 146.67C359.82 146.67 549.61 146.67 573.33 146.67C588.07 146.67 600 158.6 600 173.33C600 208 600 485.33 600 520C600 534.73 588.07 546.67 573.33 546.67C522.67 546.67 117.33 546.67 66.67 546.67C51.93 546.67 40 534.73 40 520C40 488.67 40 238 40 206.67C40 202.99 42.99 200 46.67 200C68.9 200 246.73 200 268.96 200C276.03 200 282.81 197.19 287.81 192.19C296.53 183.47 327.03 152.97 331.39 148.61Z" id="a583nY6oB">
            </path>
        </defs>
        <g>
            <g>
                <g><use xlinkHref="#dTOMN48q9"
                    opacity="1"
                    fill="#ffc600"
                    fillOpacity="1">
                </use>
                    <g>
                        <use xlinkHref="#dTOMN48q9"
                            opacity="1"
                            fillOpacity="0"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeOpacity="0">
                        </use>
                    </g>
                </g>
                <g>
                    <use xlinkHref="#a583nY6oB"
                        opacity="1"
                        fill="#ffba00"
                        fillOpacity="1">
                    </use>
                    <g>
                        <use xlinkHref="#a583nY6oB"
                            opacity="1"
                            fillOpacity="0"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeOpacity="0">
                        </use>
                    </g>
                </g>
            </g>
        </g>
    </svg>)
}

export default memo(DirectoryIcon)