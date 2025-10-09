import Paper from "@mui/material/Paper";
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
    <Paper elevation={0} sx={{ p: 1, mb: 3, backgroundColor: "primary.main" }}>
      <Typography variant='h6' align='center' sx={{ color: "white" }}>
        The time is now: {nowTime.toLocaleTimeString()}
      </Typography>
    </Paper>
  );
}
