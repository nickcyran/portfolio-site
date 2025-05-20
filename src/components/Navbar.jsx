import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { styles } from '../styles';
import { navLinks } from '../constants';
import { logo, menu, close, resume, resume_alt, resumepdf } from '../assets';

//style={{border: "solid 1px red"}}
const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const displayResume = isHovered ? resume : resume_alt;

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

          <p className="text-white text-[18px] font-bold cursor-pointer h-8 sm:w-96 w-40 flex items-center " >
            Nick Cyran&nbsp;<span className="sm:block hidden">| Software Developer</span>
          </p>
        </Link>

        <ul className="list-none hidden md:flex flex-row gap-10" >
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${active === link.title
                ? "text-[#f5c656]"
                : "text-white"
                } hover:text-[#f5c656] text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
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
            src={toggle ? close : menu}
            alt="menu"
            className="w-8 h-8 object-contain "
            onClick={() => setToggle(!toggle)}
          />

          <div className={`${!toggle ? 'hidden' : 'flex'} p-6 bg-tertiary
          absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${active === link.title
                    ? "text-[#f5c656]"
                    : "text-white"} font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(link.title);
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

export default Navbar