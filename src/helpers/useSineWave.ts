import { useEffect, useState } from "react";

export const useSineWave = (n: number, fps: number = 30) => {
  const [values, setValues] = useState<Array<{sin: number, cos: number}>>(
    Array.from({ length: n }, (_, i) => ({
      sin: Math.sin(0 + (i * Math.PI * 2)/n),
      cos: Math.cos(0 + (i * Math.PI * 2)/n + Math.PI/4)
    }))
  );
  
  useEffect(() => {
    let frame: number;
    let lastUpdate = 0;
    
    const update = () => {
      const now = Date.now();
      if (now - lastUpdate >= 1000/fps) {
        // Generate raw values
        const rawValues = Array.from({ length: n }, (_, i) => ({
          sin: Math.sin(now / (1000 + i*200) + (i * Math.PI * 2)/n),
          cos: Math.cos(now / (3000 + i*400) + (i * Math.PI * 2)/n + Math.PI/4)
        }));
        
        // Calculate what the actual heights would be with your formula
        const baseHeight = 2 * 24; // 48
        const rawHeights = rawValues.map(v => baseHeight + v.sin * 30);
        
        // Calculate target total height (constant)
        // Using the average of current rawHeights sum as target
        const targetTotalHeight = n * (baseHeight); // This ensures sum is constant at n*baseHeight
        
        // Normalize heights to maintain constant sum
        const currentTotalHeight = rawHeights.reduce((a, b) => a + b, 0);
        
        if (currentTotalHeight > 0) {
          const scaleFactor = targetTotalHeight / currentTotalHeight;
          
          // Adjust sin values to produce normalized heights
          const normalizedValues = rawValues.map((v) => {
            // We need to solve: baseHeight + newSin*30 = (baseHeight + v.sin*30) * scaleFactor
            // Therefore: newSin = ((baseHeight + v.sin*30) * scaleFactor - baseHeight) / 30
            const newSin = ((baseHeight + v.sin * 30) * scaleFactor - baseHeight) / 30;
            
            return {
              sin: newSin,
              cos: v.cos // Keep cos as is, or normalize similarly if needed
            };
          });
          
          setValues(normalizedValues);
        } else {
          setValues(rawValues);
        }
        
        lastUpdate = now;
      }
      frame = requestAnimationFrame(update);
    };
    
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [n, fps]);
  
  return { values };
};