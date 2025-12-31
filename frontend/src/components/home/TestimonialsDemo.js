// Animated Testimonials Demo - NextOffer Themed
// Real testimonials from platform users showcasing success stories
import React from "react";
import { AnimatedTestimonials } from "../../assets/js/animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "NextOffer's AI-powered screening saved us 90% of the time we spent reviewing resumes. The integrity monitoring ensures we only interview genuine candidates.",
      name: "Sarah Chen",
      designation: "Head of Talent Acquisition at TechCorp",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    },
    {
      quote:
        "The multimodal interview system is revolutionary. We can assess technical skills, communication, and cultural fit all in one automated session. Game changer for remote hiring.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    },
    {
      quote:
        "As a candidate, NextOffer made the interview process transparent and fair. I could practice beforehand and knew exactly what to expect. Landed my dream job!",
      name: "Emily Watson",
      designation: "Senior Software Engineer at CloudScale",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
    },
    {
      quote:
        "The analytics and reporting features give us deep insights into candidate performance. We've improved our hiring quality by 85% since adopting NextOffer.",
      name: "James Kim",
      designation: "VP of Engineering at DataPro",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    },
    {
      quote:
        "Integrity enforcement is a must-have in today's remote hiring landscape. NextOffer's proctoring ensures authenticity without being intrusive. Highly recommend!",
      name: "Lisa Thompson",
      designation: "Director of HR at FutureNet",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Section Header */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <span 
              className="badge px-3 py-2 rounded-pill mb-3" 
              style={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary-color)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              SUCCESS STORIES
            </span>
            <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--light-text)' }}>
              Trusted by Leading <span style={{ color: 'var(--primary-color)' }}>Companies & Candidates</span>
            </h2>
            <p className="lead" style={{ color: 'var(--muted-text)' }}>
              See how NextOffer is transforming the hiring experience for organizations and job seekers worldwide.
            </p>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />

        {/* Stats Section */}
        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <div 
              className="text-center p-4 rounded-4" 
              style={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}
            >
              <h3 className="display-4 fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>
                10K+
              </h3>
              <p className="mb-0" style={{ color: 'var(--muted-text)' }}>
                Successful Interviews
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className="text-center p-4 rounded-4" 
              style={{ 
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}
            >
              <h3 className="display-4 fw-bold mb-2" style={{ color: 'var(--secondary-color)' }}>
                500+
              </h3>
              <p className="mb-0" style={{ color: 'var(--muted-text)' }}>
                Companies Trust Us
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className="text-center p-4 rounded-4" 
              style={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}
            >
              <h3 className="display-4 fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>
                98%
              </h3>
              <p className="mb-0" style={{ color: 'var(--muted-text)' }}>
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for smaller sections
export function CompactTestimonials() {
  const testimonials = [
    {
      quote: "NextOffer streamlined our entire hiring process. Highly recommended!",
      name: "Alex Johnson",
      designation: "HR Manager at StartupHub",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
    },
    {
      quote: "The AI screening is incredibly accurate. Saved us countless hours.",
      name: "Priya Sharma",
      designation: "Recruiter at TechVentures",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
    },
    {
      quote: "Best interview platform I've used. Fair, transparent, and efficient.",
      name: "David Lee",
      designation: "Software Developer",
      src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=500&fit=crop",
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--darker-bg)', padding: '4rem 0' }}>
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </div>
  );
}
