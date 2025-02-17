import { useState, useEffect, useRef } from 'react'


const listURLs = [
  "http://localhost:5173",
  "https://stats.kurax.dev"
];


function useFramePie(adapter) {
  const [data, setData] = useState([])
  const prevDataRef = useRef(null)

  useEffect(() => {
    const handleMessage = (event) => {

      if (!listURLs.includes(event.origin)) return // Seguridad básica
      try { 
        
        const adaptedData = adapter ? adapter(event.data) : event.data

        // Solo actualizar el estado si los datos han cambiado
        if (
          JSON.stringify(adaptedData) !== JSON.stringify(prevDataRef.current)
        ) {
          setData(adaptedData)
          prevDataRef.current = adaptedData // Actualizamos los datos previos
        }
      } catch (error) {
        console.error('Error adapting message data:', error)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [adapter])

  return data
}

export default useFramePie
