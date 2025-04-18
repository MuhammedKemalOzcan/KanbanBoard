import { DndContext, useDroppable } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";

function Column({ boards, setBoards }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const addCard = async () => {
    try {
      const response = await axios.post("http://localhost:3000/cards", {
        title: newCardTitle,
        description: newCardDesc,
      });
      const newCard = response.data;
      setBoards((prevBoard) =>
        prevBoard.map((board) => {
          if (board.title === "Backlog") {
            return { ...board, cards: [...board.cards, newCard] };
          }
          return board;
        })
      );
    } catch (error) {
      console.error("hata: ", error);
    }

    setNewCardTitle(""); //başlığı temizle
    setNewCardDesc(""); //açıklamayı temizle
    setIsVisible(!isVisible); //formu kapat
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const { setNodeRef } = useDroppable({ id: boards.id });

  return (
    <div className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border">
      {boards.map((board) => (
        <div className="list" key={board.id} ref={setNodeRef}>
          <h1>{board.title}</h1>

          {/* Cardları bastırma */}
          <div>
            {board.cards.map((card) => (
              <Cards
                key={card.id}
                id={card.id}
                title={card.title}
                desc={card.description}
              />
            ))}
          </div>

          {/* Kart Ekleme */}
          {board.title === "Backlog" && (
            <div className="flex flex-col gap-8">
              {/* Form */}
              {isVisible === true && (
                <div className="flex flex-col gap-[12px]">
                  <div className="form flex flex-col justify-center h-auto border-[#00A88B] ">
                    <input
                      className="bg-[#00A88B] border-none rounded-[20px] focus:outline-none text-white text-elipsis overflow-hidden"
                      type="text"
                      placeholder="Title"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                    />
                    <textarea
                      className="border-none bg-[#00A88B] focus:outline-none text-white text-elipsis overflow-hidden"
                      type="text"
                      placeholder="Description"
                      rows={3}
                      value={newCardDesc}
                      onChange={(e) => setNewCardDesc(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={addCard}
                    className="border border-[#00A88B] rounded-[20px] p-[8px] bg-[#00A88B] text-white w-full"
                  >
                    <p>Submit</p>
                  </button>
                </div>
              )}
              <button
                className={`border border-[#00A88B] rounded-[20px] bg-[#00A88B] text-white ${
                  isVisible ? "hidden" : "w-full"
                }`}
                onClick={handleClick}
              >
                {isVisible ? "Submit" : "Add New Card"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Column;
