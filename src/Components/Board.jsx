import React, { useState } from "react";
import Column from "./Column";
import { DndContext } from "@dnd-kit/core";

function Board() {
  const [lists, setLists] = useState([
    { id: "backlog", title: "Backlog", cards: [] },
    { id: "todo", title: "To do", cards: [] },
    { id: "in-progress", title: "In Progress", cards: [] },
    { id: "designed", title: "Designed", cards: [] },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    let draggedCard;
    let sourceListId;
    let updatedLists = [...lists];

    // 1. Kartı bul ve bulunduğu listeden çıkar
    updatedLists = updatedLists.map((list) => {
      const foundCard = list.cards.find((card) => card.id === activeId);
      if (foundCard) {
        draggedCard = foundCard;
        sourceListId = list.id;
        return {
          ...list,
          cards: list.cards.filter((card) => card.id !== activeId),
        };
      }
      return list;
    });

    // 2. Kartı hedef listeye ekle
    updatedLists = updatedLists.map((list) => {
      if (list.id === overId && draggedCard) {
        return {
          ...list,
          cards: [...list.cards, draggedCard],
        };
      }
      return list;
    });

    setLists(updatedLists);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border"
    >
      <Column lists={lists} setLists={setLists} />
    </DndContext>
  );
}

export default Board;
