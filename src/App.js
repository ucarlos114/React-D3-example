// Carlos Urbina 4/17/23

import "./App.css";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import ScatterPlot from "./ScatterPlot";
import PieChart from "./PieChart";
import Histogram from "./Histogram";
import DataGridComponent from "./DataGrid";
import React from "react";
/**
 * Average the total number of search hits on each language across all weeks
 * in data.json. Return the averages in a dictionary.
 */
function avgHistValues(vals) {
  if (vals === undefined) {
    return null;
  }

  let javascript = 0;
  let python = 0;
  let java = 0;

  for (const obj in vals) {
    javascript += vals[obj].javascript;
    python += vals[obj].python;
    java += vals[obj].java;
  }

  // number of weeks to divide by
  const length = Object.keys(vals).length;

  return {
    javascript: Math.round(javascript / length),
    python: Math.round(python / length),
    java: Math.round(java / length),
  };
}

/**
 * Start point for the React app.
 */
function App() {
  const [data, setData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // we use useState so we can
  // re-render when window changes size
  const [, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // set event listener for window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Turn data.json into a JSON object that we'll store in state 'data'.
   */
  async function getJSONdata(print) {
    try {
      const response = await fetch("./data.json");
      const json = await response.json();
      const parseTime = d3.timeParse("%Y-%m-%d");
      const formattedData = json.map((d) => ({
        ...d,
        Week: parseTime(d.Week), // replace dates
      }));
      setData(formattedData);
      if (print) {
        console.log(formattedData); // print JSON to console
      }
    } catch (error) {
      console.error("error fetching data:", error);
    }
  }

  // upon loading page, await fetching of data
  useEffect(() => {
    getJSONdata(false);
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  // append id fields and formatted date fields to data
  const dataWithIds = data.map((item, index) => ({ ...item, id: index + 1 }));
  const dataWithNiceFormat = dataWithIds.map((item) => ({
    ...item,
    niceFormat: new Date(item.Week).toISOString().substring(0, 10),
  }));

  return (
    <div id="mainPage">
      <div id="d3">
        <ScatterPlot data={dataWithIds} selectedRows={selectedRows} />
        <div id="pieBar">
          <PieChart data={avgHistValues(data)} />
          <Histogram data={avgHistValues(data)} />
        </div>
      </div>
      <div id="datagrid">
        <DataGridComponent
          rows={dataWithNiceFormat}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </div>
  );
}

export default App;
