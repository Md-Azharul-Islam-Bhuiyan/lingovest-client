import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: Date;
  initialTimeLeft?: TimeLeft;
}
interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const Segment = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-custom-black text-white rounded-lg px-2.5 py-1.5 min-w-[38px] text-center shadow-md">
      <span className="text-base font-black tabular-nums leading-none">
        {value < 10 ? `0${value}` : value}
      </span>
    </div>
    <span className="text-[9px] font-semibold uppercase tracking-widest text-graish mt-1">{label}</span>
  </div>
);

const Dot = () => (
  <div className="flex flex-col gap-1.5 mb-4 self-center">
    <span className="w-1 h-1 rounded-full bg-graish block" />
    <span className="w-1 h-1 rounded-full bg-graish block" />
  </div>
);

const CountDown: React.FC<CountdownProps> = ({ targetDate, initialTimeLeft }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const diff = +targetDate - +new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTimeLeft || calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex items-end gap-1.5">
      <Segment value={timeLeft.days ?? 0} label="Days" />
      <Dot />
      <Segment value={timeLeft.hours ?? 0} label="Hrs" />
      <Dot />
      <Segment value={timeLeft.minutes ?? 0} label="Min" />
      <Dot />
      <Segment value={timeLeft.seconds ?? 0} label="Sec" />
    </div>
  );
};

export default CountDown;
