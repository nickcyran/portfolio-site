import { useState } from 'react';
import { technologies } from "../constants";
import { styles } from "../styles";
import { click } from '../assets';

import { useMediaQuery } from 'react-responsive'
import { motion } from 'framer-motion'
import { fadeIn } from '../utils/motion'

const defaultTech = {
  name: 'click',
  mastery: 'Select a skill for mastery',
  icon: click, // Provide the path to the default icon
};

const Card = (tech) => {
  return (
    <div className="flex flex-row">
      <div className="h-20 w-20 flex items-center p-2 basis-2/5">
        <img src={tech.icon} alt={tech.name} className="max-h-full max-w-full mx-auto" />
      </div>
      <div className="ml-2 mr-5 w-full my-auto">
        {tech.name === 'click' ?
          (<p className="text-secondary">{tech.mastery}</p>) :
          (<>
            <p className="mb-2 text-secondary">Mastery - {tech.mastery}</p>
            <svg className="h-1 w-full rounded-2xl bg-secondary" xmlns="http://www.w3.org/2000/svg">
              <rect width={`${tech.mastery}`} className="h-[100%] fill-[#0082fe]" />
            </svg>
          </>)}
      </div>
    </div>
  );
}

//style={{border: "solid 1px red"}}
const Tech = () => {
  // State to manage the selected technology
  const [selectedTech, setSelectedTech] = useState(defaultTech);

  // Function to handle technology click
  const handleTechClick = (technology) => {
    setSelectedTech(technology);
  }

  return (
    <motion.div variants={fadeIn("up", "tween", 1)}>
      <div className="flex flex-col mt-16 mx-auto bg-[#1b1641] p-3 rounded-2xl" >

        <div className="flex md:flex-row flex-col">
          <div className="basis-1/6">
            <p className={styles.sectionSubText}> MY SKILLS</p>
            <h3 className={styles.skills}> Skills.</h3>
          </div>

          <div className="basis-1/3 mx-auto w-full my-auto">
            <div className="bg-[#151030] shadow-inner w-full mx-auto rounded-2xl" >
              {selectedTech && <Card {...selectedTech} />}
            </div>
          </div>

          <div className="md:block hidden basis-1/6" />

        </div>
        <div className="flex flex-row flex-wrap justify-center gap-3 bg-[#151030] rounded-2xl p-2 mt-2 shadow-inner" >
          {technologies.map((technology) => (
            <div
              className="w-28 h-32 flex flex-col hover:bg-[#252957] hover:cursor-pointer rounded-2xl pt-2"
              key={technology.name}
              onClick={() => handleTechClick(technology)}
            >
              
              <div className="w-20 h-20 mx-auto border-solid border-1 border-red-500 flex items-center justify-center">
                <img src={technology.icon} alt={technology.name} className="object-contain max-w-full max-h-full" />
              </div>

              <p className="text-white font-black text-center mt-1">{technology.name}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Tech;