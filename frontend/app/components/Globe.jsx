'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';

export default function Globe() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    //const canvas = canvasRef.current;
    //if (!canvas) return;
    let phi = 0;

      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.1, 0.8, 1],
        glowColor: [1, 1, 1],
        markers: [
          { location: [37.78, -122.44], size: 0.03, id: 'sf' },
          { location: [40.71, -74.01], size: 0.03, id: 'nyc' },
        ],
        arcs: [
          { from: [37.78, -122.44], to: [40.71, -74.01] },
        ],
        arcColor: [0.3, 0.5, 1],
        arcWidth: 0.5,
        arcHeight: 0.3
      });
  
  function animate() {
        phi += 0.005
    globe.update({ phi })
    requestAnimationFrame(animate) 
    } 
    animate();

    return () => {
      globe.destroy();
    };
  },[]);

  return (<canvas 
          ref={canvasRef}
          style={{ width: 1000, height: 1000, maxWidth: "100%", aspectRatio: 1, opacity: 0.3, 
            position: "absolute", inset: 0, zIndex: 0 }}
          />);

}
