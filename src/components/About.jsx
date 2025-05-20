import React, { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; // Import useInView

import { Tech } from './';
import { styles } from '../styles';
import { services } from '../constants';
import {
  fadeIn,
  blinkingCursor,
} from '../utils/motion';
import { SectionWrapper } from '../hoc';

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt options={{ max: 45, scale: 1, speed: 450 }} className="xs:w-[250px] w-full">
      <motion.div variants={fadeIn("right", "spring", 0.5 * index, 0.75)} className="w-full">

        <div className="bg-color-1 rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col w-full h-full" >
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  const introText = "Introduction";
  const overviewHeader = "Overview";
  const overviewBody = "I'm a computer science student at the University at Albany, with strong foundations in Java, C, JavaScript, and React. I'm deeply passionate about technology, a quick learner, and an excellent problem solver. I love to learn; I am dedicated to the continuous pursuit of new ideas. I'd love to be given the opportunity to work with others and create something meaningful!";

  const typingSpeed = 30;

  const [typedIntro, setTypedIntro] = useState("");
  const [typedHeader, setTypedHeader] = useState("");
  const [typedBody, setTypedBody] = useState("");

  const [step, setStep] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.2,    
  });

  const typingSteps = React.useMemo(() => [
    { text: introText, setter: setTypedIntro, currentTypedText: typedIntro },
    { text: overviewHeader, setter: setTypedHeader, currentTypedText: typedHeader },
    { text: overviewBody, setter: setTypedBody, currentTypedText: typedBody },
  ], [introText, overviewHeader, overviewBody, typedIntro, typedHeader, typedBody, setTypedIntro, setTypedHeader, setTypedBody]); // Dependencies for useMemo

  useEffect(() => {
    let timeout;

    if (inView && step < typingSteps.length) {
      const currentStepConfig = typingSteps[step];
      const currentTextToType = currentStepConfig.text;
      const currentSetter = currentStepConfig.setter;

      if (charIndex < currentTextToType.length) {
        timeout = setTimeout(() => {
          currentSetter((prev) => prev + currentTextToType[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        if (step < typingSteps.length - 1) {
          setStep((prevStep) => prevStep + 1);
          setCharIndex(0);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [step, charIndex, typingSteps, inView, typingSpeed]);

  const isTypingComplete = step === typingSteps.length - 1 && charIndex >= typingSteps[typingSteps.length - 1].text.length;

  return (
    <div ref={ref}>
      <motion.div>
        <p className={styles.sectionSubText}>
          {typedIntro}
          {inView && step === 0 && charIndex < introText.length && (
            <motion.span
              className="blinking-cursor-style" // Ensure this class is defined
              variants={blinkingCursor}
              initial="hidden"
              animate="show"
            />
          )}
        </p>
        <h2 className={styles.sectionHeadText}>
          {typedHeader}
          {inView && step === 1 && charIndex < overviewHeader.length && (
            <motion.span
              className="blinking-cursor-style"
              variants={blinkingCursor}
              initial="hidden"
              animate="show"
            />
          )}
        </h2>
      </motion.div>

      <div className={`${styles.sectionTextBlock} min-h-[150px]`}>
        <p>
          {typedBody}
          {inView && step === 2 && !isTypingComplete && (
            <motion.span
              className="blinking-cursor-style"
              variants={blinkingCursor}
              initial="hidden"
              animate="show"
            />
          )}
        </p>
      </div>

      <div className="mt-16 flex flex-wrap gap-10 justify-center items-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>

      <Tech />
    </div>
  );
};

export default SectionWrapper(About, "about");