import { DndContext, useDroppable } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";

function DroppableBoard({ board, children }) {
  const { setNodeRef } = useDroppable({ id: board.id });

  return (
    <div ref={setNodeRef} className="list w-[250px] p-4 border rounded-md">
      {children}
    </div>
  );
}

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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id; //sürüklenen kartın id'si
    const overId = over.id; //bırakılan alanın id'si

    // Eğer board değiştiyse
    const fromBoard = boards.find(
      (board) => board.cards.some((card) => card.id === activeId) //activeId ile taşınan kartı buluyor eğer eşleşirse hangi boarddan taşıdığımızı buluyoruz.
    );
    const toBoard = boards.find((board) => board.id === overId); //eşleşen board bulunuyor

    console.log(fromBoard);
    console.log(toBoard);
    console.log(activeId);

    if (!fromBoard || !toBoard || fromBoard.id === toBoard.id) return; //aynı yerine bırakıldıysa veya herhangi bir board'a bırakılmadıysa birşey yapma

    //fromBoard(kartın çıkartıldığı board) içerisinde activeId ile aynı id'ye sahip olan yani taşınmakta olan kart bulunuyor.
    const cardToMove = fromBoard.cards.find((card) => card.id === activeId);
    if (!cardToMove) return;

    //fromBoard'dan card çıkartılıp toBoard'a ekleniyor.
    const updatedBoards = boards.map((board) => {
      if (board.id === fromBoard.id) {
        return {
          ...board,
          cards: board.cards.filter((card) => card.id !== activeId),
        };
      }
      if (board.id === toBoard.id) {
        return {
          ...board,
          cards: [...board.cards, cardToMove],
        };
      }
      return board;
    });

    setBoards(updatedBoards);

    //board set edildikten sonra boardId'si taşındığı boardId'si ile değiştirilerek taşınma işlemi tamamlanıyor.
    try {
      await axios.patch(`http://localhost:3000/cards/${activeId}`, {
        boardId: toBoard.id,
      });
    } catch (err) {
      console.error("DB güncellenemedi:", err);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border">
        {boards.map((board) => (
          <DroppableBoard className="list" key={board.id} board={board}>
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
                  className={`border border-[#00A88B] rounded-[10px] bg-[#00A88B] text-white ${
                    isVisible ? "hidden" : "w-full"
                  }`}
                  onClick={handleClick}
                >
                  {isVisible ? "Submit" : "Add New Card"}
                </button>
              </div>
            )}
          </DroppableBoard>
        ))}
      </div>
    </DndContext>
  );
}

export default Column;
