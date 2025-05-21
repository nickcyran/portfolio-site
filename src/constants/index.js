import {
    oop,
    brain,
    backend,
    web,
    javascript,
    html,
    css,
    react,
    nodejs,
    mongodb,
    git,
    cprog,
    java,
    site,
    interpreter,
    calc,
    tailwind,
    bash,
    threejs,
    renderer,
    sia32,
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "projects",
      title: "Projects",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Backend Development",
      icon: backend,
    },
    {
      title: "Web Development",
      icon: web,
    },
    {
      title: "Creative Problem Solving",
      icon: brain,
    },
  ];
  
  const technologies = [
    {
      name: "Java",
      icon: java,
      mastery: "90%",
    },
    {
      name: "C",
      icon: cprog,
      mastery: "60%",
    },
    {
      name: "JavaScript",
      icon: javascript,
      mastery: "75%",
    },
    {
      name: "React JS",
      icon: react,
      mastery: "70%",
    },
    {
      name: "HTML 5",
      icon: html,
      mastery: "95%",
    },
    {
      name: "CSS 3",
      icon: css,
      mastery: "80%",
    },
    {
      name: "Tailwind",
      icon: tailwind,
      mastery: "80%",
    },
    {
      name: "Node JS",
      icon: nodejs,
      mastery: "60%",
    },
    {
      name: "Three.js",
      icon: threejs,
      mastery: "40%",
    },
    {
      name: "MongoDB",
      icon: mongodb,
      mastery: "55%",
    },
    {
      name: "BASH",
      icon: bash,
      mastery: "60%",
    },
    {
      name: "git",
      icon: git,
      mastery: "70%",
    },
  ];
  
  const experiences = [];
  
  const projects = [
    {
      name: "32-bit Computer Emulator",
      description:
        "Developed an emulator and assembly language for the SIA-32 chip architecture, with 4KB of main memory, caching mechanisms, and much more.",
      tags: [
        {
          name: "java",
          color: "pink-text-gradient",
        },
        {
          name: "binary",
          color: "blue-text-gradient", 
        },
        {
          name: "assembly",
          color: "green-text-gradient",
        },
      ],
      image: sia32,
      source_code_link: "https://github.com/nickcyran/SIA32-Emulator",
    },
    {
      name: "3D Graphics Renderer",
      description:
        "Using only 2D graphics libraries (Java's AWT), this project aims to create a 3D graphics rendering environment. [WIP]",
      tags: [
        {
          name: "java",
          color: "pink-text-gradient",
        },
      ],
      image: renderer,
      source_code_link: "https://github.com/nickcyran/3D-Renderer",
    },
    {
      name: "This Site!",
      description:
        "React-based portfolio website integrating APIs for email functionality, as well as Three.js for 3D elements.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
        {
          name: "threejs",
          color: "green-text-gradient", 
        },
      ],
      image: site,
      source_code_link: "https://github.com/nickcyran/portfolio-site",
    },
    {
      name: "AWK to Java Interpreter",
      description:
        "Java-based program designed to interpret AWK programs as Java code. This tool utilizes lexical analysis and abstract syntax trees to seamlessly execute AWK programs within the Java environment.",
      tags: [
        {
          name: "java",
          color: "pink-text-gradient",
        },
        {
          name: "awk",
          color: "green-text-gradient",
        },
      ],
      image: interpreter,
      source_code_link: "https://github.com/nickcyran/Awk-to-Java-Interpreter",
    },
    {
      name: "Calculator",
      description:
        "Java-based program that utilizes interpretation techniques in order to perform calculations. Front end developed with JavaFX.",
      tags: [
        {
          name: "java",
          color: "pink-text-gradient",
        },
        {
          name: "javafx",
          color: "blue-text-gradient",
        },
      ],
      image: calc,
      source_code_link: "https://github.com/nickcyran/Calculator",
    },
  ];
  
  export { services, technologies, experiences,projects };
  