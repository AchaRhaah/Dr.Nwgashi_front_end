import "./App.css";
import { Navbar } from "./components";
import { HomePage, RecordPage } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/records" element={<RecordPage /> } />
      
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
