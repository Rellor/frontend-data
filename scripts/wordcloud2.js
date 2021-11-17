// wordcloud Bas de Roller

// begin code gehaald van https://www.d3-graph-gallery.com/graph/wordcloud_basic.html

d3.json('https://raw.githubusercontent.com/ajzbc/kanye.rest/master/quotes.json').then((json) => {
  myWords = json + '';
  const wordsSeperate = myWords.split(" ");
  const wordsRemovedI = wordsSeperate.toString().replace(/["%?!.0&123456789"]/g, ' ').toLowerCase().replaceAll(' ', '').split(',').filter(word => !!word.length)

  const counts = {};
  wordsRemovedI.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

  const toFindDuplicates2 = wordsRemovedI => wordsRemovedI.filter((item, index) => wordsRemovedI.indexOf(item) == index)
  const duplicateElementa2 = toFindDuplicates2(wordsRemovedI);

  const finalData = []

  wordsRemovedI.forEach(word => {
    if(finalData.some(el => el.word === word)) {
      finalData.find(el => {
         if(el.word === word) {
           el.amount = el.amount + 1
         }
      })
    } else {
      finalData.push({
        word: word,
        amount: 1
      })
    }

  })


  console.log(finalData)

  const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 2900 - margin.left - margin.right,
    height = 1100 - margin.top - margin.bottom;

  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

const textScale = d3.scaleLinear()
  .domain([1, 60])
  .range([1.2, 10]);

const color = d3.scaleLinear()
  .domain([1, 60])
  .range([ "black", "red"]);

const layout = d3.layout.cloud()
  .size([width, height])
  .words(finalData.map(function(d) { return {text: d.word, size: d.amount}; }))
  .padding(2)
  .fontSize(function(d) {
     return d.size
   })
  .on("end", update);
layout.start();

function update(words) {
  console.log("words:", words);
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 3.95 + "," + layout.size()[1] / 3.5 + ")")
      .selectAll("text")
    	.data(words)
      .enter().append("text")
      .style("fill", function(d) {
          return color(d.size);
        })
      .style("font-size", function(d) {
          return textScale(d.size) + "em";
        })
      .on('mouseover', function(d){
      const nodeSelection = d3.select(this).style('opacity', 0.5)
      nodeSelection.select("text").style('opacity', 1)
      })
      .on('mouseout', function(d){
      const nodeSelection = d3.select(this).style('opacity', 1)
      nodeSelection.select("text").style('opacity', 1)
      })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")";
        })
      .style('opacity', 0)
      .text(function(d) { return d.text; })
      .transition()
      .delay(function(d, i) {
        return i * 5;
      })
      .style('opacity', 1)

      const g = svg.append('g')
      var data;

      //interactivity
      d3.selectAll('.check1, .check2').on('change', function() {
      //selecteer de id's filter-nl-only en filter-us-only en wanneer deze id's veranderen voer een functie uit
        const checked1 = d3.select('.check1').property('checked');
        const checked2 = d3.select('.check2').property('checked');
      //const die aangeeft dat de id's zijn aangeklikt
        if  (checked1 === true && checked2 === true){

          const filtered_data = finalData.filter((d) => d.amount === 2 || d.amount > 30);
          let layout = d3.layout.cloud()
            .size([width, height])
            .words(filtered_data.map(function(d) { return {text: d.word, size: d.amount}; }))
            .padding(2)
            .fontSize(function(d) {
               return d.size
             })
            .on("end", update);
          layout.start();

        } else if (checked1 === true){
          console.log("filter1");
          const filtered_data = finalData.filter((d) => d.amount === 2);
          let layout = d3.layout.cloud()
            .size([width, height])
            .words(filtered_data.map(function(d) { return {text: d.word, size: d.amount}; }))
            .padding(2)
            .fontSize(function(d) {
               return d.size
             })
            .on("end", update);
          layout.start();
          //update(filtered_data);

        } else if (checked2 === true) {
          
          const filtered_data = finalData.filter((d) => d.amount > 30);
          let layout = d3.layout.cloud()
            .size([width, height])
            .words(filtered_data.map(function(d) { return {text: d.word, size: d.amount}; }))
            .padding(2)
            .fontSize(function(d) {
               return d.size
             })
            .on("end", update);
          layout.start();

        } else {
          let layout = d3.layout.cloud()
            .size([width, height])
            .words(filtered_data.map(function(d) { return {text: d.word, size: d.amount}; }))
            .padding(2)
            .fontSize(function(d) {
               return d.size
             })
            .on("end", update);
          layout.start();
        }
      });
}
});
