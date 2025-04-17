import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Components/Board";
import axios from "axios";

function App() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:3000/boards');
        setBoards(response.data);
        console.log('Gelen veri:', response.data);
      } catch (error) {
        console.error('Hata:', error);
      }
    };
  
    fetchBoards();
  }, []);


  return (
    <div className="flex flex-col gap-4">
      <Board />
    </div>
  );
}

export default App;
