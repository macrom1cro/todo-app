import Typography from "@mui/material/Typography";
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
  return (
    <>
      <Typography variant='h6'>
        The time is now: {nowTime.toLocaleTimeString()}
      </Typography>
      ;
    </>
  );
}
