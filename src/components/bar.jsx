import { useEffect, useRef } from 'react'
import { MakeBar } from '../makeBar'
import { BarSlider } from './barSlider'

export const Bar = ({ metalness, dataBar }) => {
  // Generar las barras con una profundidad adecuada
  const { bars } = MakeBar(dataBar, 0.7, 1.1, 0.5)

  const groupRef = useRef(null)
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = ((Math.PI / 2 ) + 0.6) // Cambia estos valores según la dirección deseada
    }
  }, [])

  if (!metalness) {
    return <></>
  }

  return (
    <>
      <directionalLight 
        intensity={10}
        position={[-10, 1, -10]}
        penumbra={10}
        castShadow
        shadow-mapSize-width={10} // Mejor calidad de sombra
        shadow-mapSize-height={10}
        shadow-camera-left={-5}  // Reduce el área de la sombra
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        
      />

      <spotLight
        intensity={30}
        position={[0, 4, 0]}
        penumbra={5}
        castShadow
      />
      {/* Plano base para recibir sombras */}
      <mesh
        rotation={[-(Math.PI / 2), -0.01, 0]}
        position={[0, -0.75, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.5} />
      </mesh>

      {/* Barras */}
      <group ref={groupRef}>
        {bars.map(({ position, width, scaledValue, depth, percent, index }, i) => (
          <BarSlider
            key={i}
            index={index}
            position={position}
            scaledValue={scaledValue}
            depth={depth}
            metalness={metalness}
            width={width}
            percent={percent}
            allBars={bars}
          />
        ))}
      </group>
    </>
  )
}
