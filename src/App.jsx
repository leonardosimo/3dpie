import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import Effects from './Effects'
import Pie from './Pie'
import Turntable from './Turntable'
import useInputControls, { pieDataFromControls } from './useInputControls'
import { Leva } from 'leva'
import useFramePie from './hooks/useFramePie'

function App() {
  const orbitControlsRef = useRef()
  const [controlValues, set, setMain] = useInputControls()
  const data = pieDataFromControls(controlValues)

  const [message, setMessage] = useState('Esperando datos...')

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
    setMain({
      valuesAsPercent: false,
      cornerRadius: 20,
      outerRadius: 200,
      padAngle: 0.2,
      innerRadius: 10,
      valueLabelPosition: 1,
    })
  }, [setMain, dataOptionPie3D])

  useEffect(() => {
    const dataValidate =
      dataOptionPie3D &&
      Array.isArray(dataOptionPie3D) &&
      dataOptionPie3D.length > 0
    if (!dataValidate) return
    setMain({
      numSlices: dataOptionPie3D?.length ?? 0,
    })
    if (controlValues?.value1) {
      dataOptionPie3D?.forEach((optionData, idx) => {
        if (optionData?.value && optionData?.fill && optionData?.category) {
          set({
            [`value${idx}`]: parseInt(optionData?.value)
              ? parseInt(optionData?.value)
              : 10,
            [`color${idx}`]: optionData?.fill,
            [`label${idx}`]: optionData?.category,
          })
        }
      })
    }

    setMessage('')
  }, [dataOptionPie3D, set, setMain, controlValues?.value1])

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

      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 3, 4], fov: 50 }}>
        <ambientLight intensity={controlValues.ambientLightIntensity} />
        <spotLight
          intensity={controlValues.spotLightIntensity}
          angle={0.1}
          penumbra={1}
          position={[10, 15, 10]}
          castShadow
        />

        <Suspense fallback={null}>
          <Turntable
            enabled={controlValues.spinSpeed > 0}
            speed={controlValues.spinSpeed * 0.02}
          >
            <Pie
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

        {controlValues.showBloom && (
          <Effects
            backgroundColor={controlValues.backgroundColor}
            bloomStrength={controlValues.bloomStrength}
            bloomThreshold={controlValues.bloomThreshold}
            bloomRadius={controlValues.bloomRadius}
          />
        )}
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
    </div>
  )
}

export default App
