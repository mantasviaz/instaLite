import React, { useState } from "react";

function Search({ isOpen }) {
  const [content, setContent] = useState("");
  function handleSearch(event) {
    event.preventDefault();

    // TO DO Handle Search
    console.log(event);
    console.log(content);
  }
  return (
    <div
      className={`absolute left-[6rem] flex h-full flex-col items-center rounded-2xl border-solid shadow-[rgba(0,0,0,0.1)_5px_0px_10px_0px] ${isOpen ? "w-0 opacity-0" : "w-96 opacity-100"} transition-max-width duration-500`}
    >
      <h1 className="w-full p-7 text-left text-3xl font-semibold">Search</h1>
      <form className="w-[85%]" onSubmit={handleSearch}>
        <input
          className="w-full rounded-xl border-solid bg-stone-200 p-3"
          type="text"
          placeholder="Search"
          onChange={(event) => setContent(event.target.value)}
        />
      </form>
    </div>
  );
}

export default Search;
