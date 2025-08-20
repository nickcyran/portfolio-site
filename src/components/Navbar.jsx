import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { styles } from '../styles';
import { navLinks } from '../constants';
import { menu, close, resume, resume_alt, resumepdf } from '../assets';

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const displayResume = isHovered ? resume : resume_alt;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const navbarOffset = 70;

      const sections = document.querySelectorAll('section[id]');
      let newActive = "";

      if (scrollY < sections[0]?.offsetTop - navbarOffset) {
        setActive("");
        return;
      }

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - navbarOffset;
        const sectionId = current.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          newActive = navLinks.find(link => link.id === sectionId)?.title || "";
        }
      });

      if (newActive !== active) {
        setActive(newActive);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-3 fixed top-0 z-20 bg-black`} >
      <div className="w-full flex justify-between items-center mx-auto">

        <Link to="#"
          className="flex items-center gap-4"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className="text-white text-[18px] font-bold cursor-pointer h-8 sm:w-96 w-40 flex items-center hover:text-[#99e5ab]" >
            Nick Cyran&nbsp;<span className="sm:block hidden">| Software Developer</span>
          </p>
        </Link>

        <ul className="list-none hidden md:flex flex-row gap-10" >
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${active === link.title
                ? "text-menu-text" // This should be your active link color
                : "text-white"
                } text-[18px] font-medium`}
            >
              {/* Removed setActive from onClick of the <a> tag if scroll is handling it */}
              <a className='hover:text-menu-text' href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
          <li className="w-8 h-8 object-contain mt-[-3px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to={resumepdf} target="_blank" rel="noopener noreferrer">
              <img src={displayResume} alt="resume" />
            </Link>
          </li>
        </ul>

        <div className="md:hidden flex flex-1 justify-end items-center cursor-pointer">
          <img
            src={toggle ? close : menu} alt="menu"
            className="w-8 h-8 object-contain "
            onClick={() => setToggle(!toggle)}
          />
          <div className={`${!toggle ? 'hidden' : 'flex'} p-6 bg-tertiary absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.id}
                  className={`${active === link.title
                    ? "text-menu-text"
                    : "text-white"} font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(!toggle);
                    // setActive(link.title); // Let scroll handler manage this
                  }}>
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
              <Link className="text-white font-poppins font-medium cursor-pointer text-[16px]" to={resumepdf} target="_blank" rel="noopener noreferrer">Resume </Link>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;