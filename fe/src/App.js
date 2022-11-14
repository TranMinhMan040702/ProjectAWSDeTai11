import { useParams, Routes, Route } from "react-router-dom";
import RemoveSpecialCharacters from "./utils/RemoveSpecialCharacters";
import "./style/index.scss";
import HomePageIndex from "./component/HomePageIndex";
import { HomePage as HomePageAdmin, Area } from "./component/admin/index";
import { HomePage as HomePageUser } from "./component/user/index";

import React from "react";

function App() {
  const dict = {
    Area: { src: <Area /> },
  };
  const Element = () => {
    let params = useParams();
    params = RemoveSpecialCharacters(params.slug);
    return dict[params].src;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePageIndex />} />
        {localStorage.getItem("role") == "admin" ? (
          <>
            <Route path="/admin" element={<HomePageAdmin />} />
            <Route path="/admin/:slug" element={<Element />} />

            {/* <Route path="/admin" element={<Manager />} /> */}
          </>
        ) : (
          <>
            <Route path="/user" element={<HomePageUser />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
