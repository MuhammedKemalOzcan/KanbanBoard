import React, { useEffect, useState } from "react";
import Column from "./Column";
import { DndContext } from "@dnd-kit/core";
import axios from "axios";

function Board() {
  const [boards, setBoards] = useState([]);

  const fetchBoards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/boards");
      setBoards(response.data);
      console.log("Gelen veri:", response.data);
    } catch (error) {
      console.error("Hata:",  error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    let draggedCard;
    let sourceBoardId;
    let updatedBoards = [...boards];

    // 1. Kartı bul ve bulunduğu listeden çıkar
    updatedBoards = updatedBoards.map((board) => {
      const foundCard = board.cards.find((card) => card.id === activeId);
      if (foundCard) {
        draggedCard = foundCard;
        sourceBoardId = board.id;
        return {
          ...board,
          cards: board.cards.filter((card) => card.id !== activeId),
        };
      }
      return board;
    });

    // 2. Kartı hedef listeye ekle
    updatedBoards = updatedBoards.map((board) => {
      if (updatedBoards.id === overId && draggedCard) {
        return {
          ...updatedBoards,
          cards: [...updatedBoards.cards, draggedCard],
        };
      }
      return updatedBoards;
    });

    setBoards(updatedBoards);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border"
    >
      <Column boards={boards} setBoards={setBoards} />
    </DndContext>
  );
}

export default Board;
