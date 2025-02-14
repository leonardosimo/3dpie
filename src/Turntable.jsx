import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three'; // Importar THREE para usar vectores y matemáticas

export default function Turntable({
  enabled = true,
  children,
  distance = 5, // Distancia de la cámara al centro del "pie chart"
}) {
  const groupRef = useRef(null); // Referencia al grupo que contiene el "pie chart"
  const minMeshRef = useRef(null); // Referencia a la tajada más pequeña

  // Buscar el Mesh con userData.isMinPie una vez que el componente se monta
  useEffect(() => {
    if (groupRef.current) {
      const listItems = groupRef.current.children?.at(0)?.children || [];
      minMeshRef.current = listItems.find((item) => item?.userData?.isMinPie) || null;
    }
  }, [children]);

  useFrame(({ camera }) => {
    if (groupRef.current && minMeshRef.current && enabled) {
      // Obtener la posición global del hijo menor (tajada más pequeña)
      const minMeshPosition = new THREE.Vector3();
      minMeshRef.current.getWorldPosition(minMeshPosition);

      // Calcular la dirección desde el centro del "pie chart" hacia el hijo menor
      const direction = minMeshPosition.clone().sub(groupRef.current.position).normalize();

      // Posicionar la cámara frente al hijo menor
      const cameraPosition = minMeshPosition.clone().add(direction.multiplyScalar(distance));
      camera.position.copy(cameraPosition);

      // Hacer que la cámara mire hacia el centro del "pie chart"
      camera.lookAt(groupRef.current.position);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}