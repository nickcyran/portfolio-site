import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Tech } from './';
import { styles } from '../styles';
import { services, coursework } from '../constants';
import { fadeIn } from '../utils/motion';
import { SectionWrapper } from '../hoc';
import TypewriterText from '../utils/TypewriterText';

const ServiceCard = ({ index, title, icon }) => {
  return (
    <motion.div
      variants={fadeIn("right", "spring", 0.3 * index, 0.55)}
      className="xs:w-[180px] w-full md:w-[200px] w-full aspect-[6/5] "
    >
      <div className="w-full h-full bg-[#010101] border border-[#303070] shadow-md text-[#E0E0E0] flex flex-col rounded-[4px]">
        <div className="flex items-center h-[8%] bg-[#000080] border-b border-[#303070] px-1.5 py-2 select-none rounded-t-[4px]">
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
          <h3 className="text-white text-[0.9rem] font-semibold mt-1">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const CourseworkCard = ({ title }) => {
  return (
    <div className="bg-[#030330] border border-[#303070] p-3 rounded-md shadow-md transition-shadow duration-300 min-w-[200px] xs:min-w-[180px]">
      <h3 className="text-white text-[0.85rem] font-medium text-center">{title}</h3>
    </div>
  );
};


const About = () => {
  const introText = "Introduction";
  const overviewHeader = "Overview.";
  const overviewBody = "I'm a computer science student at the University at Albany, with strong foundations in Java, C, JavaScript, and React. I'm deeply passionate about technology, a quick learner, and an excellent problem solver. I love to learn; I am dedicated to the continuous pursuit of new ideas. I'd love to be given the opportunity to work with others and create something meaningful!";

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
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
              speed={20}
              onComplete={() => setIntroComplete(true)}
            />
          )}
        </p>
        <h2 className={styles.sectionHeadText}>
          {inView && introComplete && (
            <TypewriterText
              text={overviewHeader}
              speed={20}
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
              speed={8}
            />
          )}
        </p>
      </div>

      {/* Tech and Services Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row mt-10 gap-12 mb-[-3rem]">
          <div className="lg:w-5/7 w-full">
            <Tech />
          </div>
          <div className="lg:w-1/6 w-full lg:flex-col flex flex-wrap gap-6 justify-center items-start items-center ">
            {services.map((service, index) => (
              <ServiceCard key={service.title} index={index} {...service} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Coursework Section */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div>
          <p className={styles.sectionSubText}>
            Relevant Coursework
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6">
            {coursework.map((course, index) => (
              <CourseworkCard key={index} title={course.title} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(About, "about");