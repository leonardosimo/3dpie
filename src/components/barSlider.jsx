import { useCallback, useMemo } from 'react'
import Billboard from '../Billboard'
import { Text } from '@react-three/drei'
import { palette } from '../theme'

export const BarSlider = ({
  index,
  position,
  scaledValue,
  depth,
  metalness,
  width,
  percent,
}) => {
  
  // const refMesh = useRef(null)
  const calcZChildren = useCallback((indexChild) => {
    return indexChild * 0.3
  }, [])
  
  const positions = useMemo(() => {
    return [
      position.x , // X
      scaledValue / 2 - 0.70,
      calcZChildren(index),
    ]
  }, [calcZChildren, index, position.x, scaledValue])

  return (
    <>
      <mesh
        // ref={refMesh}
        position={[positions?.[0], positions?.[1], positions?.[2]]}
        castShadow
        receiveShadow
        layers={{ enable: [2] }}
      >
        <boxGeometry args={[width, scaledValue, depth]} />
        <meshStandardMaterial metalness={metalness} color={palette[index % palette.length]} opacity={1} />
      </mesh>
      <Billboard>
        <Text
          position={[
            positions?.[0],
            positions?.[1] + scaledValue / 2 + 0.1,
            positions?.[2] + depth / 2,
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
          {parseFloat(percent).toFixed(2) +'%'}
        </Text>
      </Billboard>
    </>
  )
}
