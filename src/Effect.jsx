import React, { useRef } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
extend({
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  OutlinePass,
})

export function Effects() {
  const { scene, gl, camera } = useThree()
  const composer = useRef()

  useFrame(() => composer.current?.render())

  return (
    <EffectComposer ref={composer} args={[gl]}>
      <RenderPass scene={scene} camera={camera} />
      <OutlinePass
        edgeStrength={10}
        edgeGlow={2}
        edgeThickness={1}
        color="black"
        visibleEdgeColor="white"
        hiddenEdgeColor="transparent"
      />
      <UnrealBloomPass strength={1.5} radius={0.4} threshold={0.1} />
    </EffectComposer>
  )
}
