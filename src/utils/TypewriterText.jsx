import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { blinkingCursor } from '../utils/motion';

const BlinkingCursor = () => (
  <motion.span
    className="blinking-cursor-style"
    variants={blinkingCursor}
    initial="hidden"
    animate="show"
    style={{
      backgroundColor: '#aaa6c3',
      height: '1em',
      width: '8px',
      display: 'inline-block',
      marginLeft: '2px'
    }}
  />
);

const TypewriterText = ({ text, speed = 30, onComplete = () => {}, className = "" }) => {
  const [typed, setTyped] = useState('');
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTyped('');
    setIndex(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setTyped((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!done) {
      setDone(true);
      onComplete();
    }
  }, [index, text, speed, done, onComplete]);

  return (
    <span className={className}>
      {typed}
      {!done && <BlinkingCursor />}
    </span>
  );
};

export default TypewriterText;