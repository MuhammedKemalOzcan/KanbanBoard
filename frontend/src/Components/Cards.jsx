import { useDraggable } from "@dnd-kit/core";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

function Cards({ id, title, desc, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDesc, setEditedDesc] = useState(desc);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(`http://localhost:3000/cards/${cardId}`);
      onDelete();
      console.log(`Kart ${cardId} başarıyla silindi.`);
    } catch (error) {
      console.error("Kart silinirken hata oluştu:", error);
    }
  };

  const handleEdit = async (cardId) => {
    console.log(cardId);
    try {
      await axios.patch(`http://localhost:3000/cards/${cardId}`, {
        title: editedTitle,
        description: editedDesc,
      });
      onUpdate(editedTitle, editedDesc);
      setIsEditing(false);
      console.log(`Kart ${cardId} başarıyla güncellendi.`);
    } catch (error) {
      console.error("Kart güncellenirken hata oluştu:", error);
    }
  };

  return (
    <div>
      {isEditing === true ? (
        <div className="flex flex-col gap-[24px]">
          <div className="form flex flex-col justify-center h-auto border-[#00A88B] ">
            <input
              className="bg-[#00A88B] border-none rounded-[20px] focus:outline-none text-white text-elipsis overflow-hidden"
              type="text"
              placeholder="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="border-none bg-[#00A88B] focus:outline-none text-[#FFFFFFBF] text-elipsis overflow-hidden"
              type="text"
              placeholder="Description"
              rows={3}
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-4 text-white">
            <button
              className="border border-blue-500 px-2 rounded-[10px] bg-blue-500"
              onClick={() => handleEdit(id)}
            >
              <p>Save</p>
            </button>
            <button
              className="border border-red-500 px-2 rounded-[10px] bg-red-500"
              onClick={() => setIsEditing(false)}
            >
              <p>Cancel</p>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            style={style}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="cards relative z-0 flex flex-col bg-[#00A88B] h-auto rounded-[8px] p-[8px] mb-[16px] 
                  text-white text-elipsis overflow-hidden"
            key={id}
          >
            <p>{title}</p>
            <p>{desc}</p>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={() => handleDelete(id)}
              className="w-20 text-white relative z-10 -bottom-6 left-44 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={() => setIsEditing(true)}
              className="w-20 text-white relative z-10 top-0 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
