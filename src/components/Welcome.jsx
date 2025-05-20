import { styles } from '../styles';
import { RetroDitheredCanvas } from './canvas';
import { motion } from 'framer-motion';
import { github, linkedin, me } from '../assets';

const ScrollIndicator = () => (
  <div className="w-[32px] h-[54px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
    <motion.div
      animate={{ y: [0, 24, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
      className="w-3 h-3 rounded-full bg-secondary mb-1"
    />
  </div>
);

const MainScreen = () => {
  const socialLinks = [
    {
      href: 'https://github.com/nickcyran',
      alt: "GitHub",
      icon: github,
      ariaLabel: "Nick's GitHub Profile",
      iconClassName: "w-8 h-8"
    },
    {
      href: 'https://www.linkedin.com/in/nicolas-cyran/',
      alt: "LinkedIn",
      icon: linkedin,
      ariaLabel: "Nick's LinkedIn Profile",
      iconClassName: "w-7 h-7"
    }
  ];

  const ProfileImageAndSocials = () => (
    <div className={`flex flex-col items-center flex-shrink-0 w-auto lg:pt-12`}>
      <img
        className="w-40 h-40 rounded-full object-cover border-[3px] border-secondary shadow-xl mb-3"
        src={me}
        alt="Nick - Software Developer"
      />
      <div className="flex space-x-4 mx-auto ">
        {socialLinks.map(link => (
          <a
            key={link.alt}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:opacity-75 transition-opacity duration-300 flex items-center justify-center p-1"
            aria-label={link.ariaLabel}
          >
            <img src={link.icon} alt={link.alt} className={`${link.iconClassName} object-contain`} />
          </a>
        ))}
      </div>
    </div>
  );

  const IntroText = () => (
    <div className={`
      flex flex-col text-center flex-grow mt-6 md:mt-0 md:order-3  
      sm:text-center sm:w-full                        
      lg:text-left lg:pt-12 md:w-auto lg:max-w-[42vw]  lg:order-2                        
    `}>
      <h1 className={`${styles.mainText} z-20`}>
        Hey, I'm <span className="nick-dithered-gradient" data-text="Nick">Nick</span>
      </h1>
      <p className={`${styles.mainSubText} mt-3 w-full max-w-prose`}>
        I'm a software developer who's passionate about bringing my ideas to life through code.
        I enjoy a challenge; solving intricate puzzles is what I do best!
      </p>
    </div>
  );

  const CanvasDisplay = () => (
    <div className={`sm:order-3 md:order-2`}>
      <div className="w-[90vw] xs:w-[28rem] sm:w-[28rem] md:w-[22rem] lg:w-[30rem] xl:w-[40rem] h-auto aspect-square">
        <RetroDitheredCanvas />
      </div>
    </div>
  );

  return (
    <section className="relative w-full min-h-screen mx-auto flex flex-col bg-[#0D0E0E] shadow-[inset_0_-15px_22px_0_rgba(0,0,0,0.7)]">
      <div className='absolute inset-0 bg-tile-pattern bg-repeat opacity-[2%]' style={{ zIndex: 0 }} />

      <div
        className={`
        relative z-10 mx-auto flex flex-col items-center justify-start 
        flex-grow w-full px-4 pt-20

        md:pt-20 md:items-center md:flex-row md:flex-wrap md:justify-center md:gap-x-5    
        lg:items-start lg:flex-row lg:flex-nowrap lg:gap-x-5 lg:pt-32        
      `}>

        <ProfileImageAndSocials />
        <IntroText />
        <CanvasDisplay />
      </div>

      <div className="w-full flex justify-center items-center py-4 sm:py-6 md:py-8 z-10">
        <a href="#about" aria-label="Go to about section">
          <ScrollIndicator />
        </a>
      </div>
    </section>
  );
}

export default MainScreen;