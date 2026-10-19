"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden",
        className
      )}
    >
      <SVGLines duration={svgOptions?.duration ?? 8} />
      <Beams />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Beams = () => {
  const beams = [
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 3, delay: 2, className: "h-px" },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 5, delay: 4, className: "h-px" },
    { initialX: 700, translateX: 700, duration: 8, repeatDelay: 2, className: "h-px" },
    { initialX: 200, translateX: 200, duration: 6, repeatDelay: 4, delay: 1, className: "h-px" },
    { initialX: 550, translateX: 550, duration: 9, repeatDelay: 3, delay: 3, className: "h-px" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {beams.map((beam, idx) => (
        <motion.div
          key={idx}
          initial={{ y: "-100%", x: beam.initialX, opacity: 0 }}
          animate={{ y: "200%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            repeatDelay: beam.repeatDelay,
            delay: beam.delay || 0,
            ease: "linear",
          }}
          className={cn(
            "absolute top-0 w-px bg-gradient-to-b from-transparent via-blue-400/40 to-transparent",
            beam.className
          )}
          style={{ height: "15%", left: beam.initialX }}
        />
      ))}
    </div>
  );
};

const SVGLines = ({ duration }: { duration: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Generate flowing curved paths
  const generatePaths = (width: number, height: number) => {
    const paths: string[] = [];
    const numPaths = 12;
    
    for (let i = 0; i < numPaths; i++) {
      const startY = (height / numPaths) * i - height * 0.2;
      const midY = startY + (Math.random() - 0.5) * 200;
      const endY = startY + (Math.random() - 0.5) * 300;
      
      // Create smooth bezier curves flowing from left to right
      const path = `M ${-100} ${startY} 
        Q ${width * 0.25} ${midY + Math.sin(i) * 100}, ${width * 0.5} ${startY + 50}
        T ${width + 100} ${endY}`;
      paths.push(path);
    }
    return paths;
  };

  const paths = generatePaths(dimensions.width, dimensions.height);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Animated gradient for flowing effect */}
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0071e3" stopOpacity="0" />
            <stop offset="30%" stopColor="#0071e3" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#5ac8fa" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0071e3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Moving gradient for each path */}
          {paths.map((_, idx) => (
            <linearGradient
              key={`gradient-${idx}`}
              id={`moving-gradient-${idx}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <motion.stop
                offset="0%"
                stopColor="#0071e3"
                stopOpacity="0"
                animate={{ stopOpacity: [0, 0.1, 0] }}
                transition={{
                  duration: duration + idx * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.stop
                offset="50%"
                stopColor="#5ac8fa"
                animate={{ stopOpacity: [0.1, 0.4, 0.1] }}
                transition={{
                  duration: duration + idx * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.3,
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="#0071e3"
                stopOpacity="0"
                animate={{ stopOpacity: [0, 0.1, 0] }}
                transition={{
                  duration: duration + idx * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </linearGradient>
          ))}
        </defs>

        {/* Static base lines */}
        {paths.map((path, idx) => (
          <path
            key={`base-${idx}`}
            d={path}
            stroke="url(#line-gradient)"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            fill="none"
          />
        ))}

        {/* Animated flowing lines */}
        {paths.map((path, idx) => (
          <motion.path
            key={`animated-${idx}`}
            d={path}
            stroke={`url(#moving-gradient-${idx})`}
            strokeWidth={idx % 3 === 0 ? "1.5" : "1"}
            fill="none"
            filter={idx % 4 === 0 ? "url(#glow)" : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: duration + idx * 0.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: idx * 0.4,
              times: [0, 0.4, 0.6, 1],
            }}
          />
        ))}

        {/* Floating particles along paths */}
        {paths.slice(0, 6).map((path, idx) => (
          <motion.circle
            key={`particle-${idx}`}
            r={idx % 2 === 0 ? "3" : "2"}
            fill="#5ac8fa"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: duration * 0.6,
              repeat: Infinity,
              delay: idx * 1.2,
              ease: "easeInOut",
            }}
          >
            <animateMotion
              dur={`${duration + idx}s`}
              repeatCount="indefinite"
              path={path}
            />
          </motion.circle>
        ))}
      </svg>

      {/* Ambient glow spots */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};
