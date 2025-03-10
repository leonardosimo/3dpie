import { arc, pie } from 'd3-shape'

/** Ajusta los valores para garantizar un mínimo visual */
export function normalizeData(data, minPercentage = 0.04) {
  // Calcular el total de los datos
  const total = data.reduce((sum, d) => sum + d.value, 0)

  // Definir el mínimo visual como un porcentaje del total
  const minValue = total * minPercentage

  // Ajustar los datos sin alterar los originales
  const adjustedData = data.map((d) => ({
    ...d,
    originalValue: d.value, // Guardamos el valor original
    value: Math.max(d.value, minValue), // Aplicamos el mínimo visual
  }))

  return adjustedData
}

/** Generador de pie 3D con valores mínimos */
export default function makePie(
  data,
  innerRadius,
  outerRadius,
  cornerRadius,
  padAngle
) {
  // Normalizar los datos para aplicar el mínimo visual
  const normalizedData = normalizeData(data)

  // Generar los arcos usando d3.pie
  const arcs = pie().value((d) => d.value)(normalizedData)

  // Generador de arcos
  const arcGenerator = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius)
    .padAngle(padAngle)

  // Crear el SVG del gráfico de pie
  const pieSvgDataUri = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg">
      <g transform="scale(0.01)">
        ${arcs
          .map(
            (arcData, i) =>
              `<path d="${arcGenerator(arcData)}" fill="${
                arcData.data.color
              }" />`
          )
          .join('')}
      </g>
    </svg>`
  )}`

  return { pieSvgDataUri, arcs, arcGenerator }
}
