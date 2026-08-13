'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';

export default function Globe() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    const globe = createGlobe(canvas, {
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
        { location: [35.68, 139.65], size: 0.03, id: 'Tokyo' },
        { location: [-33.87, 151.21], size: 0.03, id: 'Sydney' },
        { location: [51.50, 0.12], size: 0.03, id: 'London' },
        { location: [39.90, 116.39], size: 0.03, id: 'Beijing' },
        { location: [23.12, 113.25], size: 0.03, id: 'Guangzhou'},
        { location: [-34.60, -58.38], size: 0.03, id: 'Buenos Aires' },
        { location: [-23.54, -46.63], size: 0.03, id: 'São Paulo'},
        { location: [25.27, 55.29], size: 0.03, id: 'Dubai'},
        { location: [6.45, 3.39], size: 0.03, id: 'Lagos'},
        { location: [33.92, 18.42], size: 0.03, id: 'Cape Town'}
      ],
      arcs: [
        { from: [37.78, -122.44], to: [40.71, -74.01] },
        { from: [37.78, -122.44], to: [35.68, 139.65] },
        { from: [-33.87, 151.21], to: [35.68, 139.65] },
        { from: [35.68, 139.65], to: [40.71, -74.01] },
        { from: [23.12, 113.25], to: [39.90, 116.39] },
        { from: [-23.54, -46.63], to: [6.45, 3.39] },
        { from: [6.45, 3.39], to: [33.92, 18.42] }
      ],
      arcColor: [0.3, 0.5, 1],
      arcWidth: 0.5,
      arcHeight: 0.3,
    });

    const animate = () => {
      phi += 0.005;
      globe.update({ phi });
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        opacity: 0.6,
        zIndex: 0,
        //filter: 'grayscale(0.25) saturate(0.75)',
        filter: 'saturate(1), contrast(1.05)',
      }}
    />
  );
}

