import { scaleBand, scaleLinear } from 'd3-scale'
import { normalizeData } from './makePie'
import { max, range } from 'd3-array'
export const MakeBar = (data, width, height, depth) => {
  // Normalizar datos
  const normalizedData = normalizeData(data)

  // Escalas de D3
  const xScale = scaleBand()
    .domain(range(data.length))
    .range([0, width])
    .padding(0.1)

  const yScale = scaleLinear()
    .domain([0, max(normalizedData, (d) => d.value)])
    .range([0, height])

  const calcPercent = (value, totalValue) => {
    return (value / totalValue) * 100
  }
  const totalValue = normalizedData.reduce((sum, d) => yScale(d.originalValue) + sum, 0)

  // Ordenar el arreglo para que el mayor valor vaya al final
  const sortedData = [...normalizedData].sort((a, b) => a.originalValue - b.originalValue)

  // Crear barras con sus posiciones
  let bars = sortedData.map((d, i) => ({
    index: i,
    originalValue: d.originalValue,
    scaledValue: yScale(d.value),
    width: xScale.bandwidth(),
    depth,
    color: d.color,
    position: {
      x: xScale(i),
      y: height - yScale(d.value),
      z: 0,
    },
    percent: calcPercent(yScale(d.originalValue), totalValue),
  }))

  // Generar el SVG de las barras
  const svgDataUri = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
       ${bars
         .map(
           (bar) =>
             `<rect x="${bar.position.x}" y="${bar.position.y}" width="${bar.width}" height="${bar.scaledValue}" fill="${bar.color}" />`
         )
         .join('')}
     </svg>`
  )}`

  return { svgDataUri, bars, xScale, yScale }
}
