import HomePage from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoPage from "./pages/Memo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/memo" element={<MemoPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
