const margin = {top: 40, bottom: 10, left: 120, right: 20};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element
const svg = d3.select('body').append('svg')
.attr('width', width+margin.left+margin.right)
.attr('height', height+margin.top+margin.bottom);

// Group used to enforce margin
const g = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);

// Global variable for all data
let data;
// Scales setup
const xscale = d3.scaleLinear().range([0, width]);
//.scaleband() is om de bars te maken. De rangeround is voor de breedte en de padding is de plek tussen de bars
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);
//.scalelinear() is hoe hoog de bars gaan worden. .range is hoever het gaat waar 0 het begin is en height het einde

// Axis setup
const xaxis = d3.axisTop().scale(xscale);
const g_xaxis = g.append('g').attr('class','x axis');
const yaxis = d3.axisLeft().scale(yscale);
const g_yaxis = g.append('g').attr('class','y axis');

/////////////////////////

d3.json('https://raw.githubusercontent.com/Rellor/frontend-data/main/Barchart.json').then((json) => {
  data = json;

  update(data);
});

function update(new_data) {
  //update the scales
  xscale.domain([0, d3.max(new_data, (d) => d.temperature)]);
  yscale.domain(new_data.map((d) => d.location.city));
  //render the axis
  g_xaxis.transition().call(xaxis);
  g_yaxis.transition().call(yaxis);


  // Render the chart with new data

  // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
  const rect = g.selectAll('rect').data(new_data, (d) => d.location.city).join(
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

  // ENTER + UPDATE
  // both old and new elements
  rect.transition()
    .attr('height', yscale.bandwidth())
    .attr('width', (d) => xscale(d.temperature))
    .attr('y', (d) => yscale(d.location.city));

  rect.select('title').text((d) => d.location.city);
}

//interactivity
d3.selectAll('#filter-nl-only, #filter-us-only').on('change', function() {
//selecteer de id's filter-nl-only en filter-us-only en wanneer deze id's veranderen voer een functie uit
  const checkedus = d3.select('#filter-us-only').property('checked');
  const checkednl = d3.select('#filter-nl-only').property('checked');
//const die aangeeft dat de id's zijn aangeklikt
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
