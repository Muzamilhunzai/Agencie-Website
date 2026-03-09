import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PointMaterial, 
  Environment,
  Sparkles
} from '@react-three/drei';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const createSeededRandom = (seed) => {
  let s = seed;
  return () => {
    s = Math.sin(s * 9999) * 10000;
    return s - Math.floor(s);
  };
};

const NeuralParticles = ({ mousePosition, scrollY }) => {
  const pointsRef = useRef();
  const count = 50000;
  
  const particles = useMemo(() => {
    const random = createSeededRandom(42);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = random() * 10 + random() * 5;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const armOffset = Math.floor(random() * 3) * (Math.PI * 2 / 3);
      const spiralRadius = radius + theta * 0.1;
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta + armOffset) * spiralRadius;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta + armOffset) * spiralRadius * 0.3;
      positions[i * 3 + 2] = Math.cos(phi) * spiralRadius;
      
      const colorChoice = random();
      if (colorChoice < 0.3) {
        colors[i * 3] = 0.1 + random() * 0.3;
        colors[i * 3 + 1] = 0.8 + random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.6) {
        colors[i * 3] = 0.6 + random() * 0.4;
        colors[i * 3 + 1] = 0.2 + random() * 0.3;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.2 + random() * 0.3;
        colors[i * 3 + 2] = 0.8 + random() * 0.2;
      }
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = performance.now() / 1000;
    const positions = pointsRef.current.geometry.attributes.position.array;
    const colors = pointsRef.current.geometry.attributes.color.array;
    
    const targetX = mousePosition.x * 5;
    const targetY = mousePosition.y * 3;
    const scrollOffset = scrollY * 0.002;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const pulse = Math.sin(time * 2 + i * 0.001) * 0.1;
      const dx = targetX - positions[i3];
      const dy = targetY - positions[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attraction = Math.max(0, 1 - dist / 10) * 0.3;
      
      positions[i3] += (dx * attraction * 0.01 + Math.sin(time + i * 0.0001) * 0.002 + pulse * 0.01);
      positions[i3 + 1] += (dy * attraction * 0.01 + Math.cos(time + i * 0.0001) * 0.002 + pulse * 0.01);
      positions[i3 + 2] += scrollOffset + Math.sin(time * 0.5 + i * 0.0002) * 0.001;
      
      const connectionPulse = Math.sin(time * 3 + i * 0.0005) * 0.5 + 0.5;
      colors[i3] = colors[i3] * (0.8 + connectionPulse * 0.2);
      colors[i3 + 1] = colors[i3 + 1] * (0.8 + connectionPulse * 0.2);
      colors[i3 + 2] = colors[i3 + 2] * (0.8 + connectionPulse * 0.2);
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const HolographicText = ({ text }) => {
  return (
    <div className="relative z-10">
      <div className="relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white relative">
          {text}
        </h1>
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold absolute top-0 left-0 -z-10 opacity-30"
          style={{ 
            color: '#06b6d4',
            transform: 'translate(-4px, -4px)',
            filter: 'blur(8px)'
          }}
        >
          {text}
        </h1>
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold absolute top-0 left-0 -z-10 opacity-30"
          style={{ 
            color: '#ec4899',
            transform: 'translate(4px, 4px)',
            filter: 'blur(8px)'
          }}
        >
          {text}
        </h1>
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold absolute top-0 left-0 -z-10 opacity-30"
          style={{ 
            color: '#a855f7',
            transform: 'translate(-2px, 2px)',
            filter: 'blur(4px)'
          }}
        >
          {text}
        </h1>
      </div>
      <div 
        className="h-1 w-full mt-4 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #06b6d4, #a855f7, #ec4899, #f59e0b, #06b6d4)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite'
        }}
      />
    </div>
  );
};

const Scene = ({ mousePosition, scrollY }) => {
  return (
    <>
      <NeuralParticles mousePosition={mousePosition} scrollY={scrollY} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      <Environment preset="night" />
    </>
  );
};

const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const [quality, setQuality] = useState('high');
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkFps = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const currentFps = frameCount;
        setFps(currentFps);
        
        if (currentFps < 30) {
          setQuality('low');
        } else if (currentFps < 50) {
          setQuality('medium');
        } else {
          setQuality('high');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkFps);
    };
    
    const animationId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return { fps, quality };
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return isMobile;
};

const TranscendentalHero = () => {
  const containerRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { fps, quality } = usePerformanceMonitor();
  
  const handleMouseMove = useCallback((e) => {
    if (prefersReducedMotion || isMobile) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    setMousePosition({
      x: (clientX / innerWidth) * 2 - 1,
      y: -(clientY / innerHeight) * 2 + 1
    });
  }, [prefersReducedMotion, isMobile]);
  
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [handleMouseMove, handleScroll]);
  
  const handleCanvasError = useCallback(() => {
    setCanvasError(true);
  }, []);
  
  if (prefersReducedMotion || canvasError) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        <div className="text-center z-10 px-4">
          <HolographicText text="Transcendental" />
          <p className="text-xl text-gray-300 mt-6 max-w-2xl">
            Turning imagination into digital impact.
          </p>
          <button className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:scale-105 transition-transform">
            Explore
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-950 to-black"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <div className="absolute inset-0 z-0">
        <Canvas
          key={canvasError ? 'error' : 'canvas'}
          camera={{ position: [0, 0, 8], fov: 75 }}
          dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
          gl={{ 
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
          }}
          performance={{ min: 0.5 }}
          onError={handleCanvasError}
        >
          <Scene mousePosition={mousePosition} scrollY={scrollY} />
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">Trusted by 10K+ clients</span>
              </motion.div>
              
              <HolographicText text="Transcendental" />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl mx-auto"
              >
                Creating meaningful connections and turning big ideas into interactive digital experiences.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 mt-10 justify-center items-center"
              >
                <div className="relative">
                  <button
                    onClick={() => console.log('Primary CTA')}
                    className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full text-lg font-semibold overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
                </div>
                
                <button className="px-8 py-4 border border-white/30 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
                  Learn More
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0, 1], y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-2 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs backdrop-blur-sm">
          FPS: {fps} | Quality: {quality}
        </div>
      )}
    </div>
  );
};

export default TranscendentalHero;