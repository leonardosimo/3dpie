import * as THREE from 'three'
import {
  animated,
  config as springConfigs,
  useSpring,
} from '@react-spring/three'
import { Text, shaderMaterial } from '@react-three/drei'
import { format } from 'd3-format'
import React from 'react'
import Billboard from './Billboard'
import { palette } from './theme'
import { extend } from '@react-three/fiber'

const springConfig = springConfigs.wobbly

// Definimos un material personalizado
const GlowMaterial = shaderMaterial(
  { color: new THREE.Color('red'), glowColor: new THREE.Color('black') },
  `
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
  `
  varying vec3 vNormal;
  uniform vec3 color;
  uniform vec3 glowColor;

  void main() {
    float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1)), 2.0);
    vec3 glow = glowColor * intensity * 2.0;
    gl_FragColor = vec4(color + glow, 1.0);
  }
  `
)

extend({ GlowMaterial })

const PieSlice = ({
  i,
  shape,
  arcs,
  datum,
  arcGenerator,
  extrudeSettings,
  totalValue,
  height,
  onClick,
  valueLabelPosition = 0.5,
  offset = 0,
  roughness = 0.2,
  metalness = 0,
  formatter = format('.0%'),
  showValue = true,
  valueAsPercent = true,
  isMinPie = false,
  isMaxPie = false,
}) => {
  const arc = arcs[i]
  const label = datum.label
  // console.log("color ----------->", datum?.color);

  const color = palette[i % palette.length]
  let xOffset = 0
  let zOffset = 0
  // explode the pieces
  // 1. we need to get middle angle of the slice
  const theta = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2

  // 2. unit direction vector to offset by
  let explosionMagnitude = 0.2
  if (datum.explode) {
    xOffset = Math.cos(theta) * explosionMagnitude
    zOffset = Math.sin(theta) * explosionMagnitude
  }

  const innerRadius = arcGenerator.innerRadius()(arc)
  const outerRadius = arcGenerator.outerRadius()(arc)
  const labelPosition =
    (valueLabelPosition * (outerRadius - innerRadius) + innerRadius) * 0.01
  let xText = Math.cos(theta) * labelPosition
  let zText = Math.sin(theta) * labelPosition
  const yTextOffset = 0.125
  // glorious idea for laziness
  // const percent = (arc.endAngle - arc.startAngle) / (Math.PI * 2)
  const percent = arc.data.originalValue / totalValue
  const calculatedHeight = Math.max(
    (0.6 *
      parseInt(
        format('.0%')(arc.data.originalValue / totalValue).split('%')[0]
      )) /
      100,
    height * 0.5
  )
  const springProps = useSpring({
    // xOffset,
    // zOffset,
    height,
    calculatedHeight,
    position: [
      xOffset,
      calculatedHeight - 0.4,
      zOffset,
    ],
    config: springConfig,
  })

  const extrudeGeometryArgs = React.useMemo(
    () => [shape, extrudeSettings],
    [shape, extrudeSettings]
  )

  return (
    <>
    {/* <animated.group
      userData={{ isMinPie }}
      position={springProps.position}
      layers={1}
    >
      <animated.mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={springProps.calculatedHeight.to((height) => [1, 1, height])}
        receiveShadow
      >
        <extrudeGeometry args={extrudeGeometryArgs} />
        <glowMaterial
          color={color}
          glowColor="black"
        />
      </animated.mesh>
    </animated.group> */}
    <animated.group
      userData={{ isMinPie }}
      key={i}
      position={springProps.position}
    >
      <animated.mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={springProps.calculatedHeight.to((height) => [1, 1, height])}
        onClick={(evt) => {
          onClick?.(i)
          evt.stopPropagation(true)
        }}
        receiveShadow
        // onPointerEnter={() => setActiveSlice(i)}
        // onPointerLeave={() => setActiveSlice(undefined)}
      >
        {/* <shapeGeometry args={[shape]} /> */}
        <extrudeGeometry args={extrudeGeometryArgs} />
        {/* <cylinderGeometry args={[1, 1, 0.4, 64]} /> */}
        {/* <meshPhongMaterial color={color} /> */}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          />
        {/* <glowMaterial
          color={color}
          glowColor="black"
          emissive={'black'} // Añade esta línea para hacer el material más brillante
          emissiveIntensity={5} // Ajusta la intensidad del brillo
        /> */}
        {/* <meshBasicMaterial color={color} side={BackSide} /> */}
      </animated.mesh>
      {label && (
        <Billboard>
          <Text
            position={[xText, yTextOffset, zText]}
            castShadow
            fontSize={0.05}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={'left'}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={1}
            color="white"
            outlineWidth={'2.5%'}
            outlineColor="#000000"
            outlineOpacity={0.2}
          >
            {valueAsPercent ? formatter(percent) : arc.data.originalValue}
          </Text>
        </Billboard>
      )}
      {/* {label && (
        <Billboard>
          <Text
            position={[xText, yTextOffset + (showValue ? 0.15 : 0), zText]}
            castShadow={!showValue}
            fontSize={showValue ? 0.1 : 0.125}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={'left'}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={1}
            color={'white'}
            outlineWidth={'2.5%'}
            outlineColor="#000000"
            outlineOpacity={1}
            strokeColor="white"
            strokeWidth={'2%'}
          >
            {label}
          </Text>
        </Billboard>
      )} */}
    </animated.group>
    
    </>

  )
}

export default PieSlice
