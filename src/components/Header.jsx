import { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import Line from "../assets/Rectangle.svg";
import Dark from "../assets/Light.svg";
import Light from "../assets/Dark.svg";
import Chack from "../assets/icon-arrow-down.svg";

export default function Header() {
  const [font, setFont] = useState("sans-serif");
  const [dark, setDark] = useState(false);

  // 🌍 FONT — butun sahifa
  useEffect(() => {
    document.documentElement.style.fontFamily = font;
  }, [font]);

  // 🌙 DARK MODE — butun sahifa
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex justify-between items-center w-[737px] mx-auto mt-[35px]">
      <a href="/">
        <img src={Logo} alt="Logo" />
      </a>

      <div className="flex gap-[26px] items-center">
        {/* FONT SELECT */}
        <div className="relative">
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="appearance-none bg-transparent cursor-pointer pr-8"
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Mono</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <img src={Chack} alt="arrow" className="w-[12px] h-[6px]" />
          </div>
        </div>

        {/* LINE */}
        <img src={Line} alt="line" />

        {/* DARK MODE */}
        <img
          src={dark ? Dark : Light}
          alt="mode"
          className="cursor-pointer"
          onClick={() => setDark(!dark)}
        />
      </div>
    </div>
  );
}
