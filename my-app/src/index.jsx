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
  return <h1>総人口推移グラフ</h1>;
};

//各都道府県のチェックボックス。<input>のidと<label>のforの文字列を合わせることでグループ化。
const CheckBox = (props) => {
  const pref = props.pref;
  return (
    <div>
      <input type="checkbox" id={pref+"CheckBox"} name={pref} />
      <label for={pref+"CheckBox"}>{pref}</label>
    </div>
  );
}

const CheckBoxes = () => {
  return (
    <div>
      <h3>都道府県</h3>
      <div>{getPrefsList().map((pref,key) => <CheckBox pref={pref} key={key} />)}</div>
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
