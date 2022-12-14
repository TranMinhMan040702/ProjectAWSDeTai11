import React from "react";
import "../style/index.scss";

export default function LoadingPage(props) {
  return (
    <div
      class="spinner-box"
      style={{ backgroundColor: "#1d2630", opacity: `${props.opacity || 1}` }}
    >
      <div class="blue-orbit leo"></div>

      <div class="green-orbit leo"></div>

      <div class="red-orbit leo"></div>

      <div class="white-orbit w1 leo"></div>
      <div class="white-orbit w2 leo"></div>
      <div class="white-orbit w3 leo"></div>
    </div>
  );
}
