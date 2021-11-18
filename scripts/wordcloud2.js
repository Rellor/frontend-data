// wordcloud Bas de Roller

// begin code gehaald van https://www.d3-graph-gallery.com/graph/wordcloud_basic.html

  const finalData = []
  const counts = {}

d3.json('https://raw.githubusercontent.com/ajzbc/kanye.rest/master/quotes.json').then((json) => {
  myWords = json + ''
  //data opvragen van externe bron
  const wordsSeperate = myWords.split(" ")
  //woorden van elkaar splitten
  const wordsRemovedI = wordsSeperate.toString().replace(/["%?!.0&123456789"]/g, ' ').toLowerCase().replaceAll(' ', '').split(',').filter(word => !!word.length)
  //woorden pakken, hierin %?!.0&123456789 filteren en vervolgens de hoofdletters weghalen en lege vakken verwijderen

  wordsRemovedI.forEach(word => {
    if(finalData.some(el => el.word === word)) {
      finalData.find(el => {
         if(el.word === word) { el.amount = el.amount + 1 }
      })
    } else {
      finalData.push({ word: word, amount: 1 })
    }
  })
  //per wordsRemovedI cheken of het woord dubbel voorkomt en tellen hoevaak het voorkomt. Als het maar 1 keer voorkomt de amount op 1 zetten

  const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 2900 - margin.left - margin.right,
    height = 1100 - margin.top - margin.bottom
    //margin, width en hight aanmaken

  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
  //svg aanroepen en een groep geven. Vervolgens grotes geveb aan deze elementen

  const textScale = d3.scaleLinear()
    .domain([1, 60])
    .range([1.2, 10])
  //scale aanmaken voor de fontsize

  const color = d3.scaleLinear()
    .domain([1, 60])
    .range([ "black", "red"])
  //scale aanmaken voor de kleur van de letters

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(finalData.map((d) => { return {text: d.word, size: d.amount} }))
    .padding(2)
    .fontSize((d) => { return d.size })
    .on("end", update)
  layout.start()
  //eerste layout aanmaken. Hier de size meegeven, de data filteren op text en size, de appding meegeven en de standaard font-size. Vervolgens doorsturen naar update

  function update(words) {
    d3.select("#wordcloud").remove()
    //per update oude wordcloud weghalen
    svg
      .append("g")
        .attr("id", "wordcloud")
        .attr("transform", "translate(" + layout.size()[0] / 3.95 + "," + layout.size()[1] / 3.5 + ")")
        .selectAll("text")
      	.data(words)
        .enter().append("text")
        //g maken binnen svg, daar id aangeven en locatie aangeven van de de group. Daarna de words erin gooien en dat in text zetten.

          .style("fill", function(d) {
              return color(d.size)
            })
          .style("font-size", function(d) {
              return textScale(d.size) + "em"
            })
          //font size en kleur aanpassen op basis van de ranges en domains die meegegeven waren
          .style('opacity', 0)
          //eerst de text opacity 0 maken zodat het vervolgens kan verschijnen

          .on('mouseover', function(d){
          const nodeSelection = d3.select(this).style('opacity', 0.5)
          nodeSelection.select("text").style('opacity', 1)
          })
          .on('mouseout', function(d){
          const nodeSelection = d3.select(this).style('opacity', 1)
          nodeSelection.select("text").style('opacity', 1)
          })
          //hover functie gemaakt die de text opacity aanpast

          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")"
            })
          //woorden random locatie geven

          .text(function(d) { return d.text })
          .transition()
          .delay(function(d, i) {
            return i * 7
          })
          .style('opacity', 1)
          //transition zetten op de text zodat het na elkaar verschijnt

        var data
        const filtered_data = []

        //interactivity
        d3.selectAll('.check1, .check2, .check3').on('change', () => {
        //selecteer de classes .check1, .check2 en check3 en wanneer deze classes veranderen voer een functie uit
          const checked1 = d3.select('.check1').property('checked')
          const checked2 = d3.select('.check2').property('checked')
          const checked3 = d3.select('.check3').property('checked')
        //const die aangeeft dat de classes zijn aangeklikt

          if  (checked1 === true && checked2 === true && checked3 === true){
            //als checked1, checked2 en checked3 = true dan...
            const filtered_data = finalData.filter((d) => d.amount === 1 || d.amount > 20)
            //filter de data op basis van amount
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(filtered_data.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
              //maak layout opniew aan op basis van de gefilterde data en ga weer over update heen
            layout.start()
            //maak de layout aan

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
            //wanneer niks is aangeklikt
            let layout = d3.layout.cloud()
              .size([width, height])
              .words(finalData.map((d) => { return {text: d.word, size: d.amount} }))
              .padding(2)
              .fontSize((d) => { return d.size })
              .on("end", update)
              //maak de layout aan op basis van de ongefilterde data en ga weer over update heen
              layout.start()
              //start de layout
          }
        })
      }
})
