import { BallCanvas } from "./canvas";
import { technologies } from "../constants";

import { shadow } from "../assets"

const Tech = () => {
  return (
      <div className="flex flex-row flex-wrap justify-center mt-16 gap-4">
        {technologies.map((technology) => (
          <div className="w-28 h-36 flex flex-col" key={technology.name}>
            <BallCanvas icon={technology.icon} />
            <img className="mx-auto w-20 h-10 select-none opacity-60" src={shadow} alt="shadow" />
          </div>
        ))}
      </div>
  )
}

export default Tech;