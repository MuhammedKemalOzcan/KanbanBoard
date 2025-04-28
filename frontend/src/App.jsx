// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./Components/Board";
import CreateBoard from "./Components/CreateBoard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex flex-col gap-4">
        <Routes>
          <Route path="/" element={<CreateBoard />} />
          <Route path="/:id" element={<Board />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
