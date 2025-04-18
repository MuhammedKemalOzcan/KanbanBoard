import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Components/Board";
import axios from "axios";

function App() {



  return (
    <div className="flex flex-col gap-4">
      <Board />
    </div>
  );
}

export default App;
