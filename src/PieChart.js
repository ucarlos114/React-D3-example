// Carlos Urbina 4/17/23

import * as d3 from "d3"; // we will need d3.js
import React, { useRef, useEffect } from "react";

/**
 * Return a formated popup string based on the avg data number.
 */
function popupMessage(avg) {
  if (avg === 20) {
    let res = "JavaScript"; // avoid weird warning
    return res + ": 20";
  }
  if (avg === 68) {
    return "Python: 68";
  }
  return "Java: 43";
}

/**
 * Load the initial scatter plot
 */
function PieChart(props) {
  let data = Object.values(props.data);
  let pieRef = useRef(null);

  useEffect(() => {
    // remove the old ScatterPlot
    let oldSVG = d3.select("#pieDiv svg");
    if (!oldSVG.empty()) {
      oldSVG.remove();
    }

    // get height and width information from the parent container
    let parent = d3.select("#pieDiv").node().getBoundingClientRect();

    // set the dimensions of the SVG element
    const width = parent.width;
    const height = parent.height;
    const margin = {
      top: 0.05 * parent.height,
      right: 0.025 * parent.width,
      bottom: 0.1 * parent.height,
      left: 0.025 * parent.width,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2 - 1.5; // account for the stroke width on either side

    // create new SVG element and append to pieBar
    const svg = d3
      .select("#pieDiv")
      .append("svg")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    // add pie chart as child of SVG element
    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${innerWidth / 2.0}, ${innerHeight / 2.0})`
      );

    // function that will create pie chart from data
    const pieChart = d3
      .pie()
      .value((d) => d)
      .padAngle(0.1); // space between slices

    // arc generator for individual slices
    const arc = d3
      .arc()
      .innerRadius(radius / 3)
      .outerRadius(radius);
    // console.log(`inner radius: ${radius / 3}, outer radius: ${radius}`);

    // generate slices from data and append to pie chart
    const arcs = g
      .selectAll("arc")
      .data(pieChart(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // draw arc paths (actually draw arcs with colors)
    const colors = ["maroon", "#5ADEFF", "green"];
    arcs
      .append("path")
      .attr("fill", (d, i) => colors[i])
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .attr("d", arc)
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const dataNum = event.target.__data__.data;

        // Create a new element for the popup message
        const popup = d3
          .select("#pieDiv")
          .append("div")
          .attr("class", "popup")
          .text(`${popupMessage(dataNum)}`);

        // offset from mouse
        popup.style("left", x + 10 + "px").style("top", y - 10 + "px");

        // update popup position on mousemove
        arcs.on("mousemove", function (event) {
          const [x, y] = d3.pointer(event, window);
          popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
        });
      })
      .on("mouseout", function () {
        // remove tooltip on mouseout
        d3.select(".popup").remove();
        arcs.on("mousemove", null);
      });
  });

  return (
    <div ref={pieRef} className="gridElement" id="pieDiv">
      <h4 className="titleElement">Pie Chart</h4>
      {/* Scatter plot will be rendered here */}
    </div>
  );
}

export default PieChart;
