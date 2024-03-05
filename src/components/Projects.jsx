import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion'

import { styles } from '../styles'
import { github } from '../assets';
import { SectionWrapper } from '../hoc';
import { projects } from '../constants';
import { fadeIn, textVariant } from '../utils/motion'


const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 20,
          scale: 1,
          speed: 450
        }}
        className="bg-tertiary rounded-2xl sm:w-[360px] w-full" >
        <div className="relative w-full h-[230px] hover:cursor-pointer" onClick={() => window.open(source_code_link, "_blank")}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-t-2xl"
          />

          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              className="bg-black w-8 h-8 rounded-full flex justify-center items-center cursor-pointer">
              <img
                src={github}
                alt="github"
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="m-3 pb-3">
          <h3 className="font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>#{tag.name}</p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

const Projects = () => {
  return (
    <section className="mt-[-64px]">
      <motion.div variants={textVariant()} >
        <p className={styles.sectionSubText}>
          MY PROJECTS
        </p>
        <h2 className={styles.sectionHeadText}>
          Projects.
        </h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className={styles.sectionTextBlock}
        >
          This section showcases my capabilities and skills. All projects have a brief description and a link to its repository.
          These represent my problem solving abilites, my proficiency in these languages, as well as my ability to work with various technologies.
          My resume can be found in the top right in the menu. I hope you like what you see.
        </motion.p>
      </div>

      <div className='mt-16 flex flex-wrap gap-7 justify-center items-center' >
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`}
            index={index}
            {...project} />
        ))}
      </div>
    </section>
  )
}

export default SectionWrapper(Projects, "projects");