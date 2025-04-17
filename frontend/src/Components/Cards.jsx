import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

function Cards({ id, title, desc }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cards flex flex-col bg-[#00A88B] h-auto rounded-[8px] p-[8px] mb-[16px] 
                  text-white text-elipsis overflow-hidden"
      key={id}
    >
      <p>{title}</p>
      <p>{desc}</p>
    </div>
  );
}

export default Cards;
