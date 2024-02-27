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

const MainScreen = () => {
  return (
    <section className="relative w-full min-h-screen mx-auto" style={{ border: "solid rgba(0,0,0,0)" }}>
      <div className={`${styles.paddingX} mt-28 max-w-7xl mx-auto h-[100%] flex flex-row items-start`} >
        <div className="flex flex-col my-auto w-full">

          <div className="flex flex-row">
            <div className="flex flex-col justify-center items-center mt-5 xl:mr-6 lg:mr-6 2xl:mr-6 mr-2">
              <div className="w-5 h-5 rounded-full bg-blue" />
              <div className="w-1 h-48 xl:h-48 blue-gradient" />
            </div>

            <div> <h1 className={`${styles.mainText}`} >
              Hi, I'm <span className="text-blue">Nick</span>
            </h1>
              <p className={`${styles.mainSubText} mt-2 w-full md:w-[80%]`}>
                I'm a software developer who's passionate about bringing my ideas to life through code. 
                I enjoy a challenge; solving intricate puzzles is what I do best.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[950px] h-[500px] mt-[-20px]">
            <ComputersCanvas />
          </div>
        </div>
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <Scroll />
        </a>
      </div>
    </section>
  );
}

export default MainScreen;