import HomePage from "./pages/Home";
import BoardPage from "./pages/board";
import MemoPage from "./pages/memo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/memo" element={<MemoPage />}></Route>
        <Route path="/board" element={<BoardPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
