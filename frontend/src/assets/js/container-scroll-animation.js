// Container Scroll Animation Component - Bootstrap Version
// Framer Motion powered scroll animation for hero sections
import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const containerStyle = {
    height: isMobile ? '60rem' : '80rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '0.5rem' : '5rem',
  };

  const innerContainerStyle = {
    paddingTop: isMobile ? '2.5rem' : '10rem',
    paddingBottom: isMobile ? '2.5rem' : '10rem',
    width: '100%',
    position: 'relative',
    perspective: '1000px',
  };

  return (
    <div style={containerStyle} ref={containerRef}>
      <div style={innerContainerStyle}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        maxWidth: '64rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      className="text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({ rotate, scale, children }) => {
  const cardStyle = {
    maxWidth: '64rem',
    marginTop: '-3rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '30rem',
    width: '100%',
    border: '4px solid #6C6C6C',
    padding: '0.5rem',
    backgroundColor: '#222222',
    borderRadius: '30px',
    boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
  };

  const innerCardStyle = {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '1rem',
    backgroundColor: '#18181b',
    padding: '1rem',
  };

  // Adjust for medium screens
  if (window.innerWidth >= 768) {
    cardStyle.height = '40rem';
    cardStyle.padding = '1.5rem';
    innerCardStyle.padding = '1rem';
  }

  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        ...cardStyle,
      }}
    >
      <div style={innerCardStyle}>
        {children}
      </div>
    </motion.div>
  );
};
