import { sRGBEncoding } from '@react-three/drei/helpers/deprecated'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export const SceneBackground = () => {
  const texture = useLoader(TextureLoader, '/img/fondo.png')
  texture.encoding = sRGBEncoding // Corrige el brillo

  return <primitive attach="background" object={texture} />
}
