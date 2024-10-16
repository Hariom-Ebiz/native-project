import React, { useEffect, useState } from "react";

const useTimer = (seconds = 60) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const start = () => {
    setIsRunning(true);
    setTimer(seconds);
  };

  useEffect(() => {
    if (timer > 0 && isRunning) {
      setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
        setIsRunning(false);
        setTimer(0)
    }
  }, [timer, isRunning]);

  return {
    timer,
    start,
    isRunning
  };
};

export default useTimer;
