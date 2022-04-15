import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
const apiKey = "p9t4mVKpr6vhGAwius3ldgTVMk9YNa1nARFDSLmr";

const getPrefsDict = () => {
  const path = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
  const request = new XMLHttpRequest();
  request.open('GET',path,false)
  request.setRequestHeader("X-API-KEY", apiKey);
  request.send(null);
  const prefs = request.response;
  //const prefs = JSON.parse(request.response);
  return prefs;
}

const Title = () => {
  return <h1>Title</h1>;
};

const CheckBoxes = () => {
  return <h2>CheckBoxes</h2>;
};

const Graph = () => {
  return (
    <div>
      <h2>Graph</h2>
      <div>{getPrefsDict()}</div>
    </div>
  );
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
