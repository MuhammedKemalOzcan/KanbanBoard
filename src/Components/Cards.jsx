import React from "react";

function Cards({ id, title, desc }) {
  return (
    <div
      style={{
        maxHeight: "200px", // Kartın yüksekliğini sınırlıyoruz
        overflowY: "auto", // Dikey scroll
        overflowX: "hidden", // Yatay taşmayı engelle
        wordWrap: "break-word", // Uzun kelimeleri satıra sığdır
        whiteSpace: "pre-wrap", // Satır sonlarında kır
      }}
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
