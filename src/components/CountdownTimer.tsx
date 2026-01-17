import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: number;
  onExpire?: () => void;
}

export const CountdownTimer = ({ endTime, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (timeLeft === 0) {
    return <span className="countdown-text text-muted-foreground">Expired</span>;
  }

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className="countdown-text">
      {hours > 0 && `${format(hours)}:`}
      {format(minutes)}:{format(seconds)}
    </span>
  );
};
