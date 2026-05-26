import { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    onSearch(city);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: "12px",
          width: "250px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          fontSize: "16px",
          background: "rgba(255,255,255,0.2)",
          color: "white",
          backdropFilter: "blur(10px)",
        }}
      />

      <button
        onClick={handleSearch}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: "none",
          background: "#ffffff33",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;