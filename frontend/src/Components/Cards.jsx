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
    <div className="relative">
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
              className="border-none bg-[#00A88B] focus:outline-none text-white text-elipsis overflow-hidden"
              type="text"
              placeholder="Description"
              rows={3}
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-around gap-24 text-white">
            <button onClick={() => handleEdit(id)}>
              <p>Save</p>
            </button>
            <button onClick={() => setIsEditing(false)}>
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
            className="cards flex flex-col bg-[#00A88B] h-auto rounded-[8px] p-[8px] mb-[16px] 
                  text-white text-elipsis overflow-hidden"
            key={id}
          >
            <p>{title}</p>
            <p>{desc}</p>
          </div>
          <button
            onClick={() => handleDelete(id)}
            className="w-20 text-white absolute -bottom-8 -left-4 "
          >
            Delete
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="w-20 text-white absolute -bottom-8 right-0 "
          >
            Edit
          </button>
          
        </div>
      )}
    </div>
  );
}

export default Cards;
