// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 840 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select('body')
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.json('https://raw.githubusercontent.com/Rellor/frontend-data/main/Barchart.json').then((json) => {
  data = json;

  update(data);
});

function update(new_data) {
  // sort data van groot naar klein
  data.sort(function(b, a) {
    return a.temperature - b.temperature;
  });

  // X axis
  var xscale = d3.scaleBand()
  .rangeRound([0, height])
  .paddingInner(0.1)
  .domain(new_data.map((d) => d.location.city));
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xscale))

  // Add Y axis
  var yscale = d3.scaleLinear()
  .range([width, 0])
  .domain([0, d3.max(new_data, (d) => d.temperature)]);
  svg.append("g")
    .call(d3.axisLeft(yscale));

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return xscale(d.location.city); })
      .attr("y", function(d) { return yscale(d.temperature); })
      .attr("width", xscale.bandwidth())
      .attr("height", function(d) { return height - yscale(d.temperature); })
      .attr("fill", "#69b3a2")

// DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
const rect = svg.append('g').selectAll('rect').data(new_data, (d) => d.location.city).join(
  // ENTER
  // new elements
  (enter) => {
    const rect_enter = enter.append('rect').attr('x', 0);
    rect_enter.append('title');
    return rect_enter;
  },
  // UPDATE
  // update existing elements
  (update) => update,
  // EXIT
  // elements that aren't associated with data
  (exit) => exit.remove()
);
}



d3.selectAll('#filter-nl-only, #filter-us-only').on('change', function() {

  const checkedus = d3.select('#filter-us-only').property('checked');
  const checkednl = d3.select('#filter-nl-only').property('checked');

  if  (checkednl === true && checkedus === true){
    const filtered_data = data.filter((d) => d.location.city === 'Alkmaar' || d.location.city === 'Purmerend');
    update(filtered_data);

  } else if (checkednl === true){
    const filtered_data = data.filter((d) => d.location.city === 'Alkmaar');
    update(filtered_data);

  } else if (checkedus === true) {
    const filtered_data = data.filter((d) => d.location.city === 'Purmerend');
    update(filtered_data);

  } else {
    update(data);
  }
});
