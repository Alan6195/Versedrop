import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      localStorage.setItem('versedrop_onboarded', '1');
      onComplete();
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card" key={step}>
        {step === 0 && (
          <>
            <div className="onboarding-logo">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 L12 22 M4 8 L20 8" strokeWidth="2.5" />
                <circle cx="12" cy="18" r="2" fill="white" stroke="none" />
              </svg>
            </div>
            <h1>Welcome to VerseDrop</h1>
            <p className="tagline">Discover scripture everywhere you go</p>
          </>
        )}

        {step === 1 && (
          <>
            <h1>How It Works</h1>
            <div className="onboarding-how-list">
              <div className="onboarding-how-item">
                <div className="onboarding-how-num">1</div>
                <div className="onboarding-how-text">
                  <strong>Explore the map</strong> to find verse drops left by other explorers
                </div>
              </div>
              <div className="onboarding-how-item">
                <div className="onboarding-how-num">2</div>
                <div className="onboarding-how-text">
                  <strong>Walk within range</strong> and pick them up to add to your collection
                </div>
              </div>
              <div className="onboarding-how-item">
                <div className="onboarding-how-num">3</div>
                <div className="onboarding-how-text">
                  <strong>Build your collection</strong> and drop your own verses for others
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Set Your Location</h1>
            <div className="onboarding-location-hint">
              On desktop, click anywhere on the map or use the location setter to place yourself. On mobile, we will use your GPS to track your position automatically.
            </div>
          </>
        )}

        <div className="onboarding-dots">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        <button className="gold-btn" onClick={handleNext}>
          {step < 2 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
