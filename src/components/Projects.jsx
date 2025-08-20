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
        options={{reverse: true, perspective: 1500, max: 15, scale: 1.02, speed: 350 }}
        className="bg-circuit-board-subtle project-card-hardware-border rounded-lg w-[360px] p-1 min-h-[420px]"
      >
        <div className="rounded-[calc(theme(borderRadius.lg)-4px)]">

          <div
            className="relative w-full h-[220px] hover:cursor-pointer "
            onClick={() => window.open(source_code_link, "_blank")}
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-t-[calc(theme(borderRadius.lg)-4px)]"
            />

            <div className="absolute inset-0 flex justify-end card-img_hover shadow-inner rounded-t-[calc(theme(borderRadius.lg)-4px)]">
              <div className="bg-[#2D3748] border border-[#4A5568] w-9 h-9 rounded-md m-3 flex justify-center items-center cursor-pointer shadow-md hover:bg-[#4A5568]" >
                <img src={github} alt="github" className="w-2/3 h-2/3 object-contain filter " />
              </div>
            </div>
          </div>

 
          <div className="p-2 min-h-[190px] flex flex-col justify-end h-full">
            <h3 className="font-bold text-[20.3px] project-name-hardware z-2">{name}</h3>
            <p className="mt-2 text-[14px] text-[#94A3B8] min-h-[60px] z-2">{description}</p>

            <div className="mt-4 flex flex-wrap gap-x-2 gap-y-3 items-end">
              {tags.map((tag) => (
                <p key={tag.name} className={`tag-chip ${tag.color}`}>{tag.name}</p>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section className="">
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