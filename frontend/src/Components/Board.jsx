import React, { useEffect, useState } from "react";
import Column from "./Column";
import axios from "axios";
import { useParams } from "react-router-dom";

function Board() {
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  const { id } = useParams(); // URL'den ID'yi alır
  console.log(id);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/boards/${id}`);
      setBoards(response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/boards/${id}`);
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
