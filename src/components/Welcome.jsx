import { useEffect, useLayoutEffect, useState } from 'react';
import { styles } from '../styles';
import { RetroDitheredCanvas } from './canvas';
import { motion } from 'framer-motion';
import { github, linkedin, me } from '../assets';

const useIsPortrait = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useLayoutEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isPortrait;
};

const ScrollIndicator = () => (
  <div className="w-[32px] h-[54px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
    <motion.div
      animate={{ y: [0, 24, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
      className="w-3 h-3 rounded-full bg-secondary mb-1"
    />
  </div>
);

const ProfileImageAndSocials = ({ isPortrait }) => {
  const sizeClass = isPortrait
    ? 'w-[60%] max-w-72'
    : 'w-[15vw] min-w-[160px] max-w-[220px]';

  const socialLinks = [
    {
      href: 'https://github.com/nickcyran',
      alt: 'GitHub',
      icon: github,
      ariaLabel: "Nick's GitHub Profile",
      iconClassName: 'w-8 h-8',
    },
    {
      href: 'https://www.linkedin.com/in/nicolas-cyran/',
      alt: 'LinkedIn',
      icon: linkedin,
      ariaLabel: "Nick's LinkedIn Profile",
      iconClassName: 'w-7 h-7',
    },
  ];

  return (
    <div className={`flex flex-col items-center flex-shrink-0 ${sizeClass}`}>
      <img
        src={me}
        alt="Nick - Software Developer"
        className="w-full aspect-square rounded-full object-cover border-[3px] border-secondary shadow-xl mb-3"
      />
      <div className="flex space-x-4 mx-auto">
        {socialLinks.map((link) => (
          <a
            key={link.alt}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className="text-gray-300 hover:opacity-75 transition-opacity duration-300 flex items-center justify-center p-1"
          >
            <img
              src={link.icon}
              alt={link.alt}
              className={`${link.iconClassName} object-contain`}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

const IntroText = ({ isPortrait }) => (
  <div className={`flex flex-col ${isPortrait ? 'w-full items-center text-center mt-6' : 'flex-1 mt-6'}`}>
    <h1 className={`${isPortrait ? styles.mainText : 'text-[clamp(3rem,3.6vw,4.5rem)]'} z-20 leading-tight`}>
      Hey, I'm <span className="nick-dithered-gradient" data-text="Nick">Nick</span>
    </h1>
    <p className={`${isPortrait ? styles.mainSubText : 'text-[clamp(1.125rem,1.8vw,1.875rem)]'} mt-2 w-full max-w-prose`}>
      I'm a software developer who's passionate about bringing my ideas to life through code.
      I enjoy a challenge; solving intricate puzzles is what I do best!
    </p>
  </div>
);

const CanvasDisplay = ({ isPortrait }) => (
  <div className={`${isPortrait ? 'mt-4 w-[80%] max-w-2xl' : 'w-[33vw]'} aspect-square`}>
    <RetroDitheredCanvas />
  </div>
);

const MainScreen = () => {
  const isPortrait = useIsPortrait();

  return (
    <section className="scanlines relative w-full min-h-screen flex flex-col bg-[#0D0E0E] shadow-[inset_0_-15px_22px_0_rgba(0,0,0,0.7)] animated-gradient-bg">
      <div className="absolute inset-0 bg-tile-pattern bg-repeat opacity-[2%]" style={{ zIndex: 0 }} />

      <div
        className={`relative z-10 w-full max-w-[117rem] px-6 mx-auto flex
        ${isPortrait ? 'flex-col items-center pt-24' : 'flex-row items-center justify-between pt-10'}
        flex-grow gap-x-10`}
      >
        <ProfileImageAndSocials isPortrait={isPortrait} />
        <IntroText isPortrait={isPortrait} />
        <CanvasDisplay isPortrait={isPortrait} />
      </div>

      <div className="w-full flex justify-center items-center py-8 z-10">
        <a href="#about" aria-label="Go to about section">
          <ScrollIndicator />
        </a>
      </div>
    </section>
  );
};

export default MainScreen;
