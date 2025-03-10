import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import Pie from './Pie'
import Turntable from './Turntable'
import useInputControls, { pieDataFromControls } from './useInputControls'
import { Leva } from 'leva'
import useFramePie from './hooks/useFramePie'
import PieLabel from './components/pieLabel'
import { Effects } from './Effect'
import { Bar } from './components/bar'
import { typeChartConst } from './constants'
import { SceneBackground } from './components/SceneBackground'

function App() {
  const orbitControlsRef = useRef()
  const [controlValues, set, setMain] = useInputControls()
  const data = pieDataFromControls(controlValues)

  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const { dataOptionPie3D, typeChart } = useFramePie((data) => {
    if (
      data?.optionPie3D &&
      Array.isArray(data.optionPie3D) &&
      setMain &&
      set
    ) {
      const dataOption = Object.values(
        data.optionPie3D.reduce((acc, curr) => {
          const { category, value, fill } = curr
          if (
            category &&
            parseInt(category) >= 0 &&
            !isNaN(parseInt(category))
          ) {
            // validamos que no sea un número
            return acc
          }

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

      return {
        dataOptionPie3D: dataOption.map(
          (data) => ({
            ...data,
            value: data.category === 'Empate' ? '20000000' : data.value,
          }),
          []
        ),
        typeChart: data?.typeChart,
      }
    }

    return {
      ...data,
      dataOptionPie3D: [],
      typeChart: null,
    }
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

    setMessage(true)
    setLoading(true)
  }, [dataOptionPie3D, set, setMain, controlValues])

  return (
    <div
      id="canvas-container"
      className="w-full h-full"
      style={{ backgroundColor: controlValues.backgroundColor }}
    >
      <div className="fixed top-[15vh] left-[12vw] z-10 origin-top-left pointer-events-none">
        <div className="parallelogram-container">
          <div className="border border-top">
            <div className="relative w-full h-full z-10">
              <div className="absolute top-0 left-0 h-full w-[300px]  rounded-full opacity-0 z-20"></div>
            </div>
          </div>
          <div className="border border-bottom">
            <div className="relative w-full h-full z-10">
              <div className="absolute top-0 right-0 h-full w-[300px] rounded-full opacity-0 z-20"></div>
            </div>
          </div>
          <div className="border border-left">
            <div className="relative w-full h-full z-10">
              <div className="absolute bottom-0 left-0 h-[300px] w-full  rounded-full opacity-0 z-20"></div>
            </div>
          </div>
          <div className="border border-right">
            <div className="relative w-full h-full z-10">
              <div className="absolute top-0 left-0 h-[300px] w-full rounded-full opacity-0 z-20"></div>
            </div>
          </div>
        </div>
      </div>
      <Leva
        collapsed={window.innerWidth < 800}
        hidden
        titleBar={{ title: 'Customize Pie' }}
      />

      <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 2, 3], fov: 20 }}>
        <ambientLight intensity={2} />
        {typeChart !== typeChartConst.BAR && (
          <spotLight
            intensity={10}
            angle={-1}
            penumbra={1}
            position={[4, 2, 3]}
            castShadow
          />
        )}

        <SceneBackground />
        <Suspense fallback={null}>
          <Turntable
            enabled={controlValues.spinSpeed > 0}
            speed={controlValues.spinSpeed * 0.02}
          >
            {typeChart === typeChartConst.PIE && (
              <>
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
              </>
            )}
            {typeChart === typeChartConst.BAR && (
              <>
                <Bar metalness={controlValues.metalness} dataBar={data} />
              </>
            )}
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

      {message === null && (
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
          Esperando datos...
        </div>
      )}
      {dataOptionPie3D?.length > 0 && (
        <>
          {[...dataOptionPie3D]
            .sort((a, b) => b.value - a.value)
            .map((optionData, idx) => {
              if (
                optionData?.value &&
                optionData?.fill &&
                optionData?.category
              ) {
                return (
                  <PieLabel
                    key={idx}
                    optionData={optionData}
                    idx={idx}
                    typeChart={typeChart}
                  />
                )
              }
              return null
            })}
        </>
      )}
    </div>
  )
}

export default App
