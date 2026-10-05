import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  glareOpacity?: number;
  scaleOnHover?: number;
  onClick?: () => void;
}

export function TiltCard3D({
  children,
  className = '',
  tiltMaxAngle = 10,
  glareOpacity = 0.25,
  scaleOnHover = 1.02,
  onClick,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for normalized mouse positions (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltMaxAngle, -tiltMaxAngle]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltMaxAngle, tiltMaxAngle]), springConfig);

  // Glare position
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], ['0%', '100%']), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], ['0%', '100%']), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Normalize from -0.5 to 0.5
    const normX = clientX / rect.width - 0.5;
    const normY = clientY / rect.height - 0.5;

    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative w-full h-full"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: scaleOnHover }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative overflow-hidden rounded-3xl transition-shadow duration-300 ${className}`}
      >
        {/* Card Content (Preserve 3D for children) */}
        <div className="relative z-10 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>

        {/* Specular Glare Overlay */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl"
            style={{
              background: `radial-gradient(circle 320px at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, ${glareOpacity}), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
