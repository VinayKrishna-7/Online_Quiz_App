import { useState, useEffect, useRef } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

function QuizTimer({ expiresAt, onExpire }) {
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  const onExpireCalled = useRef(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateRemaining = () => {
      const now = Date.now();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setSecondsRemaining(diff);

      if (diff === 0 && !onExpireCalled.current) {
        onExpireCalled.current = true;
        if (onExpire) {
          onExpire();
        }
      }
    };

    // Run immediately
    calculateRemaining();

    // Ticking every 500ms for responsiveness
    const interval = setInterval(calculateRemaining, 500);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining <= 60; // 1 minute warning
  const isCritical = secondsRemaining <= 20;

  const formatNumber = (num) => String(num).padStart(2, '0');

  let containerBg = 'var(--primary-light)';
  let borderColor = 'var(--primary-border)';
  let textColor = 'var(--primary)';

  if (isCritical) {
    containerBg = 'var(--danger-light)';
    borderColor = 'var(--danger-border)';
    textColor = 'var(--danger-text)';
  } else if (isUrgent) {
    containerBg = 'var(--warning-light)';
    borderColor = 'var(--warning-border)';
    textColor = 'var(--warning-text)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.45rem 0.875rem',
        backgroundColor: containerBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-full)',
        color: textColor,
        fontWeight: 700,
        fontSize: '0.9375rem',
        fontVariantNumeric: 'tabular-nums',
        transition: 'all 0.3s ease',
      }}
    >
      {isUrgent ? (
        <AlertCircle size={17} className={isCritical ? 'timer-pulse' : ''} />
      ) : (
        <Clock size={17} />
      )}
      <style>{`
        @keyframes timerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .timer-pulse {
          animation: timerPulse 1s infinite;
        }
      `}</style>
      <span>
        {formatNumber(minutes)}:{formatNumber(seconds)}
      </span>
      {isCritical && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ending soon!</span>}
    </div>
  );
}

export default QuizTimer;
