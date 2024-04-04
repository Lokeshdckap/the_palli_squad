import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ expirationDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(expirationDate) - now;

      if (diff > 0) {
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let timeString = '';
        if (days > 0) {
          timeString = `${days} day${days > 1 ? 's' : ''} left`;
        } else if (hours > 0) {
          timeString = `${hours} hour${hours > 1 ? 's' : ''} left`;
        } else {
          timeString = `${minutes} minute${minutes > 1 ? 's' : ''} left`;
        }

        setTimeLeft(timeString);
      } else {
        setTimeLeft('Expired');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  return <div>{timeLeft}</div>;
};

export default CountdownTimer;
