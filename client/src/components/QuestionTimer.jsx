import { useState, useEffect, useRef } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import './QuestionTimer.css';

function QuestionTimer({
  questionIndex,
  durationSeconds = 60,
  onTimeout,
}) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const timeoutTriggeredRef = useRef(false);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(durationSeconds);
    timeoutTriggeredRef.current = false;
  }, [questionIndex, durationSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!timeoutTriggeredRef.current) {
            timeoutTriggeredRef.current = true;
            if (onTimeout) {
              onTimeout(questionIndex);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionIndex, onTimeout]);

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / durationSeconds) * 100));
  const isWarning = timeLeft <= 20 && timeLeft > 10;
  const isDanger = timeLeft <= 10;

  let timerClass = 'question-timer';
  if (isDanger) timerClass += ' qtimer-danger';
  else if (isWarning) timerClass += ' qtimer-warning';

  return (
    <div className={timerClass}>
      <div className="qtimer-info flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-semibold">
          {isDanger ? <AlertTriangle size={14} className="qtimer-pulse-icon" /> : <Timer size={14} />}
          <span>Question Timer</span>
        </div>
        <span className="qtimer-seconds">{timeLeft}s remaining</span>
      </div>
      <div className="qtimer-bar-track">
        <div
          className="qtimer-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default QuestionTimer;
