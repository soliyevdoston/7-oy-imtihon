import { useEffect, useState } from "react";
import getWordData from "../api/api";
import link from "../assets/icon-new-window.svg";

export default function Footer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const word = "hello";

    const loadData = async () => {
      try {
        const result = await getWordData(word);
        setData(result[0]);
      } catch (err) {
        console.error(err.message);
      }
    };

    loadData();
  }, []);

  if (!data || !data.sourceUrls) return null;

  return (
    <div className="fixed mb-0 bottom-[30px] bg-white left-1/2 -translate-x-1/2 w-[737px]">
      <div className="w-[100%] h-[1px] bg-[#E9E9E9] mb-[19px]"></div>

      <div className="source flex gap-[30px]">
        <h4 className="text-[#757575]">Source</h4>

        {data.sourceUrls.map((url, idx) => (
          <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        ))}

        <img src={link} alt="link" />
      </div>
    </div>
  );
}
