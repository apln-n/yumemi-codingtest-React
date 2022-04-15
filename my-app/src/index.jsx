import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
const apiKey = "p9t4mVKpr6vhGAwius3ldgTVMk9YNa1nARFDSLmr";

//都道府県一覧のリスト
const getPrefsList = () => {
  const path = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
  const request = new XMLHttpRequest();
  request.open('GET',path,false)
  request.setRequestHeader("X-API-KEY", apiKey);
  request.send(null);
  const prefs = JSON.parse(request.response);
  /*
    JSONのフォーマット:
    {"message":null,"result":[{"prefCode":1,"prefName":"北海道"},{"prefCode":2...}...]}
  */
  let prefsList = [];
  for(let i=0;i<prefs.result.length;i++){
    prefsList.push(prefs.result[i].prefName);
  }
  return prefsList;
}

const Title = () => {
  return <h1>Title</h1>;
};

const CheckBoxes = () => {
  return (
    <div>
      <h2>CheckBoxes</h2>
      <div>{getPrefsList()}</div>
    </div>
  );
};

const Graph = () => {
  return (
    <div>
      <h2>Graph</h2>
      <div></div>
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
