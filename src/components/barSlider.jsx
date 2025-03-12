import { useCallback, useEffect, useRef, useMemo } from 'react'
import Billboard from '../Billboard'
import { Text } from '@react-three/drei'
import { palette } from '../theme'
import { animated, useSpring } from '@react-spring/three'

export const BarSlider = ({
  index,
  position,
  scaledValue,
  depth,
  metalness,
  width,
  percent,
  allBars
}) => {
  const prevIndex = useRef(index) // Guarda el índice anterior

  // Ordenar las barras por valor de menor a mayor
  const sortedBars = useMemo(() => {
    return [...allBars].sort((a, b) => a.originalValue - b.originalValue)
  }, [allBars])

  
  // Obtener el nuevo índice basado en el ordenado
  const newIndex = sortedBars.findIndex((bar)=> bar.index === prevIndex.current) 

  
  // Calcular la nueva posición en X basada en el orden
  const newPosition = useMemo(() => {
    return allBars[newIndex]?.position ?? position
  }, [allBars, newIndex, position])


  // Animación de la posición
  const [{ animatedPosition }] = useSpring(() => ({
    animatedPosition: [
      newPosition.x,
      scaledValue / 2 - 0.70,
      newIndex * 0.3
    ],
    config: { mass: 1, tension: 170, friction: 26 },
  }))


  return (
    <>
      <animated.mesh
        position={animatedPosition}
        castShadow
        receiveShadow
        layers={{ enable: [2] }}
      >
        <boxGeometry args={[width, scaledValue, depth]} />
        <meshStandardMaterial metalness={metalness} color={palette[prevIndex.current]} opacity={1} />
      </animated.mesh>

      <Billboard>
        <Text
          position={[
            newPosition?.x,
            (-0.6 + scaledValue),
            newPosition?.z + depth / 2,
          ]}
          castShadow={false}
          fontSize={0.08}
          maxWidth={1}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign={'center'}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
          color="white"
          outlineWidth={'10%'}
          outlineColor="#000000"
          outlineOpacity={1}
        >
          {parseFloat(percent).toFixed(2) + '%'}
        </Text>
      </Billboard>
    </>
  )
}
