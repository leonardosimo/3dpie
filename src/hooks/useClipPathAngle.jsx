import { useState, useEffect } from "react";

function useClipPathAngle(ref) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const updateAngle = () => {
      if (!ref.current) return;
      const { width, height } = ref.current.getBoundingClientRect();

      if (width === 0 || height === 0) return;

      // Cálculo del ángulo basado en la geometría del clip-path
      const calculatedAngle = Math.atan(height / (0.9 * width)) * (180 / Math.PI);
      setAngle(parseFloat(calculatedAngle.toFixed(2)));
    };

    // Ejecutar la función cuando el ref esté disponible
    const observer = new MutationObserver(updateAngle);
    if (ref.current) {
      updateAngle();
      observer.observe(ref.current, { attributes: true, childList: true, subtree: true });
    }

    window.addEventListener("resize", updateAngle);
    return () => {
      window.removeEventListener("resize", updateAngle);
      observer.disconnect();
    };
  }, [ref?.current]); // Se usa ref.current para detectar cambios correctamente

  return angle;
}

export default useClipPathAngle;
