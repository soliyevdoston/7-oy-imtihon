import { useState, useEffect } from "react";
import getWordData from "../api/api";
import Search from "../assets/icon-search.svg";
import Play from "../assets/icon-play.svg";
import Pause from "../assets/pause.png";

export default function Main({ setData }) {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [localData, setLocalData] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (localData && localData.phonetics) {
      let foundAudio = null;

      for (let i = 0; i < localData.phonetics.length; i++) {
        if (
          localData.phonetics[i].audio &&
          localData.phonetics[i].audio !== ""
        ) {
          foundAudio = localData.phonetics[i];
          break;
        }
      }

      if (foundAudio) {
        let audioUrl = foundAudio.audio;

        if (audioUrl.startsWith("//")) {
          audioUrl = "https:" + audioUrl;
        }

        const sound = new Audio(audioUrl);

        sound.onended = function () {
          setIsPlaying(false);
        };

        setAudio(sound);
        setIsPlaying(false);
      } else {
        setAudio(null);
        setIsPlaying(false);
      }
    } else {
      setAudio(null);
      setIsPlaying(false);
    }
  }, [localData]);

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const dataSearch = async (e) => {
    e.preventDefault();

    if (word === "") {
      setError("empty");
      setLocalData(null);
      setData(null);
    } else {
      try {
        const result = await getWordData(word);

        if (result && result.length > 0) {
          setLocalData(result[0]);
          setData(result[0]);
          setError("");
        } else {
          setError("notfound");
          setLocalData(null);
          setData(null);
        }
      } catch (err) {
        setError("notfound");
        setLocalData(null);
        setData(null);
      }
    }
  };

  const searchBySynonym = async (syn) => {
    setWord(syn);
    setError("");
    setLocalData(null);
    setData(null);

    try {
      const result = await getWordData(syn);

      if (result && result.length > 0) {
        setLocalData(result[0]);
        setData(result[0]);
      } else {
        setError("notfound");
      }
    } catch (err) {
      setError("notfound");
    }
  };

  return (
    <div
      className="
        pt-8 pb-24 mx-auto
        w-full max-w-[375px] px-4
        sm:max-w-[640px]
        md:max-w-[737px]
      "
    >
      <form onSubmit={dataSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for any word…"
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            className={`
              w-full h-14 sm:h-16
              rounded-2xl
              bg-[#F4F4F4] dark:bg-[#1F1F1F]
              text-base sm:text-xl
              pl-4 pr-12
              text-black dark:text-white
              border outline-none
              ${
                error
                  ? "border-[#ff5252]"
                  : "border-transparent focus:border-[#A445ED]"
              }
            `}
          />

          <img
            src={Search}
            alt="search"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
          />
        </div>

        {error === "empty" && (
          <p className="text-[#ff5252] text-sm mt-1">Whoops, can’t be empty…</p>
        )}
      </form>

      {error === "notfound" && (
        <div className="flex flex-col items-center text-center mt-24">
          <h1 className="text-5xl mb-6">🤫</h1>
          <h2 className="text-lg font-bold mb-3">No Definitions Found</h2>
          <p className="text-[#757575] text-sm max-w-xs">
            Sorry pal, we couldn't find definitions for the word you were
            looking for.
          </p>
        </div>
      )}

      {localData && (
        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold">
                {localData.word}
              </h1>
              {localData.phonetic && (
                <p className="text-[#A445ED] text-lg sm:text-2xl mt-1">
                  {localData.phonetic}
                </p>
              )}
            </div>

            {audio && (
              <button onClick={toggleAudio} type="button">
                <img
                  src={isPlaying ? Pause : Play}
                  alt="audio"
                  className="w-14 h-14 sm:w-[75px] sm:h-[75px]"
                />
              </button>
            )}
          </div>

          {localData.meanings.map((meaning, idx) => (
            <div key={idx} className="mt-8">
              <div className="flex items-center gap-4 mb-4">
                <p className="font-bold italic">{meaning.partOfSpeech}</p>
                <div className="flex-1 h-px bg-[#E9E9E9] dark:bg-[#3A3A3A]" />
              </div>

              <ul className="list-disc pl-5">
                {meaning.definitions.map((def, i) => (
                  <li
                    key={i}
                    className="marker:text-[#A445ED] mb-2 text-sm sm:text-base"
                  >
                    {def.definition}
                  </li>
                ))}
              </ul>

              {meaning.synonyms?.length > 0 && (
                <div className="mt-4 flex gap-4 flex-wrap">
                  <p className="text-[#757575]">Synonyms</p>
                  {meaning.synonyms.map((syn, i) => (
                    <button
                      key={i}
                      onClick={() => searchBySynonym(syn)}
                      className="text-[#A445ED] font-bold hover:underline"
                    >
                      {syn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
