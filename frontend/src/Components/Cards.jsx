import React, { useState } from "react";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Cards({ id, title, desc, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDesc, setEditedDesc] = useState(desc);

  // DnD Kit için gerekli hook
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
      data: {
        type: "card", // Kart tipini belirt
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(`http://localhost:3000/cards/${cardId}`);
      onDelete();
    } catch (error) {
      console.error("Kart silinirken hata oluştu:", error);
    }
  };

  const handleEdit = async (cardId) => {
    try {
      await axios.patch(`http://localhost:3000/cards/${cardId}`, {
        title: editedTitle,
        description: editedDesc,
      });
      onUpdate(editedTitle, editedDesc);
      setIsEditing(false);
    } catch (error) {
      console.error("Kart güncellenirken hata oluştu:", error);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isEditing ? (
        <div className="flex flex-col gap-[12px] text-white ">
          <input
            className="bg-[#00A88B] border-none rounded-[20px] focus:outline-none text-white p-3"
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="bg-[#00A88B] border-none rounded-[20px] focus:outline-none text-white p-3"
            rows={3}
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="border border-yellow-500 rounded-[8px] bg-yellow-500 p-1 "
              onClick={() => handleEdit(id)}
            >
              Save
            </button>
            <button
              className="border border-red-500 rounded-[8px] bg-red-500 p-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="cards bg-[#00A88B] text-white rounded-[8px] flex flex-col gap-2 p-[8px] mb-[16px]
         text-balance overflow-y-auto break-words cursor-grab active:cursor-grabbing">
          <h2>{title}</h2>
          <h3>{desc}</h3>
          <div className="flex gap-1">
            <button onClick={() => setIsEditing(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
            <button onClick={() => handleDelete(id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
