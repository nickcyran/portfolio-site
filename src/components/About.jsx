import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'

import { Tech } from './';
import { styles } from '../styles'
import { services } from '../constants'
import { fadeIn, textVariant } from '../utils/motion'
import { SectionWrapper } from '../hoc';

const ServiceCard = ({ index, title, icon }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Adjust the maxWidth as needed for your definition of mobile

  const cardVariants = isMobile ? {} : fadeIn("right", "spring", 0.5 * index, 0.75);

  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div variants={cardVariants}>
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450
          }}
          className="bg-color-1 rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col ">

          <img src={icon} alt={title} className="w-16 h-16" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  )
}

const About = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText} >INTRODUCTION</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={isMobile ? {} : fadeIn("", "", 0.1, 1)}
        className={styles.sectionTextBlock}
      >
        I'm a computer science student at the University at Albany, with strong foundations in Java, C, JavaScript, and React.
        I'm deeply passionate about technology, a quick learner, and an excellent problem solver. I love to learn; I am dedicated to the continuous pursuit of new ideas.
        I'd love to be given the opportunity to work with others and create something meaningful!
      </motion.p>

      <div className="mt-16 flex flex-wrap gap-10 justify-center items-center" >
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
      <Tech />
    </div>
  )
}

export default SectionWrapper(About, "about");