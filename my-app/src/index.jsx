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
    const interval = setInterval(() => {
      setElement(
        <>
          <input
            type="checkbox"
            id={name + "CheckBox"}
            name={name}
            data-code={code}
            data-checked={checked}
            data-pop={null}
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

//人口構成のリスト(props.prefsList[]に含まれる都道府県の物に限る)
const getPops = (pref) => {
  const path =
    "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=" +
    pref.prefCode;
  const request = new XMLHttpRequest();
  request.open("GET", path, false);
  request.setRequestHeader("X-API-KEY", apiKey);
  request.send(null);
  const response = JSON.parse(request.response);
  //{"prefCode", "prefName", "data(その都道府県の人口構成)"}のデータを追加で保存
  /*
    JSONのフォーマット:
    {"message":null, "result":{"boundaryYear":2015, "data":[{"label":"総人口", "data":[{"year":1980, "value":12817}, {"year":1985, "value": 12707},{...}],[...],[...]}}
    pops内の"data"は辞書のリスト[{"year", "value"}]
  */
  //console.log(response.result.data[0].data);
  const pop = {
      "prefCode": pref.prefCode,
      "prefName": pref.prefName,
      "data": response.result.data[0].data,
  };
  return pop;
};

//チェックされている都道府県の一覧を取得
const getCheckedPrefsList = () => {
  let currentPrefsList = [];
  const checkBoxes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkBoxes.length; i++) {
    const isChecked =
      checkBoxes[i].dataset.checked == "true" ? true : false; //属性なのでstring型になっている
    if (isChecked) {
      currentPrefsList.push({"prefCode":checkBoxes[i].dataset.code, "prefName":checkBoxes[i].name});
    }
  }
  return currentPrefsList;
}

const Graph = () => {
  //prefsListをCodeListとNameListに分ける。(Object同士で都道府県を比較だとかならずfalseになるため。)
  const [prefsCodeList, setPrefsCodeList] = useState([]);
  const [prefsNameList, setPrefsNameList] = useState([]);
  // [pop, setPop] = useState([]);
  const [element, setElement] = useState(<></>);
  React.useEffect(() => {
    const interval = setInterval(() => {
      //チェックされている都道府県の一覧を取得
      const currentPrefsList = getCheckedPrefsList();
      //console.log(currentPrefsList);
      /*
        追加処理。
        チェックリストに変化があった時のみAPIを呼び出す。(不必要にAPIを呼び出さない)
        今回の都道府県のリスト(currentPrefsList)にその都道府県(currentPrefsList[i])が含まれているが、これまでの都道府県のリスト(prefsList)には含まれていない場合。
        これまでの都道府県のリストに都道府県を追加し、これまでの都道府県の人口構成のリスト(pops)に都道府県を追加。
      */
      for (let i = 0; i < currentPrefsList.length; i++) {
        const pref = currentPrefsList[i];
        const afterPrefsCodeList = Array.from(new Set([...prefsCodeList, pref.prefCode]));
        if(prefsCodeList.length !== afterPrefsCodeList.length){
          //これまでの都道府県のリストに含まれていないため、その都道府県をこれまでのリストに(prefCodeとprefNameを分けて)追加。
          setPrefsCodeList(afterPrefsCodeList);
          const afterPrefsNameList = [...prefsNameList, pref.prefName];
          setPrefsNameList(afterPrefsNameList);
          console.log(afterPrefsNameList);
          break;
        }
      }
      /*
        削除処理。
        これまでの都道府県のリスト(prefsList)にその都道府県(prefsList[i])が含まれているが、今回の都道府県のリスト(currentPrefsList)には含まれていない場合。
        これまでの都道府県のリストから都道府県を削除し、これまでの都道府県の人口構成のリスト(pops)からその都道府県を削除。
      */
      //おそらくspliceを使う
    }, 10);
    return () => clearInterval(interval);
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      //以下でpopの中身を使ってグラフを作る
      setElement(
        <div>
          {
          //map
            "123456"
          }
        </div>
      );
    }, 10);
    return () => clearInterval(interval);
  });

  //elementは実際の人口構成グラフを表示する部分
  return (
    <div>
      <h2>Graph</h2>
      {element}
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
