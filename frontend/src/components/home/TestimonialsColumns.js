// Testimonials Columns Demo - NextOffer Version
// Infinite scrolling testimonials showcasing user success
import React from "react";
import { TestimonialsColumn } from "../../assets/js/testimonials-columns";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "NextOffer streamlined our entire hiring process. The AI screening is incredibly accurate and saves us hours every week.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    name: "Sarah Chen",
    role: "Head of Talent at TechCorp",
  },
  {
    text: "Implementation was seamless. The platform is intuitive and our team was up and running in days, not weeks.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    name: "Michael Rodriguez",
    role: "CTO at InnovateSphere",
  },
  {
    text: "The support team is exceptional. They guided us through every step and continue to provide outstanding assistance.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    name: "Emily Watson",
    role: "Operations Director",
  },
  {
    text: "NextOffer's integrity monitoring gives us confidence that every candidate is authentic. No more wasted interviews!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    name: "James Kim",
    role: "VP of Engineering",
  },
  {
    text: "The multimodal interview system is revolutionary. We can assess technical skills and soft skills simultaneously.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    name: "Lisa Thompson",
    role: "Director of HR",
  },
  {
    text: "As a candidate, NextOffer made the process transparent and fair. I knew exactly what to expect and felt prepared.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    name: "Priya Sharma",
    role: "Senior Developer",
  },
  {
    text: "Our time-to-hire dropped by 90%. This platform is a game-changer for fast-growing companies like ours.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    name: "David Lee",
    role: "Startup Founder",
  },
  {
    text: "The analytics dashboard provides incredible insights. We've improved our hiring quality significantly since adopting NextOffer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    name: "Alex Johnson",
    role: "HR Analytics Lead",
  },
  {
    text: "Best investment we've made in our hiring process. The ROI was clear within the first month of implementation.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    name: "Maria Garcia",
    role: "CFO at ScaleUp Inc",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsColumns = () => {
  const sectionStyle = {
    backgroundColor: 'var(--dark-bg)',
    position: 'relative',
    padding: '5rem 0',
  };

  const maskStyle = {
    maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
    maxHeight: '740px',
    overflow: 'hidden',
  };

  return (
    <section style={sectionStyle}>
      <div className="container position-relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="d-flex flex-column align-items-center justify-content-center mx-auto"
          style={{ maxWidth: '540px' }}
        >
          <div className="d-flex justify-content-center">
            <div
              className="border rounded-3 py-2 px-4"
              style={{
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: 'var(--primary-color)',
                fontSize: '0.9rem',
              }}
            >
              Success Stories
            </div>
          </div>

          <h2
            className="text-center fw-bold mt-4"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              color: 'var(--light-text)',
              lineHeight: '1.2',
            }}
          >
            What our users say
          </h2>
          <p
            className="text-center mt-3"
            style={{
              opacity: 0.75,
              color: 'var(--muted-text)',
            }}
          >
            See what our customers have to say about NextOffer.
          </p>
        </motion.div>

        {/* Testimonials Columns */}
        <div
          className="d-flex justify-content-center gap-4 mt-5"
          style={maskStyle}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="d-none d-md-block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="d-none d-lg-block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
