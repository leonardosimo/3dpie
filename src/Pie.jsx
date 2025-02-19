import React, { forwardRef } from 'react'
import PieSlice from './PieSlice'
import { useCachedPie } from './hooks/useCachePie'
import { sum } from 'd3-array'

const DEFAULT_EXTRUDE_SETTINGS = {
  curveSegments: 256,
  steps: 2,
  depth: 1, // should be 1 for our scaling to wokr
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelOffset: 0.0,
  bevelSegments: 1,
}

const Pie = ({
  data: inputData,
  innerRadius = 2,
  outerRadius = 100,
  cornerRadius = 0,
  padAngle = 0.05,
  roughness,
  metalness,
  onClickSlice,
  valueLabelPosition,
  showValues,
  valuesAsPercent,
}) => {
  // note we read data out to get the cached version that is in sync with our pie
  const { data, arcs, shapes, arcGenerator } = useCachedPie(
    inputData,
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle
  )
  if (!shapes) return null
  const totalValue = sum(arcs, (d) => {
    return d.data.originalValue
  })
  const minValueIndex = data.reduce(
    (min, item, i) =>
      item.value < min.value ? { index: i, value: item.value } : min,
    { value: Infinity, index: -1 }
  ).index

  const maxValueIndex = data.reduce(
    (max, item, i) =>
      item.value > max.value ? { index: i, value: item.value } : max,
    { value: 0, index: -1 }
  ).index

  
  return (
    <group>
      {shapes.map((shape, i) => {
        return (
          <PieSlice
            key={i}
            shape={shape}
            i={i}
            isMinPie={i === minValueIndex}
            isMaxPie={i === maxValueIndex}
            totalValue={totalValue}
            height={data[i].height}
            offset={data[i].offset}
            extrudeSettings={DEFAULT_EXTRUDE_SETTINGS}
            datum={data[i]}
            arcs={arcs}
            arcGenerator={arcGenerator}
            onClick={onClickSlice}
            roughness={roughness}
            metalness={metalness}
            valueLabelPosition={valueLabelPosition}
            showValue={showValues}
            valueAsPercent={valuesAsPercent}
          />
        )
      })}
    </group>

  )
}

export default Pie
