import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Title = () => {
  return <h1>Title</h1>;
};

const CheckBoxes = () => {
  return <h2>CheckBoxes</h2>;
};

const Graph = () => {
  return <h2>Graph</h2>;;
};

const App = () => {
  return (
    <div>
      <Title />
      <CheckBoxes />
      <Graph />
    </div>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
