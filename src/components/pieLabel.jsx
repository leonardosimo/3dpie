// import { useRef } from 'react'
// import useClipPathAngle from '../hooks/useClipPathAngle'
import { typeChartConst } from '../constants'
import { palette } from '../theme'

const positionLabelPie = [
  { top: '22vh', left: '15vw' },
  { top: '50vh', left: '70vw' },
  { top: '60vh', left: '15vw' },
]

const positionLabelBar = [
  { top: '22vh', left: '15vw' },
  { top: '32vh', left: '15vw' },
  { top: '42vh', left: '15vw' },
]

const positionLabel = {
  [typeChartConst.PIE]: positionLabelPie,
  [typeChartConst.BAR]: positionLabelBar,
}



export default function PieLabel({ optionData, idx , typeChart = typeChartConst.PIE }) {
//   const refDiv = useRef(null)
//   const angle = useClipPathAngle(refDiv)
  
  return (
    <div
      key={idx}
      className="fixed pointer-events-none origin-top-left"
      style={{
        top: positionLabel?.[typeChart]?.[idx]?.top,
        left: positionLabel?.[typeChart]?.[idx]?.left,
      }}
    >
      <div  className="relative max-h-[10vh] border-2 min-h-[5vh] gap-2 py-2 px-5 flex items-center">
        {/* <div
          className="absolute h-[calc(110%_+_3px)] top-[0px] right-[-1px] w-[2px] bg-white  origin-top-right"
        //   style={{ transform: `rotate(${angle}deg)` }}
        ></div>
        <div
          className="absolute h-[calc(110%_+_3px)] top-[0px] left-[calc(10%-3px)] w-[2px] bg-white rotate-[25deg] origin-top-right"
        //   style={{ transform: `rotate(${angle}deg)` }}
        ></div> */}

        <div
          style={{ backgroundColor: palette[idx % palette.length] }}
          className="h-[3vh] w-[2rem]"
        />
        <span className=" font-bold text-3xl text-center uppercase text-white">
          {optionData.category}
        </span>
      </div>
    </div>
  )
}
