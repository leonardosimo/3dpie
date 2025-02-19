import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import Pie from './Pie'
import Turntable from './Turntable'
import useInputControls, { pieDataFromControls } from './useInputControls'
import { Leva } from 'leva'
import useFramePie from './hooks/useFramePie'
import PieLabel from './components/pieLabel'
// import { Effects } from './Effect'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Effects } from './Effect'

function App() {
  const orbitControlsRef = useRef()
  const [controlValues, set, setMain] = useInputControls()
  const data = pieDataFromControls(controlValues)

  const [message, setMessage] = useState('Esperando datos...')
  const [loading, setLoading] = useState(false)

  const dataOptionPie3D = useFramePie((data) => {
    if (
      data?.optionPie3D &&
      Array.isArray(data.optionPie3D) &&
      setMain &&
      set
    ) {
      const dataOption = Object.values(
        data.optionPie3D.reduce((acc, curr) => {
          const { category, value, fill } = curr
          const normalizedCategory = category
            .trim()
            .toLowerCase()
            .replace(/[-\s]+/g, ' ')

          if (!acc[normalizedCategory]) {
            acc[normalizedCategory] = {
              category: category.trim(),
              value: 0,
              fill,
            }
          }
          acc[normalizedCategory].value += value

          return acc
        }, {})
      )

      // Mínimo valor para asegurar una buena visualización
      // const totalValue = dataOptionPie3D.reduce(
      //   (sum, { value }) => sum + value,
      //   0
      // )
      // const minSegmentValue = totalValue * 0.02 // Mínimo 2% del total

      // dataOptionPie3D.forEach((item) => {
      //   if (item.value < minSegmentValue) {
      //     item.value = minSegmentValue
      //   }
      // })

      return dataOption
    }
    return data
  })

  useEffect(() => {
    if (loading) {
      setMain({
        valuesAsPercent: false,
        cornerRadius: 0.0,
        outerRadius: 60,
        padAngle: 0.1,
        innerRadius: 0.0,
        valueLabelPosition: 1,
      })
    }
  }, [loading, setMain])

  useEffect(() => {
    const dataValidate =
      dataOptionPie3D &&
      Array.isArray(dataOptionPie3D) &&
      dataOptionPie3D.length > 0
    if (!dataValidate) return

    setMain({
      numSlices: dataOptionPie3D?.length ?? 0,
    })

    if (
      dataOptionPie3D?.length > 0 &&
      controlValues?.['value' + (dataOptionPie3D?.length - 1)]
    ) {
      dataOptionPie3D?.map((optionData, idx) => {
        if (optionData?.value && optionData?.fill && optionData?.category) {
          set({
            [`value${idx}`]: parseInt(optionData?.value)
              ? parseInt(optionData?.value)
              : 10,
            [`color${idx}`]: optionData?.fill,
            [`label${idx}`]: optionData?.category,
          })
        }
        return optionData
      })
    }

    setMessage('')
    setLoading(true)
  }, [dataOptionPie3D, set, setMain, controlValues])

  return (
    <div
      id="canvas-container"
      className="w-full h-full"
      style={{ backgroundColor: controlValues.backgroundColor }}
    >
      <Leva
        collapsed={window.innerWidth < 800}
        hidden
        titleBar={{ title: 'Customize Pie' }}
      />

      <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 2, 3], fov: 20 }}>
        <ambientLight intensity={2} />
        <spotLight
          intensity={10}
          angle={-1}
          penumbra={1}
          position={[4, 2, 3]}
          castShadow
        />
        <Suspense fallback={null}>
          <Turntable
            enabled={controlValues.spinSpeed > 0}
            speed={controlValues.spinSpeed * 0.02}
          >
            <Pie
              // ref={pieRef}
              data={data}
              innerRadius={controlValues.innerRadius}
              outerRadius={controlValues.outerRadius}
              cornerRadius={controlValues.cornerRadius}
              padAngle={controlValues.padAngle}
              roughness={controlValues.roughness}
              metalness={controlValues.metalness}
              valueLabelPosition={controlValues.valueLabelPosition}
              showValues={controlValues.showValues}
              valuesAsPercent={controlValues.valuesAsPercent}
              onClickSlice={(i) =>
                set({ [`explode${i}`]: !controlValues[`explode${i}`] })
              }
            />
          </Turntable>
          <Effects />
        </Suspense>

        {controlValues.environmentFile && (
          <Suspense fallback={null}>
            <Environment path="/hdri/" files={controlValues.environmentFile} />
          </Suspense>
        )}

        <ContactShadows
          rotation-x={Math.PI / 2}
          position={[0, -0.4, 0]}
          opacity={0.65}
          width={30}
          height={30}
          blur={1.5}
          far={0.8}
        />

        <OrbitControls
          ref={orbitControlsRef}
          maxPolarAngle={Math.PI / 2}
          enablePan={false}
        />
      </Canvas>

      <div
        className="absolute w-full mx-auto text-3xl font-black text-center pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          maxWidth: `${controlValues.titleMaxWidth}vw`,
          transform: `translate(-50%, ${controlValues.titleOffset}vh)`,
          textShadow: '0px 0px 10px rgba(0,0,0,0.5)',
        }}
      >
        {message}
      </div>
      {dataOptionPie3D?.length > 0 && (
        <>
          {dataOptionPie3D?.map((optionData, idx) => {
            if (optionData?.value && optionData?.fill && optionData?.category) {
              return <PieLabel optionData={optionData} idx={idx} />
            }
            return null
          })}
        </>
      )}
    </div>
  )
}

export default App
