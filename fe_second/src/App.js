import { Routes, Route } from "react-router-dom";
import "./style/index.scss";
import HomePageIndex from "./component/HomePageIndex";
import { HomePage as HomePageTable, DetailPage } from "./component/table";

import React from "react";

function App() {
  return (
    <div className="App">
      <Routes>
        {localStorage.getItem("username") && (
          <>
            <Route path="/table" element={<HomePageTable />} />
            <Route path="/table/:slug" element={<DetailPage />} />

            <Route path="*" element={<HomePageTable />} />
          </>
        )}
        <Route path="*" element={<HomePageIndex />} />
      </Routes>
    </div>
  );
}

export default App;
