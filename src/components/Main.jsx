import { useState, useEffect } from "react";
import getWordData from "../api/api";
import Search from "../assets/icon-search.svg";
import Play from "../assets/icon-play.svg";
import Pause from "../assets/pause.png";

export default function Main() {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ================= AUDIO ================= */
  useEffect(() => {
    if (data?.phonetics) {
      const phoneticWithAudio = data.phonetics.find(
        (p) => p.audio && p.audio.length > 0
      );

      if (phoneticWithAudio) {
        const audioUrl = phoneticWithAudio.audio.startsWith("//")
          ? "https:" + phoneticWithAudio.audio
          : phoneticWithAudio.audio;

        const newAudio = new Audio(audioUrl);
        newAudio.onended = () => setIsPlaying(false);

        setAudio(newAudio);
      } else {
        setAudio(null);
      }
    }

    setIsPlaying(false);
  }, [data]);

  const toggleAudio = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const searchBySynonym = async (syn) => {
    setWord(syn);
    setError("");
    setData(null);

    try {
      const result = await getWordData(syn);

      if (!result || result.length === 0) {
        setError("notfound");
        return;
      }

      setData(result[0]);
    } catch {
      setError("notfound");
    }
  };

  /* ================= SEARCH ================= */
  const dataSearch = async (e) => {
    e.preventDefault();

    if (!word.trim()) {
      setError("empty");
      setData(null);
      return;
    }

    try {
      const result = await getWordData(word);

      if (!result || result.length === 0) {
        setError("notfound");
        setData(null);
        return;
      }

      setData(result[0]);
      setError("");
    } catch {
      setError("notfound");
      setData(null);
    }
  };

  return (
    <div className="pt-[51.5px] w-[737px] mx-auto pb-[100px] ">
      {/* ================= SEARCH INPUT ================= */}
      <form onSubmit={dataSearch}>
        <div className="relative w-[736px] mx-auto">
          <input
            className={`
              w-full h-[64px] rounded-[16px] bg-[#F4F4F4]
              text-[20px] pl-[20px]
              border outline-none border-transparent
              focus:border-[#A445ED]
              ${error ? "border-[#ff5252] focus:border-[#ff5252]" : ""}
            `}
            type="text"
            placeholder="Search for any word…"
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
          />

          <img
            src={Search}
            alt="search"
            className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[20px] h-[20px]"
          />
        </div>

        {error === "empty" && (
          <p className="text-[#ff5252] text-[14px] mt-[6px]">
            Whoops, can’t be empty…
          </p>
        )}
      </form>

      {/* ================= NOT FOUND ================= */}
      {error === "notfound" && (
        <div className="w-[736px] h-[204px] mx-auto flex flex-col items-center text-center pt-[132px]">
          <h1 className="text-[64px] mb-[44px]">🤫</h1>

          <h2 className="text-[20px] font-bold mb-[24px]">
            No Definitions Found
          </h2>

          <p className="text-[#757575]">
            Sorry pal, we couldn't find definitions for the word you were
            looking for. You can try the search again at later time or head to
            the web instead.
          </p>
        </div>
      )}

      {/* ================= WORD DATA ================= */}
      {data && (
        <div>
          {/* WORD + AUDIO */}
          <div className="mt-[45px] flex items-center justify-between">
            <div>
              <h1 className="text-[45px] font-bold">{data.word}</h1>

              {data.phonetic && (
                <p className="text-[#A445ED] text-[24px] mt-[8px]">
                  {data.phonetic}
                </p>
              )}
            </div>

            {audio && (
              <button
                onClick={toggleAudio}
                type="button"
                className="w-[75px] h-[75px] flex items-center justify-center"
              >
                <img
                  src={isPlaying ? Pause : Play}
                  alt="audio"
                  className="w-[75px] h-[75px]"
                />
              </button>
            )}
          </div>

          {/* ================= MEANINGS ================= */}
          {data.meanings.map((meaning, idx) => (
            <div key={idx} className="mt-[40px]">
              {/* PART OF SPEECH */}
              <div className="flex items-center gap-[20px] mb-[24px]">
                <p className="font-bold italic text-[18px]">
                  {meaning.partOfSpeech}
                </p>
                <div className="flex-1 h-[1px] bg-[#E9E9E9]"></div>
              </div>
              <p className="text-[#757575]">Meaning</p>

              <ul className="w-[714px] h-full mx-auto mt-[20px] list-disc pl-[24px]">
                {meaning.definitions.map((def, i) => (
                  <li
                    key={i}
                    className="text-[#2D2D2D]  marker:text-[#A445ED] mb-[8px]"
                  >
                    {def.definition}
                  </li>
                ))}
              </ul>
              <div>
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="mt-[20px] flex items-start gap-[22px] pt-[40px]">
                    <p className="text-[#757575] min-w-[80px]">Synonyms</p>

                    <div className="flex flex-wrap gap-[12px]">
                      {meaning.synonyms.map((syn, i) => (
                        <button
                          key={i}
                          onClick={() => searchBySynonym(syn)}
                          className="text-[#A445ED] cursor-pointer font-bold hover:underline"
                        >
                          {syn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {meaning.definitions[0]?.example && (
                <p className="mt-[12px] text-[#757575] italic">
                  “{meaning.definitions[0].example}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
