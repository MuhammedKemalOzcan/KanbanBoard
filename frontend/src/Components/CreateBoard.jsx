import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBoard() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:3000/boards", {
        name: name,
      });

      console.log("Board oluşturuldu:", response.data);
      const newBoard = response.data;
      navigate(`/board/${newBoard.id}`);
    } catch (err) {
      console.error("Oluşturma hatası:", err);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900 px-4">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Yeni Board Oluştur</h2>
        <input
          placeholder="Board adı girin"
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
        />
        <button
          onClick={handleClick}
          className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 text-white p-3 rounded-lg font-medium"
        >
          Oluştur
        </button>
      </div>
    </div>
  );
}

export default CreateBoard;
