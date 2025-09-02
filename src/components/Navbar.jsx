import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close, resume, resume_alt, resumepdf } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayResume = isHovered ? resume : resume_alt;

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const offset = 70;
    const sections = document.querySelectorAll("section[id]");

    if (scrollY < sections[0]?.offsetTop - offset) {
      setActive("");
      return;
    }

    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].offsetTop - offset;
      const bottom = top + sections[i].offsetHeight;
      const id = sections[i].getAttribute("id");

      if (
        (scrollY >= top && scrollY < bottom) ||
        (i === sections.length - 1 && scrollY >= top)
      ) {
        const found = navLinks.find((link) => link.id === id)?.title || "";
        if (found !== active) setActive(found);
        return;
      }
    }
  }, [active]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const resetScroll = () => {
    setActive("");
    window.scrollTo(0, 0);
  };

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <li
        key={link.id}
        className={`${active === link.title ? "crt-text" : "text-white"} 
          text-[18px] font-medium cursor-pointer`}
      >
        <a
          className={isMobile ? "" : "crtHover"}
          href={`#${link.id}`}
          onClick={() => isMobile && setToggle(false)}
        >
          {link.title}
        </a>
      </li>
    ));

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-3 fixed top-0 z-20 bg-black`}
    >
      <div className="w-full flex justify-between items-center mx-auto">
        {/* Logo / Name */}
        <Link to="#" className="flex items-center gap-4" onClick={resetScroll}>
          <p className="text-white text-[18px] font-bold cursor-pointer h-8 sm:w-96 w-40 flex items-center crtHover">
            Nick Cyran&nbsp;
            <span className="sm:block hidden">| Software Developer</span>
          </p>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="list-none flex flex-row gap-8 items-center">
            {renderNavLinks()}
          </ul>
          <div
            className="flex items-center justify-center w-8 h-8 ml-4 crtHover shrink-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to={resumepdf} target="_blank" rel="noopener noreferrer">
              <img
                src={displayResume}
                alt="resume"
                className="w-8 h-8 object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-6 h-6 object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
          {toggle && (
            <div className="p-6 bg-black absolute top-16 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-lg border-2">
              <ul className="list-none flex flex-col gap-4">
                {renderNavLinks(true)}
                <li>
                  <Link
                    className="text-white font-poppins font-medium text-[18px]"
                    to={resumepdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setToggle(false)}
                  >
                    Resume
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
