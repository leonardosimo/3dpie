// import { useRef } from 'react'
// import useClipPathAngle from '../hooks/useClipPathAngle'
import { palette } from '../theme'

const positionLabel = [
  { top: '15vh', left: '15vw' },
  { top: '50vh', left: '67vw' },
  { top: '60vh', left: '10vw' },
]
export default function PieLabel({ optionData, idx }) {
//   const refDiv = useRef(null)
//   const angle = useClipPathAngle(refDiv)
  
  return (
    <div
      key={idx}
      className="fixed pointer-events-none"
      style={{
        top: positionLabel[idx].top,
        left: positionLabel[idx].left,
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
        <span className=" font-bold text-xl text-center uppercase text-white">
          {optionData.category}
        </span>
      </div>
    </div>
  )
}
