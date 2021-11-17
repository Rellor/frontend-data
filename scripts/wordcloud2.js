// wordcloud Bas de Roller

// begin code gehaald van https://www.d3-graph-gallery.com/graph/wordcloud_basic.html

  const finalData = []
  const counts = {}

d3.json('https://raw.githubusercontent.com/ajzbc/kanye.rest/master/quotes.json').then((json) => {
  myWords = json + ''

  const wordsSeperate = myWords.split(" ")
  const wordsRemovedI = wordsSeperate.toString().replace(/["%?!.0&123456789"]/g, ' ').toLowerCase().replaceAll(' ', '').split(',').filter(word => !!word.length)
  const toFindDuplicates2 = wordsRemovedI => wordsRemovedI.filter((item, index) => wordsRemovedI.indexOf(item) == index)
  const duplicateElementa2 = toFindDuplicates2(wordsRemovedI)

  wordsRemovedI.forEach((x) => { counts[x] = (counts[x] || 0) + 1 })

  wordsRemovedI.forEach(word => {
    if(finalData.some(el => el.word === word)) {
      finalData.find(el => {
         if(el.word === word) { el.amount = el.amount + 1 }
      })
    } else {
      finalData.push({ word: word, amount: 1 })
    }
  })

  const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 2900 - margin.left - margin.right,
    height = 1100 - margin.top - margin.bottom

  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

  const textScale = d3.scaleLinear()
    .domain([1, 60])
    .range([1.2, 10])

  const color = d3.scaleLinear()
    .domain([1, 60])
    .range([ "black", "red"])

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(finalData.map((d) => { return {text: d.word, size: d.amount} }))
    .padding(2)
    .fontSize((d) => { return d.size })
    .on("end", update)
  layout.start()

  function update(words) {
    d3.select("#wordcloud").remove()
    svg
      .append("g")
        .attr("id", "wordcloud")
        .attr("transform", "translate(" + layout.size()[0] / 3.95 + "," + layout.size()[1] / 3.5 + ")")
        .selectAll("text")
      	.data(words)
        .enter().append("text")
          .style("fill", function(d) {
              return color(d.size)
            })
          .style("font-size", function(d) {
              return textScale(d.size) + "em"
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
              return "translate(" + [d.x, d.y] + ")"
            })
          .style('opacity', 0)
          .text(function(d) { return d.text })
          .transition()
          .delay(function(d, i) {
            return i * 5
          })
          .style('opacity', 1)

        var data
        const filtered_data = []

        //interactivity
        d3.selectAll('.check1, .check2, .check3').on('change', () => {
        //selecteer de id's filter-nl-only en filter-us-only en wanneer deze id's veranderen voer een functie uit
          const checked1 = d3.select('.check1').property('checked')
          const checked2 = d3.select('.check2').property('checked')
          const checked3 = d3.select('.check3').property('checked')
        //const die aangeeft dat de id's zijn aangeklikt

          if  (checked1 === true && checked2 === true && checked3 === true){
            const filtered_data = finalData.filter((d) => d.amount === 1 || d.amount > 20)
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(filtered_data.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
            layout.start()

          } else if (checked1 === true){
            const filtered_data = finalData.filter((d) => d.amount === 1)
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(filtered_data.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
            layout.start()

          } else if (checked2 === true) {
            const filtered_data = finalData.filter((d) => d.amount > 20)
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(filtered_data.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
            layout.start()

          } else if (checked3 === true) {
            const filtered_data = finalData.filter((d) => d.word === "sex" )
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(filtered_data.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
            layout.start()

          } else {
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(finalData.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
              layout.start()
          }
        })
      }
})
