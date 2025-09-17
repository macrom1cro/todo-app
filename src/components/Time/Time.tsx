import { useEffect, useState } from "react";

export default function Time() {
  const [nowTime, setNowTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  return <span>Время сейчас: {nowTime.toLocaleTimeString()}</span>;
}
