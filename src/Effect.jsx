// import { useEffect } from 'react'
// import { useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'

export const Effects = () => {
//   const { scene } = useThree()

//   useEffect(() => {
//     scene.traverse((obj) => {
//       if (obj.isMesh) obj.layers.enable(1) // Habilita Bloom para TODOS los Meshes
//     })
//   }, [scene])

  return (
    <EffectComposer>
      {/* <Bloom intensity={2} selectionLayer={1}  luminanceThreshold={0.1} luminanceSmoothing={0.1} /> */}
    </EffectComposer>
  )
}
