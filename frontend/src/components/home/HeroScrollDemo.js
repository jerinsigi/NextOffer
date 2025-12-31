// Hero Scroll Demo Components - Bootstrap Version
// Multiple demo variations for NextOffer project
import React from "react";
import { ContainerScroll } from "../../assets/js/container-scroll-animation";
import aiInterviewImage from "../../assets/ai_interview.png"; // Import local image

export function HeroScrollDemo() {
  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '1rem',
  };

  const highlightStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'block',
    marginTop: '0.5rem',
    lineHeight: '1',
  };

  return (
    <div className="d-flex flex-column" style={{ overflow: 'hidden', backgroundColor: 'var(--dark-bg)' }}>
      <ContainerScroll
        titleComponent={
          <>
            <h1 style={titleStyle}>
              Transform Your Career with <br />
              <span style={highlightStyle}>
                NextOffer
              </span>
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=720&fit=crop"
          alt="NextOffer Platform - AI-Powered Interview Practice"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left top',
            borderRadius: '1rem',
          }}
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

// Alternative version for job interview theme
export function InterviewPracticeScroll() {
  const containerStyle = {
    backgroundColor: '#020617',
    overflow: 'hidden',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#ffffff',
  };

  const highlightStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #818cf8, #a78bfa, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'block',
    marginTop: '0.5rem',
    lineHeight: '1',
  };

  return (
    <div className="d-flex flex-column" style={containerStyle}>
      <ContainerScroll
        titleComponent={
          <>
            <h1 style={titleStyle}>
              Master Your Interviews with <br />
              <span style={highlightStyle}>
                AI-Powered Practice
              </span>
            </h1>
          </>
        }
      >
        <img
          src={aiInterviewImage}
          alt="AI Interview Practice Platform"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '1rem',
          }}
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

// Dashboard showcase version
export function DashboardShowcase() {
  const containerStyle = {
    background: 'linear-gradient(to bottom, #020617, #0f172a)',
    overflow: 'hidden',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#ffffff',
  };

  const highlightStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#818cf8',
    display: 'block',
    marginTop: '0.5rem',
    lineHeight: '1',
  };

  return (
    <div className="d-flex flex-column" style={containerStyle}>
      <ContainerScroll
        titleComponent={
          <>
            <h1 style={titleStyle}>
              Track Your Progress <br />
              <span style={highlightStyle}>
                Real-Time Analytics
              </span>
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=720&fit=crop"
          alt="NextOffer Analytics Dashboard"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            borderRadius: '1rem',
          }}
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

// Job Application Tracking version
export function ApplicationTracker() {
  const containerStyle = {
    backgroundColor: 'var(--dark-bg)',
    overflow: 'hidden',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: 'var(--light-text)',
  };

  const highlightStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    display: 'block',
    marginTop: '0.5rem',
    lineHeight: '1',
  };

  return (
    <div className="d-flex flex-column" style={containerStyle}>
      <ContainerScroll
        titleComponent={
          <>
            <h1 style={titleStyle}>
              Manage All Your Applications <br />
              <span style={highlightStyle}>
                In One Place
              </span>
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=720&fit=crop"
          alt="Job Application Tracking Dashboard"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '1rem',
          }}
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
