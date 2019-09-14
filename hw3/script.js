/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  bars=document.getElementById("aBarChart");
  var c= bars.children;
  var l= c.length;
  let increment = 30;
  for(let i=0; i<l;i++)
      {
      c[i].setAttribute('width',increment)
      increment+=25;
    }
}

function hovernow(){

   let rid = document.getElementById("aBarChart");
   let c= rid.children;
   let len = c.length;
   for(i=0; i< len; i++)
   {
      console.log(c[i]);
         c[i].addEventListener("mouseover", RespondMouseOver());
         function RespondMouseOver() {
                c[i].style.fill = "yellow";
              }
}
}
/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

  console.log(data);
  // Set up the scales
  // TODO: The scales below are examples, modify the ranges and domains to suit your implementation.
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 140]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 140]);
  let iScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 120]);

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  let sel = d3.select('#aBarChart');
  sel.selectAll("rect")
          .data(data)
          .join("rect")
          .attr("width",d => {return aScale(d.a);})
          .attr("height", 18);


  // TODO: Select and update the 'b' bar chart bars
  let sel_b = d3.select('#bBarChart');
  sel_b.selectAll("rect")
          .data(data)
          .join("rect")
          .attr("width",d => {return bScale(d.b);})
          .attr("height", 18);
  // TODO: Select and update the 'a' line chart path using this line generator

  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => aScale(d.a));

    line_a = d3.select('#aLineChart');
    line_a.data(data)
          .join("path")
          .attr("d", d => {return aLineGenerator(data);})
        //  .attr("transform","translate(0,100)")
          .attr("transform","scale(2,2)");



  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3.line()
                          .x((d, i) => iScale(i))
                          .y(d => aScale(d.b));

  line_b = d3.select('#bLineChart');
  line_b.data(data)
        .join("path")
        .attr("d", d => {return bLineGenerator(data);})
                              //  .attr("transform","translate(0,100)")
        .attr("transform","scale(2,2)");
  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));

    area_a = d3.select('#aAreaChart');
    area_a.data(data)
          .join("path")
          .attr("d", d => {return aAreaGenerator(data);})
          .attr("transform","translate(300,150)")
          .attr("transform","scale(1,1)");

  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.b));

    area_a = d3.select('#bAreaChart');
    area_a.data(data)
          .join("path")
          .attr("d", d => {return bAreaGenerator(data);})
          .attr("transform","translate(300,150)")
          .attr("transform","scale(1,1)");

  // TODO: Select and update the scatterplot points
    let scatterplot = d3.select('#scatterplot');
    let circles = scatterplot.selectAll("circle").data(data)
        .join("circle")
        .attr("cx", (d) => { return aScale(d.a); })
        .attr("cy", (d) => { return 300-bScale(d.b); })
        .attr("transform","translate(40,-80)")
        .attr("r", 3)
        .append("svg:title")
        .text((function(d) { return d; }));

        const plotDimensionX = 240;
        const plotDimensionY = 240
        const plot = d3.select('#scatterplot').attr('transform', `translate(30,25)`)

        plot.append('rect').attr('width', plotDimensionX).attr('height', plotDimensionY);

        const xScale = d3.scaleLinear().domain([0, 14]).range([0, plotDimensionX])
        const yScale = d3.scaleLinear().domain([0, 14]).range([plotDimensionY, 0])


        const xAxisGroup = plot.append('g').classed('x-axis', true).attr('transform', `translate(0, ${plotDimensionY})`)
        const yAxisGroup = plot.append('g').classed('y-axis', true);

        const xAxisScale = d3.axisBottom(xScale);
        const yAxisScale = d3.axisLeft(yScale);
        xAxisGroup.call(xAxisScale);
        yAxisGroup.call(yAxisScale);
  // ****** TODO: PART IV ******
  let rid = document.getElementById("aBarChart");
  let c= rid.children;
  let len = c.length;
  for(let i=0; i< len; i++)
  {
     console.log(c[i]);
        c[i].addEventListener("mouseover", function() {
               c[i].style.fill = "yellow";
             });
      c[i].addEventListener("mouseout", function(){
               c[i].style.fill ="red";
             });

}

// scatter plots hover




}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
