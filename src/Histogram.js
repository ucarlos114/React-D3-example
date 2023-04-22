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
function Histogram(props) {
  let data = Object.values(props.data);
  let histRef = useRef(null);

  useEffect(() => {
    // remove the old ScatterPlot
    let oldSVG = d3.select("#histDiv svg");
    if (!oldSVG.empty()) {
      oldSVG.remove();
    }

    // get height and width information from the parent container
    let parent = d3.select("#histDiv").node().getBoundingClientRect();

    // set the dimensions of the SVG element
    const width = 0.9 * parent.width;
    const height = 0.9 * parent.height;
    const margin = {
      top: 0.025 * parent.height,
      right: 0.025 * parent.width,
      bottom: 0.025 * parent.height,
      left: 0.025 * parent.width,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // create new SVG element and append to pieBar
    const svg = d3
      .select("#histDiv")
      .append("svg")
      .attr("width", innerWidth)
      .attr("height", height);

    // create the x-axis
    const xScale = d3
      .scaleBand()
      .domain(["Red", "Blue", "Green"])
      .range([0, innerWidth])
      .padding(0.1);

    // create the y-axis
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([innerHeight, 0]);

    // draw the rectangles
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(["Red", "Blue", "Green"][i]))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d))
      .attr("fill", (d, i) => ["maroon", "#5ADEFF", "green"][i])
      .style("stroke", "black")
      .style("stroke-width", 3)
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const dataNum = event.target.__data__;

        // Create a new element for the popup message
        const popup = d3
          .select("#histDiv")
          .append("div")
          .attr("class", "popup")
          .text(`${popupMessage(dataNum)}`);

        // offset from mouse
        popup.style("left", x + 10 + "px").style("top", y - 10 + "px");

        // update popup position on mousemove
        svg.on("mousemove", function (event) {
          const [x, y] = d3.pointer(event, window);
          popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
        });
      })
      .on("mouseout", function () {
        // remove tooltip on mouseout
        d3.select(".popup").remove();
      });
  });

  return (
    <div ref={histRef} className="gridElement" id="histDiv">
      <h4 className="titleElement">Histogram</h4>
      {/* Scatter plot will be rendered here */}
    </div>
  );
}

export default Histogram;
