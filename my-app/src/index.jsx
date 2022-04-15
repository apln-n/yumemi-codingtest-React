import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import PropTypes from "prop-types";

const root = ReactDOM.createRoot(document.getElementById("root"));
const apiKey = "p9t4mVKpr6vhGAwius3ldgTVMk9YNa1nARFDSLmr";

//都道府県一覧のリスト[{"prefCode":1,"prefName":"北海道"}, ...]
const getPrefs = () => {
  const path = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
  const request = new XMLHttpRequest();
  request.open("GET", path, false);
  request.setRequestHeader("X-API-KEY", apiKey);
  request.send(null);
  const prefs = JSON.parse(request.response);
  /*
    JSONのフォーマット:
    {"message":null,"result":[{"prefCode":1,"prefName":"北海道"},{"prefCode":2...}...]}
  */
  return prefs.result;
};

const Title = () => {
  return <h1>総人口推移グラフ</h1>;
};

//各都道府県のチェックボックス。<input>のidと<label>のforの文字列を合わせることでグループ化。
const CheckBox = (props) => {
  const pref = props.pref;
  const code = pref.prefCode;
  const name = pref.prefName;
  const [checked, setChecked] = useState(false);
  const [element, setElement] = useState(<></>);
  React.useEffect(() => {
    const interval = setInterval(()=>{
      setElement(
        <>
          <input
            type="checkbox"
            id={name + "CheckBox"}
            name={name}
            data-code={code}
            data-checked={checked}
            onChange={() => {
              setChecked(!checked);
            }}
          />
          <label htmlFor={name + "CheckBox"}>{name + " "}</label>
        </>
      );
    }, 10);
    return () => clearInterval(interval);
  });
  return element;
};
CheckBox.propTypes = {
  pref: PropTypes.object,
};

const CheckBoxes = () => {
  return (
    <div>
      <h3>都道府県</h3>
      <div>
        {getPrefs().map((pref, key) => (
          <CheckBox pref={pref} key={key} />
        ))}
      </div>
    </div>
  );
};

const Graph = () => {
  const [prefsListForGraph, setPrefs] = useState([]); //prefsListForGraph[]の中身のフォーマットはgetPrefs()の返り値と同じ
  React.useEffect(() => {
    const interval = setInterval(()=>{
      const checkBoxes = document.querySelectorAll("input[type='checkbox']");
      let prefsList = [];
      for (let i = 0; i < checkBoxes.length; i++) {
        const isChecked = checkBoxes[i].dataset.checked == "true" ? true : false; //属性なのでstring型になっている
        if (isChecked) {
          prefsList.push(checkBoxes[i].name);
          //prefsList.push({"prefCode":checkBoxes[i].dataset.code, "prefName":checkBoxes[i].name});
        }
      }
      setPrefs(prefsList);
    }, 10);
    return () => clearInterval(interval);
  });
  return (
    <div>
      <h2>Graph</h2>
      <div>{prefsListForGraph}</div>
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
