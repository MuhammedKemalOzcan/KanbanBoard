import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

function Cards({ id, title, desc }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(`http://localhost:3000/cards/${cardId}`);
      console.log(`Kart ${cardId} başarıyla silindi.`);
    } catch (error) {
      console.error("Kart silinirken hata oluştu:", error);
    }
  };



  return (
    <div
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cards flex flex-col bg-[#00A88B] h-auto rounded-[8px] p-[8px] mb-[16px] 
                  text-white text-elipsis overflow-hidden relative"
      key={id}
    >
      <p>{title}</p>
      <p>{desc}</p>
      {/* <button onClick={() => handleDelete(id)} className="absolute right-0">
        delete
      </button> */}
    </div>
  );
}

export default Cards;
