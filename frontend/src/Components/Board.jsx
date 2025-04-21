import React, { useEffect, useState } from "react";
import Column from "./Column";
import axios from "axios";

function Board() {
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);

  const fetchBoards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/boards");
      setBoards(response.data);
      console.log("Board verileri:", response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cards");
      setCards(response.data);
      console.log("Card verileri:", response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
    fetchCards();
  }, []);
  return (
    <div className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border">
      <Column boards={boards} setBoards={setBoards} cards={cards} setCards={setCards} />
    </div>
  );
}

export default Board;
