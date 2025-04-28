import { useDroppable } from "@dnd-kit/core";

function DroppableBoard({ board, children }) {
  const { setNodeRef } = useDroppable({
    id: board.id,
    data: {
      type: 'board' // Board tipini belirt
    }
  });

  return (
    <div ref={setNodeRef} className="list w-[22%] h-auto flex flex-col box-border gap-4">
      {children}
    </div>
  );
}

export default DroppableBoard;
