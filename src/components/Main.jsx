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
  const [Playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localData && localData.phonetics) {
      let found = null;

      for (let i = 0; i < localData.phonetics.length; i++) {
        if (localData.phonetics[i].audio) {
          found = localData.phonetics[i];
          break;
        }
      }

      if (found) {
        let audioUrl = found.audio;
        if (audioUrl.startsWith("//")) audioUrl = "https:" + audioUrl;

        const sound = new Audio(audioUrl);
        sound.onended = () => setPlaying(false);

        setAudio(sound);
        setPlaying(false);
      } else {
        setAudio(null);
        setPlaying(false);
      }
    }
  }, [localData]);

  const toggleAudio = () => {
    if (!audio) return;

    if (Playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const dataSearch = async (e) => {
    e.preventDefault();

    if (!word.trim()) {
      setError("empty");
      setLocalData(null);
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setLocalData(null);
      setData(null);

      const result = await getWordData(word);

      if (result && result.length > 0) {
        setLocalData(result[0]);
        setData(result[0]);
      }
    } catch {
      setError("notfound");
    } finally {
      setLoading(false);
    }
  };

  const searchBySynonym = async (sin) => {
    setWord(sin);
    setError("");
    setLocalData(null);
    setData(null);

    try {
      setLoading(true);
      const result = await getWordData(sin);

      if (result && result.length > 0) {
        setLocalData(result[0]);
        setData(result[0]);
      }
    } catch {
      setError("notfound");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 pb-24 mx-auto w-full max-w-[737px] px-4">
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

      {loading && (
        <p className="text-center mt-20 text-[#757575] text-lg animate-pulse">
          Loading
          <span className="animate-bounce inline-block">.</span>
          <span className="animate-bounce inline-block delay-150">.</span>
          <span className="animate-bounce inline-block delay-300">.</span>
        </p>
      )}

      {!loading && error === "notfound" && (
        <div className="flex flex-col items-center text-center mt-24">
          <h1 className="text-5xl mb-6">🤫</h1>
          <h2 className="text-lg font-bold mb-3">No Definitions Found</h2>
          <p className="text-[#757575] text-sm max-w-xs">
            Sorry pal, we couldn't find definitions for the word you were
            looking for.
          </p>
        </div>
      )}

      {!loading && localData && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{localData.word}</h1>
              {localData.phonetic && (
                <p className="text-[#A445ED] text-xl mt-1">
                  {localData.phonetic}
                </p>
              )}
            </div>

            {audio && (
              <button onClick={toggleAudio}>
                <img
                  src={Playing ? Pause : Play}
                  alt="audio"
                  className="w-16 h-16"
                />
              </button>
            )}
          </div>

          {localData.meanings.map((meaning, idx) => (
            <div key={idx} className="mt-8">
              <p className="font-bold italic mb-3">{meaning.partOfSpeech}</p>

              <ul className="list-disc pl-5">
                {meaning.definitions.map((def, i) => (
                  <li key={i} className="mb-2">
                    {def.definition}
                  </li>
                ))}
              </ul>

              {meaning.synonyms?.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
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
