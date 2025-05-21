import { useState, useEffect, useRef } from 'react';
import { technologies } from "../constants"; 
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../utils/motion';
import TypewriterText from '../utils/TypewriterText';

const CLI = "D:\\Users\\nickcyran\\stats> ";

const getMasteryBar = (pct) => {
  const pctVal = parseInt(pct);
  if (!pct?.endsWith('%') || isNaN(pctVal)) return pct ? '[ANALYSIS ERROR]' : '[CLASSIFIED DATA]';
  const filled = Math.round(pctVal / 5);
  return `[${'█'.repeat(filled)}${'▒'.repeat(20 - filled)}] ${pctVal}%`;
};

const BlinkingCursor = ({ underscore = false, className = "text-cli-white", color = "#CCC" }) => (
  underscore ? (
    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className={className}>_</motion.span>
  ) : (
    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ backgroundColor: color, height: '1em', width: '0.6em', display: 'inline-block', marginLeft: 2, verticalAlign: 'text-bottom' }} />
  )
);

const StaticTextDisplay = ({ text }) => (
  <p className="whitespace-pre-wrap text-cli-white text-sm">{text}</p>
);

const SkillOutputDisplay = ({ tech }) => {
  return (
    <motion.div
      className="w-full flex items-start pt-1 text-cli-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.div className="h-12 w-12 p-0.5 mr-2 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <img src={tech.icon} alt={tech.name} className="object-contain max-w-full max-h-full filter grayscale" />
      </motion.div>
      <div className="ml-1 w-full text-xs">
        <p className="mb-0.5 font-semibold">Skill: {tech.name}</p>
        <p className="text-cli-light-gray mb-1">Mastery:</p>
        <motion.p className="text-cli-green text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.05 }}>
          {getMasteryBar(tech.mastery)}
        </motion.p>
      </div>
    </motion.div>
  );
};

const Tech = () => {
  const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const initialSystemLines = [
    { type: 'staticText', text: 'Michaelsoft Binbows [Version 9.14.01134.413]', id: generateId() },
    { type: 'staticText', text: '(c) Michaelsoft Corporation. All rights reserved.', id: generateId() },
    { type: 'staticText', text: '\n', id: generateId() },
  ];

  const [lines, setLines] = useState(initialSystemLines);
  const [activity, setActivity] = useState(null);
  const [currentSelectedTechVisual, setCurrentSelectedTechVisual] = useState(null);

  const [isLocked, setIsLocked] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hover, setHover] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setShowPrompt(true);
      setIsLocked(false);
    }, 100);

    return () => clearTimeout(bootTimer);
  }, []);

  const selectTech = (tech) => {
    if (isLocked || (activity?.type === 'typingCommand' && activity?.techForOutput?.name === tech.name)) return;

    setIsLocked(true);
    setShowPrompt(false);
    setCurrentSelectedTechVisual(tech);
    setActivity({
      type: 'typingCommand',
      text: `${CLI}query skill --name "${tech.name}" --details`,
      techForOutput: tech,
    });
  };

  const onCommandTypingComplete = () => {
    if (activity && activity.type === 'typingCommand') {
      const { text: commandText, techForOutput } = activity;
      setLines(prevLines => [...prevLines, { type: 'staticText', text: commandText, id: generateId() }]);
      setLines(prevLines => [...prevLines, { type: 'skillOutput', tech: techForOutput, id: generateId() }]);

      setActivity(null);
      setShowPrompt(true);
      setIsLocked(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, activity, showPrompt]);

  return (
    <motion.div variants={fadeIn("up", "tween", 0.1, 0.7)} className="flex flex-col bg-[#010101] p-0 border border-[#303070] shadow-md font-cascadia text-[#E0E0E0] w-full">
      {/* Header */}
      <div className="flex items-center h-6 bg-[#000080] border-b border-[#303070] px-2 select-none">
        <p className="text-xs text-white">Command Prompt - Skill Analyzer</p>
        <div className="ml-auto flex items-center space-x-0.5">
          {['_', '□', 'X'].map((val, i) => (
            <div key={i} className={`w-4 h-4 text-[10px] flex items-center justify-center ${val === 'X' ? 'bg-red-500 hover:bg-red-400' : 'bg-gray-300 hover:bg-gray-200'} text-black font-sans`}>{val}</div>
          ))}
        </div>
      </div>

      {/* CLI Output Area */}
      <div ref={scrollRef} className="p-2 sm:p-3 h-72 overflow-y-auto relative cli-output-area mr-2 cli-scrollbar">
        <div>
          {lines.map(line => {
            if (line.type === 'staticText') {
              return <StaticTextDisplay key={line.id} text={line.text} />;
            }
            if (line.type === 'skillOutput') {
              return <SkillOutputDisplay key={line.id} tech={line.tech} />;
            }
            return null;
          })}

          {activity?.type === 'typingCommand' && (
            <div className="whitespace-pre-wrap text-cli-white text-sm">
              <span>{CLI}</span>
              <TypewriterText
                text={activity.text.substring(CLI.length)}
                speed={40}
                onComplete={onCommandTypingComplete}
              />
            </div>
          )}

          {showPrompt && !activity && (
            <div className="text-sm whitespace-pre-wrap mt-1 text-cli-white">
              <span>{CLI}</span>
              <BlinkingCursor />
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-[#303070] my-1 mx-2" />

      <div className="px-2 pb-1 h-56 overflow-auto cli-scrollbar mr-2">
        <p className="text-xs text-cli-light-gray mb-1 ml-1 ">Available skill protocols (select to query):</p>
        <motion.div
          className="flex flex-col gap-0  pr-1 "
          variants={staggerContainer(0.015, 0.025)}
          initial="hidden"
          animate="show"
          viewport={{ once: false, amount: 0.1 }}
        >
          {technologies.map((tech) => {
            const isCurrentlySelected = currentSelectedTechVisual?.name === tech.name;
            const isBeingProcessed = activity?.type === 'typingCommand' && activity?.techForOutput?.name === tech.name;

            let itemClass = 'text-[#E0E0E0] hover:bg-[#2A2A2A] cursor-pointer';
            if (isLocked || isBeingProcessed) {
              itemClass = `opacity-60 cursor-default ${isCurrentlySelected ? 'bg-[#4A4A4A] text-[#F0F0F0]' : 'text-[#E0E0E0]'}`;
            } else if (isCurrentlySelected && !activity) {
              itemClass = 'bg-[#E0E0E0] text-[#010101]';
            } else if (hover === tech.name) {
              itemClass = 'bg-[#4A4A4A] text-[#F0F0F0]';
            }

            return (
              <div
                key={tech.name}
                className={`flex items-center pl-1.5 pr-1 py-0.5 text-xl ${itemClass}`}
                onClick={() => !(isLocked || isBeingProcessed) && selectTech(tech)}
                onMouseEnter={() => !(isLocked || isBeingProcessed) && setHover(tech.name)}
                onMouseLeave={() => !(isLocked || isBeingProcessed) && setHover(null)}
              >
                <span className={`mr-2 ${isCurrentlySelected && !activity ? 'text-transparent' : 'text-cli-green'}`}>
                  {isCurrentlySelected && !activity ? <BlinkingCursor underscore className="text-[#010101]" /> : '-'}
                </span>
                <img src={tech.icon} alt={tech.name} className="w-3.5 h-3.5 mr-1.5 object-contain filter grayscale" />
                <span>{tech.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Tech;