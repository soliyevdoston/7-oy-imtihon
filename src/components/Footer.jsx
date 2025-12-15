import link from "../assets/icon-new-window.svg";

export default function Footer({ data }) {
  const defaultUrl = "https://en.wiktionary.org/wiki/Wiktionary:Main_Page";

  let manzil = [];

  if (data && data.sourceUrls && data.sourceUrls.length > 0) {
    manzil = data.sourceUrls;
  } else {
    manzil = [defaultUrl];
  }

  return (
    <div
      className="
        fixed bottom-0 left-1/2 -translate-x-1/2 z-50
        w-full max-w-[375px] px-4 pb-5
        sm:max-w-[640px]
        md:max-w-[737px]
      "
    >
      <div className="w-full h-[1px] bg-[#E9E9E9] mb-4" />

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 sm:items-center">
        <h4 className="text-[#757575] dark:text-[#BEBEBE] shrink-0">Source</h4>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {manzil.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all text-sm text-black dark:text-[#A445ED]"
            >
              {url}
            </a>
          ))}

          <img src={link} alt="link" className="w-4 h-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
