import React, { useEffect, useState } from "react";
import Cards from "./Cards";


function Board() {
  const [lists, setLists] = useState([
    { id: "backlog", title: "Backlog", cards: [] },
    { id: "todo", title: "To do", cards: [] },
    { id: "in-progress", title: "In Progress", cards: [] },
    { id: "designed", title: "Designed", cards: [] },
  ]);

  const [newCardTitle, setNewCardTitle] = useState([]);
  const [newCardDesc, setNewCardDesc] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const addCard = () => {
    const newCard = {
      id: Math.random().toString(36).substring(2, 9),
      title: newCardTitle,
      description: newCardDesc,
    };

    setLists((prevList) =>
      prevList.map((list) =>
        list.id === "backlog"
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    );

    setNewCardTitle(""); //başlığı temizle
    setNewCardDesc(""); //açıklamayı temizle
    setIsVisible(!isVisible); //formu kapat
  };

  useEffect(() => {
    console.log("lists", lists);
  }, [lists]);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="board w-screen h-auto flex flex-row justify-center items-center gap-[40px] box-border ">
      {lists.map((list) => (
        <div className="list" key={list.id}>
          <h1>{list.title}</h1>

          {/* Kart Ekleme */}
          {list.id === "backlog" && (
            <div className="flex flex-col gap-8">
              {/* Cardları bastırma */}
               {list.cards.map((card) => (
                <Cards key={card.id} id={card.id} title={card.title} desc={card.description} />
              ))}

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

export default Board;
