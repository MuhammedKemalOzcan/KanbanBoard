import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import Cards from "./Cards";
import axios from "axios";
import DroppableBoard from "./DroppableBoard";

function Column({ boards, setBoards }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [descError, setDescError] = useState("");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, //hareket başlaması için 5px sürükleme gerekli.
      },
    }),
    useSensor(TouchSensor) // dokunmatik ekranlar için.
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

    // 1. lists'i derin kopyala
    const updatedLists = boards.lists.map((list) => ({
      ...list,
      cards: list.cards.map((card) => ({ ...card })),
    }));

    // 2. Kaynak liste ve kartı bul
    let sourceList, sourceCardIndex, cardToMove;
    for (const list of updatedLists) {
      const foundIndex = list.cards.findIndex((card) => card.id === active.id);
      if (foundIndex !== -1) {
        sourceList = list;
        sourceCardIndex = foundIndex;
        cardToMove = list.cards[foundIndex];
        break;
      }
    }

    // Eğer kart kaynak listede bulunamadıysa hata ver
    if (!sourceList || sourceCardIndex === undefined || !cardToMove) {
      console.error(`Kaynak kart bulunamadı: ${active.id}`);
      return;
    }

    //3. Hedef liste ve pozisyonu bul
    let targetListId, newPosition;

    //bırakılan yer başka bir kart mı diye kontrol edilioyr.
    if (over.data.current?.type === "card") {
      for (const list of updatedLists) {
        const overCardIndex = list.cards.findIndex(
          (card) => card.id === over.id
        );
        if (overCardIndex !== -1) {
          // Kartı eski yerden çıkar
          sourceList.cards.splice(sourceCardIndex, 1);

          // Yeni pozisyon hesapla
          newPosition =
            overCardIndex +
            (sourceList.id === list.id && sourceCardIndex < overCardIndex
              ? 0
              : 1);

          //Yeni konuma kartı ekle.
          list.cards.splice(newPosition, 0, cardToMove);

          targetListId = list.id;
          break;
        }
      }
    } else {
      // Liste boşluğuna bırakıldı
      const targetList = updatedLists.find((list) => list.id === over.id);
      if (targetList) {
        sourceList.cards.splice(sourceCardIndex, 1); //kaynak listeden kartı çıkar
        newPosition = targetList.cards.length;
        targetList.cards.push(cardToMove); //kartı listenin sonuna ekle
        targetListId = targetList.id;
      }
    }

    if (targetListId === undefined || newPosition === undefined) {
      console.error("Hedef liste bulunamadı");
      return;
    }

    // 4. UI'ı güncelle
    setBoards((prevBoards) => ({
      ...prevBoards,
      lists: updatedLists,
    }));

    console.log(boards);

    // 5. Backend'e bildir
    try {
      const response = await axios.patch(
        `http://localhost:3000/cards/move/${active.id}`,
        {
          targetListId: targetListId,
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

  const addCard = async (id) => {
    if (!newCardTitle.trim()) {
      setError("Başlık boş bırakılamaz! ");
      return;
    }
    if (!newCardDesc.trim()) {
      setDescError("Açıklama boş bırakılamaz! ");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3000/cards/${id}`, {
        title: newCardTitle,
        description: newCardDesc,
      });
      const newCard = response.data;
      setBoards((prevBoards) => ({
        ...prevBoards,
        lists: prevBoards.lists.map((list) => {
          if (list.id === id) {
            // id'ye göre ekliyoruz, daha güvenli
            return {
              ...list,
              cards: [...list.cards, newCard],
            };
          }
          return list;
        }),
      }));
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

  const handleDelete = (listId, cardId) => {
    setBoards((prevBoards) => ({
      ...prevBoards,
      lists: prevBoards.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.filter((card) => card.id !== cardId),
          };
        }
        return list;
      }),
    }));
  };

  const handleEdit = (listId, cardId, newTitle, newDesc) => {
    setBoards((prevBoards) => ({
      ...prevBoards,
      lists: prevBoards.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map((card) => {
              if (card.id === cardId) {
                return { ...card, title: newTitle, description: newDesc };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
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
              {board.name === "Backlog" && (
                <div className="flex flex-col">
                  {/* Form */}
                  {isVisible === true && (
                    <div className="flex flex-col gap-[12px]">
                      <div className="form flex flex-col justify-center h-auto border-[#00A88B]">
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
                        onClick={() => addCard(board.id)}
                        className="button flex justify-center border border-[#00A88B] rounded-[10px] bg-[#00A88B] p-0.5 text-white"
                      >
                        <p>Submit</p>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {board.name === "Backlog" && (
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
            {
              boards.lists
                ?.flatMap((list) => list.cards) // Tüm kartları düzleştir
                .find((card) => card.id === activeId)?.title
            }
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Column;
