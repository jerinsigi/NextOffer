// Animated Testimonials Component - Bootstrap Version
// Smooth carousel testimonials with framer-motion animations
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className = "",
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '5rem 1rem',
  };

  const imageContainerStyle = {
    position: 'relative',
    height: '320px',
    width: '100%',
  };

  const imageCardStyle = {
    position: 'absolute',
    inset: 0,
    transformOrigin: 'bottom',
  };

  const imageStyle = {
    height: '100%',
    width: '100%',
    borderRadius: '1.5rem',
    objectFit: 'cover',
    objectPosition: 'center',
  };

  const buttonStyle = {
    height: '44px',
    width: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <div className={className} style={containerStyle}>
      <div className="container">
        <div className="row g-5">
          {/* Image Section */}
          <div className="col-12 col-md-6">
            <div style={imageContainerStyle}>
              <AnimatePresence>
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.src}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index)
                        ? 999
                        : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    style={imageCardStyle}
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      draggable={false}
                      style={imageStyle}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Content Section */}
          <div className="col-12 col-md-6 d-flex flex-column justify-content-between py-3">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 
                className="fs-3 fw-bold mb-2" 
                style={{ color: 'var(--light-text)' }}
              >
                {testimonials[active].name}
              </h3>
              <p 
                className="text-muted mb-4"
                style={{ fontSize: '0.95rem' }}
              >
                {testimonials[active].designation}
              </p>
              <motion.p 
                className="fs-5 mb-0" 
                style={{ 
                  color: 'var(--muted-text)',
                  lineHeight: '1.8' 
                }}
              >
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="d-flex gap-3 pt-4 pt-md-0">
              <button
                onClick={handlePrev}
                style={buttonStyle}
                className="testimonial-nav-btn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <ChevronLeft size={20} color="var(--light-text)" />
              </button>
              <button
                onClick={handleNext}
                style={buttonStyle}
                className="testimonial-nav-btn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <ChevronRight size={20} color="var(--light-text)" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
