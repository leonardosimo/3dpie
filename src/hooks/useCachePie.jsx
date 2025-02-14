import { useEffect, useMemo, useReducer, useRef } from 'react'
import makePie from '../makePie'
import { useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

/** generate our pie shapes for Three (may suspend) */
const usePie = (data, innerRadius, outerRadius, cornerRadius, padAngle) => {
  // generate our pie
  const { pieSvgDataUri, arcs, arcGenerator } = makePie(
    data,
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle
  )

  // this will suspend when loading a new svg data URI
  const loadedSvg = useLoader(SVGLoader, pieSvgDataUri)

  // return everything in a bundle to facilitate caching
  return { data, innerRadius, loadedSvg, pieSvgDataUri, arcs, arcGenerator }
}

/** Cache our pie so when useLoader suspends we can return a previous version */
export const useCachedPie = (
  data,
  innerRadius,
  outerRadius,
  cornerRadius,
  padAngle
) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const cachedPie = useRef()
  let pie

  try {
    /* eslint-disable react-hooks/rules-of-hooks */
    pie = usePie(data, innerRadius, outerRadius, cornerRadius, padAngle)
    /* eslint-enable react-hooks/rules-of-hooks */
  } catch (promise) {
    // if we have never loaded, just suspend
    if (!cachedPie.current) throw promise
    // otherwise, we will use our cached pie.
    pie = cachedPie.current

    // force a re-render after the promise resolves since we canceled normal suspense
    promise.then(() => forceUpdate())
  }

  // keep the last drawn pie cached
  useEffect(() => {
    cachedPie.current = pie
  })

  // convert our threejs-loaded svg to threejs shapes
  const shapes = useMemo(
    () => pie.loadedSvg.paths.flatMap((shapePath) => shapePath.toShapes()),
    [pie.loadedSvg]
  )

  return { ...pie, shapes }
}
