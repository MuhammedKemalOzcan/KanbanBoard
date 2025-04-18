import React, { useEffect, useState } from "react";
import Column from "./Column";
import { closestCorners, DndContext } from "@dnd-kit/core";
import axios from "axios";
import { SortableContext } from "@dnd-kit/sortable";

function Board() {
  const [boards, setBoards] = useState([]);

  const fetchBoards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/boards");
      setBoards(response.data);
      console.log("Gelen veri:", response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };


  useEffect(() => {
    fetchBoards();
  }, []);
  return (
    <div className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border">
        <Column boards={boards} setBoards={setBoards} />
    </div>
  );
}

export default Board;
