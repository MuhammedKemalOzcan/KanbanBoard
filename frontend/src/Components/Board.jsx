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
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cards");
      setCards(response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
    fetchCards();
  }, []);

  return (
    <Column
      boards={boards}
      setBoards={setBoards}
      cards={cards}
      setCards={setCards}
    />
  );
}

export default Board;
