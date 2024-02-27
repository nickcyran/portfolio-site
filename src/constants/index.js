import {
    oop,
    brain,
    backend,
    web,
    javascript,
    html,
    css,
    reactjs,
    nodejs,
    mongodb,
    git,
    cprog,
    java,
    site,
    interpreter,
    calc,
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
      title: "Object Oriented Programming",
      icon: oop,
    },
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
    },
    {
      name: "C",
      icon: cprog,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "git",
      icon: git,
    },
  ];
  
  const experiences = [];
  
  const projects = [
    {
      name: "This Site!",
      description:
        "React-based portfolio website.",
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
        "Java-based program that utilizes interpretation techniques in order to perform calculations. Front end developed with JavaFX",
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
  