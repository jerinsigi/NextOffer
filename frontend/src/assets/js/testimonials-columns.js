// Testimonials Columns Component - Bootstrap Version
// Infinite scrolling testimonials in multiple columns
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = ({
  className = "",
  testimonials,
  duration = 10,
}) => {
  const columnStyle = {
    maxHeight: '740px',
    overflow: 'hidden',
  };

  const motionContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    paddingBottom: '1.5rem',
    backgroundColor: 'var(--dark-bg)',
  };

  return (
    <div className={className} style={columnStyle}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={motionContainerStyle}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="rounded-4 border shadow-lg testimonials-column-card"
                  style={{
                    padding: '2.5rem',
                    maxWidth: '320px',
                    width: '100%',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.1)',
                  }}
                  key={i}
                >
                  <div style={{ color: 'var(--muted-text)', lineHeight: '1.6' }}>
                    {text}
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-4">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      style={{
                        height: '40px',
                        width: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <div className="d-flex flex-column">
                      <div
                        style={{
                          fontWeight: '500',
                          lineHeight: '1.25',
                          color: 'var(--light-text)',
                        }}
                      >
                        {name}
                      </div>
                      <div
                        style={{
                          lineHeight: '1.25',
                          opacity: '0.6',
                          fontSize: '0.9rem',
                          color: 'var(--muted-text)',
                        }}
                      >
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
