
'use client';

import React, { useState, useEffect } from 'react';

interface TimestampDisplayProps {
  timestamp: Date;
  className?: string;
}

const TimestampDisplay: React.FC<TimestampDisplayProps> = ({ timestamp, className = '' }) => {
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFormattedTime(timestamp.toLocaleTimeString());
  }, [timestamp]);

  // Return empty during SSR to prevent hydration mismatch
  if (!mounted) {
    return <span className={className}></span>;
  }

  return <span className={className}>{formattedTime}</span>;
};

export default TimestampDisplay;
