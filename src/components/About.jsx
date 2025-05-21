import React, { useState } from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Tech } from './';
import { styles } from '../styles';
import { services } from '../constants';
import { fadeIn } from '../utils/motion';
import { SectionWrapper } from '../hoc';
import TypewriterText from '../utils/TypewriterText';

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt options={{ max: 30, scale: 1, speed: 350 }} className="xs:w-[180px] w-full md:w-[200px]">
      <motion.div
        variants={fadeIn("right", "spring", 0.3 * index, 0.55)}
        className="w-full aspect-[6/5]"
      >
        <div className="w-full h-full bg-[#010101] border border-[#303070] shadow-md text-[#E0E0E0] flex flex-col">
          <div className="flex items-center h-[8%] bg-[#000080] border-b border-[#303070] px-1.5 py-2 select-none">
            <p className="text-[60%] text-white truncate flex-grow">{title}</p>
            <div className="ml-auto flex items-center space-x-0.5">
              {['_', '□', 'X'].map((val, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 text-[8px] flex items-center justify-center ${val === 'X' ? 'bg-red-500 hover:bg-red-400' : 'bg-gray-300 hover:bg-gray-200'
                    } text-black font-sans cursor-default`}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-grow py-5 px-4 flex flex-col justify-center items-center text-center overflow-hidden">
            <img src={icon} alt={title} className="w-[25%] object-contain filter grayscale aspect-square mb-[4%]" />
            <h3 className="text-white text-[0.9rem] font-semibold mt-1"> {/* Added a small top margin for spacing if needed */}
              {title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};


const About = () => {
  const introText = "Introduction";
  const overviewHeader = "Overview.";
  const overviewBody = "I'm a computer science student at the University at Albany, with strong foundations in Java, C, JavaScript, and React. I'm deeply passionate about technology, a quick learner, and an excellent problem solver. I love to learn; I am dedicated to the continuous pursuit of new ideas. I'd love to be given the opportunity to work with others and create something meaningful!";

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [introComplete, setIntroComplete] = useState(false);
  const [headerComplete, setHeaderComplete] = useState(false);

  return (
    <div ref={ref}>
      <motion.div>
        <p className={styles.sectionSubText}>
          {inView && (
            <TypewriterText
              text={introText}
              speed={30}
              onComplete={() => setIntroComplete(true)}
            />
          )}
        </p>
        <h2 className={styles.sectionHeadText}>
          {inView && introComplete && (
            <TypewriterText
              text={overviewHeader}
              speed={30}
              onComplete={() => setHeaderComplete(true)}
            />
          )}
        </h2>
      </motion.div>

      <div className={`${styles.sectionTextBlock} min-h-[150px]`}>
        <p>
          {inView && headerComplete && (
            <TypewriterText
              text={overviewBody}
              speed={20}
            />
          )}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row mt-10 gap-12"> {/* Added lg:flex-row and gap */}


        <div className="lg:w-5/7 w-full"> {/* Control width on larger screens */}
          <Tech />
        </div>

        {/* ServiceCards container */}
        <div className="lg:w-1/6 w-full lg:flex-col flex flex-wrap gap-6 justify-center items-start items-center"> {/* Control width and item alignment */}
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");