import { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import Line from "../assets/Rectangle.svg";
import Dark from "../assets/Light.svg";
import Light from "../assets/Dark.svg";
import Chack from "../assets/icon-arrow-down.svg";

export default function Header({ dark, setDark }) {
  const [font, setFont] = useState("sans-serif");

  useEffect(() => {
    document.documentElement.style.fontFamily = font;
  }, [font]);

  return (
    <div
      className="
        flex justify-between items-center
        w-full max-w-[375px] px-4 pt-6 mx-auto
        sm:max-w-[640px]
        md:max-w-[737px]
      "
    >
      <a href="/">
        <img src={Logo} alt="Logo" className="w-7 sm:w-8" />
      </a>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative text-sm sm:text-base">
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="
              appearance-none bg-transparent pr-6
              focus:outline-none cursor-pointer
            "
          >
            <option className="dark:text-white" value="sans-serif">
              Sans Serif
            </option>
            <option className="dark:text-white" value="serif">
              Serif
            </option>
            <option className="dark:text-white" value="monospace">
              Mono
            </option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <img src={Chack} alt="arrow" className="w-3 h-[6px]" />
          </div>
        </div>

        <img src={Line} alt="line" className="hidden sm:block" />

        <button onClick={() => setDark(!dark)}>
          <img
            src={dark ? Light : Dark}
            alt="mode"
            className="
        w-10 sm:w-15 md:w-20"
          />
        </button>
      </div>
    </div>
  );
}
