import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";
import DroppableBoard from "./DroppableBoard";

function Column({ boards, setBoards, cards }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [descError, setDescError] = useState("");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      console.warn("Hedef konum bulunamadı");
      return;
    }

    // 1. Optimistic update için boards state'ini kopyala
    const updatedBoards = boards.map((board) => ({
      ...board,
      cards: [...board.cards], // Derin kopya
    }));

    // 2. Taşınan kartı ve kaynak board'ı bul
    let sourceBoard, sourceCardIndex, cardToMove;
    for (const board of updatedBoards) {
      const foundIndex = board.cards.findIndex((card) => card.id === active.id);
      if (foundIndex !== -1) {
        sourceBoard = board;
        sourceCardIndex = foundIndex;
        cardToMove = { ...board.cards[foundIndex] }; // Kartın kopyasını al
        break;
      }
    }

    if (!sourceBoard || sourceCardIndex === undefined || !cardToMove) {
      console.error(`Kaynak kart bulunamadı: ${active.id}`);
      return;
    }

    // 3. Hedef konumu belirle
    let targetBoardId, newPosition;

    if (over.data.current?.type === "card") {
      // Kartın üzerine bırakıldı
      for (const board of updatedBoards) {
        const overCardIndex = board.cards.findIndex(
          (card) => card.id === over.id
        );
        if (overCardIndex !== -1) {
          sourceBoard.cards.splice(sourceCardIndex, 1);
          newPosition =
            overCardIndex +
            (sourceBoard.id === board.id && sourceCardIndex < overCardIndex
              ? 0
              : 1);
          board.cards.splice(newPosition, 0, cardToMove);
          targetBoardId = board.id;
          break;
        }
      }
    } else {
      // Board'a bırakıldı
      const targetBoard = updatedBoards.find((board) => board.id === over.id);
      if (targetBoard) {
        sourceBoard.cards.splice(sourceCardIndex, 1);
        newPosition = targetBoard.cards.length;
        targetBoard.cards.push(cardToMove);
        targetBoardId = targetBoard.id;
      }
    }

    if (targetBoardId === undefined || newPosition === undefined) return;

    // 4. Optimistic update (UI'ı anında güncelle)
    setBoards(updatedBoards);

    // 5. Backend'e güncelleme gönder
    try {
      const response = await axios.patch(
        `http://localhost:3000/cards/${active.id}`,
        {
          boardId: targetBoardId,
          position: newPosition,
        }
      );

      console.log("Backend güncellendi:", response.data);
    } catch (err) {
      console.error(
        "Backend güncelleme hatası:",
        err.response?.data || err.message
      );
    }
  };

  // const fetchBoards = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/boards");
  //     setBoards(response.data);
  //   } catch (error) {
  //     console.error("Hata:", error);
  //   }
  // };

  console.log(boards);

  const addCard = async () => {
    if (!newCardTitle.trim()) {
      setError("Başlık boş bırakılamaz! ");
      return;
    }
    if (!newCardDesc.trim()) {
      setDescError("Açıklama boş bırakılamaz! ");
      return;
    }
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
    setError("");
    setDescError("");
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleDelete = (boardId, cardId) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.filter((card) => card.id !== cardId), // Kartı sil
          };
        }
        return board;
      })
    );
  };

  const handleEdit = (boardId, cardId, newTitle, newDesc) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map((card) =>
              card.id === cardId
                ? { ...card, title: newTitle, description: newDesc }
                : card
            ),
          };
        }
        return board;
      })
    );
  };
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="board">
        {boards.lists?.map((board) => (
          <DroppableBoard key={board.id} id={board.id} board={board}>
            <div className="bg-[#262626] flex flex-col p-4 pb-2 border-[#262626] border rounded-[16px] gap-[16px] min-h-[224px]">
              <h1>{board.name}</h1>
              <SortableContext
                items={board.cards.map((card) => card.id)}
                strategy={verticalListSortingStrategy}
              >
                {board.cards.map((card) => (
                  <Cards
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    desc={card.description}
                    onDelete={() => handleDelete(board.id, card.id)}
                    onUpdate={(newTitle, newDesc) =>
                      handleEdit(board.id, card.id, newTitle, newDesc)
                    }
                  />
                ))}
              </SortableContext>
              {/* Kart Ekleme */}
              {console.log(board.name)}
              {board.name === "Backlog" && (
                <div className="flex flex-col">
                  {/* Form */}
                  {isVisible === true && (
                    <div className="flex flex-col gap-[12px]">
                      <div className="form flex flex-col justify-center h-auto border-[#00A88B] ">
                        {error && (
                          <div className="text-red-500 text-sm mt-2">
                            {error}
                          </div>
                        )}
                        <input
                          className="bg-[#00A88B] border-none rounded-[20px] focus:outline-none text-white text-elipsis overflow-hidden"
                          type="text"
                          placeholder="Title"
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                        />
                        {descError && (
                          <div className="text-red-500 text-sm mt-2">
                            {descError}
                          </div>
                        )}
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
                        className="button flex justify-center border border-[#00A88B] rounded-[10px] bg-[#00A88B] p-0.5 text-white"
                      >
                        <p>Submit</p>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {board.title === "Backlog" && (
              <button
                className={`items-end border border-[#00A88B] rounded-[16px] bg-[#00A88B] p-1 text-white ${
                  isVisible ? "hidden" : "w-full"
                }`}
                onClick={handleClick}
              >
                {isVisible ? "Submit" : "Add New Card"}
              </button>
            )}
          </DroppableBoard>
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="bg-[#00A88B] text-white rounded-[8px] p-[8px] mb-[16px] shadow-lg">
            {cards.find((card) => card.id === activeId)?.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Column;
