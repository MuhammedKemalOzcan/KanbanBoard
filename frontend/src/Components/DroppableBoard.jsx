import { useDroppable } from "@dnd-kit/core";

function DroppableBoard({ board, children }) {
  const { setNodeRef } = useDroppable({
    id: board.id,
    data: {
      type: 'board' // Board tipini belirt
    }
  });

  return (
    <div ref={setNodeRef} className="list">
      {children}
    </div>
  );
}

export default DroppableBoard;
