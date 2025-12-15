const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

const getWordData = async (word) => {
  const res = await fetch(`${BASE_URL}/${word}`);

  if (!res.ok) {
    throw new Error("Soz topilmadi");
  }

  return res.json();
};

export default getWordData;
