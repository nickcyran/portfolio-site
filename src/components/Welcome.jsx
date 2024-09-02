import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { motion } from 'framer-motion';

const Scroll = () => {
  return (
    <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
      <motion.div
        animate={{
          y: [0, 24, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop'
        }}
        className="w-3 h-3 rounded-full bg-secondary mb-1"
      />
    </div>
  )
}

//style={{border: "solid 1px red"}}
const MainScreen = () => {
  return (
    <section className="relative w-full min-h-screen mx-auto grid content-center" >
    <div className="lg:flex-row mx-auto flex flex-col lg:pt-5 pt-28 justify-center">

        <div className="basis-6/12 lg:pl-[5.2rem] px-8 h-fit">
          <h1 className={styles.mainText} >
            Hey, I'm <span className="text-blue">Nick</span>
          </h1>
          <p className={`${styles.mainSubText} mt-2 w-full `}>
            I'm a software developer who's passionate about bringing my ideas to life through code.
            I enjoy a challenge; solving intricate puzzles is what I do best.
          </p>
        </div>

        <div className="sm:w-[30rem] sm:h-[28rem] w-[90%] h-[28rem] lg:mr-10 lg:ml-[-10px] mx-auto my-auto">
          <ComputersCanvas />
        </div>  

      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about" aria-label="Go to about section">
          <Scroll />
        </a>
      </div>
    </section>
  );
}

export default MainScreen;