import React, { useEffect, useState } from "react";

function Search({ isOpen }) {
  const [content, setContent] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history") || '""');
    if (typeof history === "object") {
      setRecent(history.recent);
    }
    console.log(history);
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    setRecent([content, ...recent]);

    window.localStorage.setItem(
      "history",
      JSON.stringify({ recent: [content, ...recent] }),
    );

    // TO DO Handle Search
    console.log(event);
    console.log(content);
    setContent("");
  }

  function clearRecent() {
    setRecent([]);
    window.localStorage.setItem("history", JSON.stringify({ recent: [] }));
  }

  return (
    <div
      className={`absolute left-[90px] flex h-full flex-col items-center rounded-2xl border-solid shadow-[rgba(0,0,0,0.1)_5px_0px_10px_0px] ${isOpen ? "w-0 opacity-0" : "w-96 opacity-100"} transition-max-width duration-500`}
    >
      <h1 className="w-full p-7 text-left text-3xl font-semibold">Search</h1>
      <form
        className="flex-center w-full border-b-2 pb-8"
        onSubmit={handleSearch}
      >
        <input
          className="w-[90%] rounded-xl border-solid bg-stone-200 p-3"
          type="search"
          placeholder="Search"
          onChange={(event) => setContent(event.target.value)}
          value={content}
        />
      </form>
      <div className="flex-between w-full p-7">
        <h1 className="text-md font-medium">Recent</h1>
        <a
          className="text-md cursor-pointer font-semibold text-blue-400 hover:text-blue-800"
          onClick={clearRecent}
        >
          Clear all
        </a>
      </div>
      <div className="flex-center flex-col">
        {recent.map((r, index) => (
          <a
            className="cursor-pointer"
            key={index}
            onClick={(event) => setContent(event.target.text)}
          >
            {r}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Search;
