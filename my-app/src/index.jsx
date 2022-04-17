import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import PropTypes from "prop-types";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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
  //camelCaseで記述
  const style = {
    color: "black",
    backgroundColor: "#C4C4C4",
    textAlign: "center",
  };
  return <h2 style={style}>総人口推移グラフ</h2>;
};

//各都道府県のチェックボックス。<input>のidと<label>のforの文字列を合わせることでグループ化。
const CheckBox = (props) => {
  const pref = props.pref;
  const code = pref.prefCode;
  const name = pref.prefName;
  const [checked, setChecked] = useState(false);
  const [element, setElement] = useState(<></>);
  React.useEffect(() => {
    const liStyle = {
      display: "inline-block",
      width: "90px",
    };
    setElement(
      <li style={liStyle} align={"left"}>
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
      </li>
    );
  }, [checked]);
  return element;
};
CheckBox.propTypes = {
  pref: PropTypes.object,
};

const CheckBoxes = () => {
  return (
    <div>
      <div style={{ fontWeight: "bold", paddingLeft: "20px" }}>都道府県</div>
      <div style={{ padding: "10px" }} align={"center"}>
        {getPrefs().map((pref, key) => (
          <CheckBox pref={pref} key={key} />
        ))}
      </div>
    </div>
  );
};

//人口構成のリスト(props.prefsList[]に含まれる都道府県の物に限る)
const getPop = (pref) => {
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
  const pop = {
    prefCode: pref.prefCode,
    prefName: pref.prefName,
    data: response.result.data[0].data,
  };
  return pop;
};

//チェックされている都道府県の一覧を取得
const getCheckedPrefsList = () => {
  let currentPrefsList = [];
  const checkBoxes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkBoxes.length; i++) {
    const isChecked = checkBoxes[i].dataset.checked == "true" ? true : false; //属性なのでstring型になっている
    if (isChecked) {
      currentPrefsList.push({
        prefCode: checkBoxes[i].dataset.code,
        prefName: checkBoxes[i].name,
      });
    }
  }
  return currentPrefsList;
};

const MyHighChartsGraph = (props) => {
  const pops = props.pops;
  //今年までのデータのみを表示する
  const maxYear = Number(new Date().getFullYear());
  let series = [];
  for (let i = 0; i < pops.length; i++) {
    let data = [];
    for (let j = 0; j < pops[i].data.length; j++) {
      const dataPerFiveYear = pops[i].data[j];
      if (dataPerFiveYear.year <= maxYear) {
        //実際の人口(数値)だけデータとしてリストに追加(『年』はxAxisで設定)
        data.push(dataPerFiveYear.value);
      } else {
        break;
      }
    }
    series.push({ name: pops[i].prefName, data: data });
  }
  //人口構成データが存在する場合、x軸のデータに対する名前(値)を設定
  let xCategories = [];
  if (pops.length > 0) {
    for (let i = 0; i < pops[0].data.length; i++) {
      if (pops[0].data[i].year <= maxYear) {
        xCategories.push(String(pops[0].data[i].year));
      } else {
        break;
      }
    }
  }
  const options = {
    title: {
      text: "",
    },
    series: series,
    xAxis: {
      title: {
        text: "年度",
        align: "high",
        style: {
          fontSize: "14px",
        },
      },
      categories: xCategories,
    },
    yAxis: {
      title: {
        text: "人口数",
        align: "high",
        style: {
          fontSize: "14px",
        },
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
MyHighChartsGraph.propTypes = {
  pops: PropTypes.array,
};

const Population = () => {
  //prefsListをCodeListとNameListに分ける。(Object同士で都道府県を比較だとかならずfalseになるため。)
  const [prefsCodeList, setPrefsCodeList] = useState([]);
  const [prefsNameList, setPrefsNameList] = useState([]);
  const [pops, setPops] = useState([]);
  const [element, setElement] = useState(<></>);
  //都道府県コードおよび都道府県の追加/削除、都道府県のチェックの有無に応じた人口構成の追加/削除用。
  React.useEffect(() => {
    const interval = setInterval(() => {
      //チェックされている都道府県の一覧を取得
      const currentPrefsList = getCheckedPrefsList();
      /*
        追加処理。
        チェックリストに変化があった時のみAPIを呼び出す。(不必要にAPIを呼び出さない)
        今回の都道府県のリスト(currentPrefsList)にその都道府県(currentPrefsList[i])が含まれているが、これまでの都道府県のリスト(2つのprefsList)には含まれていない場合。
        これまでの都道府県のリストに都道府県を追加し、これまでの都道府県の人口構成のリスト(pops)に都道府県を追加。
      */
      for (let i = 0; i < currentPrefsList.length; i++) {
        const pref = currentPrefsList[i];
        const afterPrefsCodeList = Array.from(
          new Set([...prefsCodeList, pref.prefCode])
        );
        if (prefsCodeList.length !== afterPrefsCodeList.length) {
          //これまでの都道府県のリストに含まれていないため、その都道府県をこれまでのリストに(prefCodeとprefNameを分けて)追加。
          setPrefsCodeList(afterPrefsCodeList);
          const afterPrefsNameList = [...prefsNameList, pref.prefName];
          setPrefsNameList(afterPrefsNameList);
          //その都道府県の人口構成を取得
          const pop = getPop({
            prefCode: pref.prefCode,
            prefName: pref.prefName,
          });
          const afterPops = [...pops, pop];
          setPops(afterPops);
        }
      }
      /*
        削除処理。
        これまでの都道府県のリスト(2つのprefsList)にその都道府県(prefsCodeList[i]など)が含まれているが、今回の都道府県のリスト(currentPrefsList)には含まれていない場合。
        これまでの都道府県のリストから都道府県を削除し、これまでの都道府県の人口構成のリスト(pops)からその都道府県を削除。
      */
      for (let i = 0; i < prefsCodeList.length; i++) {
        //削除される可能性のある都道府県の候補
        const prefCode = prefsCodeList[i];
        //都道府県を削除するかの判定に用いる
        let flag = true;
        for (let j = 0; j < currentPrefsList.length; j++) {
          if (currentPrefsList[j].prefCode === prefCode) {
            flag = false;
            break;
          }
        }
        if (flag) {
          //これまでの都道府県のリスト(prefsCodeList, prefsNameList)から削除。
          const afterPrefsCodeList = prefsCodeList.filter(
            (code) => code !== prefCode
          );
          setPrefsCodeList(afterPrefsCodeList);
          //prefCode、prefName、popsのindex(i)は対応している
          const prefName = prefsNameList[i];
          const afterPrefsNameList = prefsNameList.filter(
            (name) => name !== prefName
          );
          setPrefsNameList(afterPrefsNameList);
          const afterPops = pops.filter((pop) => pop !== pops[i]);
          setPops(afterPops);
        }
      }
    }, 10);
    return () => clearInterval(interval);
  });

  //以下でpopsの中身を使ってグラフを作る
  React.useEffect(() => {
    setElement(
      <div>
        <MyHighChartsGraph pops={pops} />
      </div>
    );
  }, [pops]);

  //elementは実際の人口構成グラフを表示する部分
  return element;
};

const App = () => {
  return (
    <div>
      <Title />
      <CheckBoxes />
      <br />
      <Population />
    </div>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
