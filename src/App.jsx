import { useState } from "react";
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [dark, setDark] = useState(false);

  return (
    <div
      className={
        dark
          ? "dark bg-black text-white min-h-screen"
          : "bg-white text-black min-h-screen"
      }
    >
      <Header dark={dark} setDark={setDark} />
      <Main setData={setData} />
      <Footer data={data} setData={setData} />
    </div>
  );
}
