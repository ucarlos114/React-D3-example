// Carlos Urbina 4/17/23

import * as d3 from "d3"; // we will need d3.js
import React, { useRef, useEffect } from "react";

/**
 * Load the initial scatter plot
 */
function ScatterPlot({ data, selectedRows }) {
  let scatterRef = useRef(null);
  let selectedDots = [];

  function populateSelectedDots(item, index) {
    let dataIndex = selectedRows[index] - 1;
    let dataRow = data[dataIndex];
    selectedDots.push(dataRow);
  }
  // add each selected row to selectedDots array
  selectedRows.forEach(populateSelectedDots);

  useEffect(() => {
    // remove the old ScatterPlot
    let oldSVG = d3.select("#scatterDiv svg");
    if (!oldSVG.empty()) {
      oldSVG.remove();
    }

    // get height and width information from the parent container
    let parent = d3.select("#scatterDiv").node().getBoundingClientRect();

    // calculate new child dimensions
    const margin = {
      top: 0.025 * parent.height,
      right: 0.1 * parent.width,
      bottom: 0.075 * parent.height,
      left: 0.1 * parent.width,
    };
    const width = 0.9 * parent.width;
    const height = 0.7 * parent.height;

    // create new SVG element
    const svg = d3
      .select("#scatterDiv")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // set the ranges
    const x = d3.scaleTime().range([0, width]); // based on time variable
    const y = d3.scaleLinear().range([height, 0]); // based on search variables

    // Scale the range of the data
    x.domain(
      d3.extent(data, function (d) {
        return d.Week;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return Math.max(d.javascript, d.python, d.java);
      }),
    ]);

    //////////////// define the 3 lines ////////////////
    const redLine = d3
      .line()
      .x(function (d) {
        return x(d.Week);
      })
      .y(function (d) {
        return y(d.javascript);
      });

    const blueLine = d3
      .line()
      .x(function (d) {
        return x(d.Week);
      })
      .y(function (d) {
        return y(d.python);
      });

    const greenLine = d3
      .line()
      .x(function (d) {
        return x(d.Week);
      })
      .y(function (d) {
        return y(d.java);
      });
    //////////////// end define the 3 lines ////////////////

    //////////////// add the 3 value line paths ////////////////
    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "maroon")
      .attr("fill", "darkgray")
      .attr("d", redLine)
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup")
          .text(`JavaScript`);

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

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "green")
      .attr("fill", "darkgray")
      .attr("d", greenLine)
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup")
          .text(`Java`);

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

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "#5ADEFF")
      .attr("fill", "darkgray")
      .attr("d", blueLine)
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup")
          .text(`Python`);

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

    //////////////// end add the 3 value line paths ////////////////

    //////////////// add scatter plots ////////////////
    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 1.5)
      .attr("stroke", "#CB2828")
      .attr("fill", "#CB2828")
      .attr("cx", function (d) {
        return x(d.Week);
      })
      .attr("cy", function (d) {
        return y(d.javascript);
      })
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const oldDate = event.target.__data__.Week;

        // nicer format
        const date = new Date(oldDate).toISOString().substring(0, 10);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup");

        document.getElementsByClassName(
          "popup"
        )[0].innerHTML = `JavaScript<br>${event.target.__data__.javascript}<br>${date}`;

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

    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 1.5)
      .attr("stroke", "#00B42C")
      .attr("fill", "#00B42C")
      .attr("cx", function (d) {
        return x(d.Week);
      })
      .attr("cy", function (d) {
        return y(d.java);
      })
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const oldDate = event.target.__data__.Week;

        // nicer format
        const date = new Date(oldDate).toISOString().substring(0, 10);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup");

        document.getElementsByClassName(
          "popup"
        )[0].innerHTML = `Java<br>${event.target.__data__.java}<br>${date}`;

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

    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 1.5)
      .attr("stroke", "#00AEE5")
      .attr("fill", "#00AEE5")
      .attr("cx", function (d) {
        return x(d.Week);
      })
      .attr("cy", function (d) {
        return y(d.python);
      })
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const oldDate = event.target.__data__.Week;

        // nicer format
        const date = new Date(oldDate).toISOString().substring(0, 10);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup");

        document.getElementsByClassName(
          "popup"
        )[0].innerHTML = `Python<br>${event.target.__data__.python}<br>${date}`;

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

    //////////////// end add scatter plots ////////////////

    //////////////// highlight selected dots ////////////////
    svg
      .selectAll("dot")
      .data(selectedDots)
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("stroke", "yellow")
      .attr("fill", "black")
      .attr("cx", function (d) {
        return x(d.Week);
      })
      .attr("cy", function (d) {
        return y(d.javascript);
      })
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const oldDate = event.target.__data__.Week;

        // nicer format
        const date = new Date(oldDate).toISOString().substring(0, 10);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup");

        document.getElementsByClassName(
          "popup"
        )[0].innerHTML = `JavaScript<br>${event.target.__data__.javascript}<br>${date}`;

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

    svg
      .selectAll("dot")
      .data(selectedDots)
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("stroke", "yellow")
      .attr("fill", "black")
      .attr("cx", function (d) {
        return x(d.Week);
      })
      .attr("cy", function (d) {
        return y(d.java);
      })
      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const oldDate = event.target.__data__.Week;

        // nicer format
        const date = new Date(oldDate).toISOString().substring(0, 10);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup");

        document.getElementsByClassName(
          "popup"
        )[0].innerHTML = `Java<br>${event.target.__data__.java}<br>${date}`;

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

    svg
      .selectAll("dot")
      .data(selectedDots)
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("stroke", "yellow")
      .attr("fill", "black")
      .attr("cx", function (d) {
        return x(d.Week);
      })
      .attr("cy", function (d) {
        return y(d.python);
      })

      .on("mouseover", function (event, d) {
        // Get the position of the mouse cursor
        const [x, y] = d3.pointer(event, window);
        const oldDate = event.target.__data__.Week;

        // nicer format
        const date = new Date(oldDate).toISOString().substring(0, 10);

        // Create a new element for the popup message
        const popup = d3
          .select("#scatterDiv")
          .append("div")
          .attr("class", "popup");

        document.getElementsByClassName(
          "popup"
        )[0].innerHTML = `Python<br>${event.target.__data__.python}<br>${date}`;

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
    //////////////// end highlight selected dots ////////////////

    //////////////// add the axes ////////////////
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the Y axis gridlines
    const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(10);
    svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);

    svg.append("g").call(d3.axisLeft(y));
  });

  return (
    <div ref={scatterRef} id="scatterDiv">
      <h3>Scatter Plot</h3>
      {/* Scatter plot will be rendered here */}
    </div>
  );
}

export default ScatterPlot;
