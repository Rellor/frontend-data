// wordcloud Bas de Roller

// begin code gehaald van https://www.d3-graph-gallery.com/graph/wordcloud_basic.html

d3.json('https://raw.githubusercontent.com/ajzbc/kanye.rest/master/quotes.json').then((json) => {
  myWords = json + '';
  // split de woorden op een spatie zodat je losse woorden krijgt;
  const wordsSeperate = myWords.split(" ");
  // maak wordsRemovedI aan waarin hij wordsSeperate pakt. Er een string van maakt. Vervolgens replace je ?!.0&123456789 met een leeg vakje en replace je die weer met een helemaal leeg vak. Daarna maak je weer een Array aan met split en filter je de plekken waar words leeg is;
  const wordsRemovedI = wordsSeperate.toString().replace(/["%?!.0&123456789"]/g, ' ').toLowerCase().replaceAll(' ', '').split(',').filter(word => !!word.length)

  // telt de hoevaak een woord langskomt
  const counts = {};
  wordsRemovedI.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
  console.log(counts)

  // Het filteren van dubbelle woorden en deze houden. Vervolgens de rest verwijderen die niet dubbel is.
  // const toFindDuplicates = wordsRemovedI => wordsRemovedI.filter((item, index) => wordsRemovedI.indexOf(item) !== index)
  // const duplicateElementa = toFindDuplicates(wordsRemovedI);

  // Het filteren van dubbelle woorden en deze houden. Vervolgens deze woorden maar 1 keer laten zien.
  const toFindDuplicates2 = wordsRemovedI => wordsRemovedI.filter((item, index) => wordsRemovedI.indexOf(item) == index)
  const duplicateElementa2 = toFindDuplicates2(wordsRemovedI);

  const finalData = []

  wordsRemovedI.forEach(word => {

    if(finalData.some(el => el.word === word)) {
      finalData.find(el => {
         if(el.word === word) {
           console.log('test')
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

  // finalData.sort((a,b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0))

  console.log(finalData)
  // console.log(finalData);

  // de dementies en margin van de graph maken;
  const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1920 - margin.left - margin.right,
    height = 1080 - margin.top - margin.bottom;

  // svg aanmaken en deze op de body zetten. Hoogte, breedte geven en groupperen met g om vervolgens de groep een margin te geven;
  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var scale = d3.scaleLinear()
.domain([0, function(d) { return d.size * 10; }])
.range([10, 50])

const layout = d3.layout.cloud()
// roep layout cloud aan van d3;
  .size([width, height])
  // geef de hoogte en breedte mee van de layout;
  .words(finalData.map(function(d) { return {text: d.word, size: d.amount}; }))
  // genereer de woorden die in de wordcloud staat. Map de array van de JSON en gooi daar de function d overheen;
  .padding(2)
  .fontSize(function(d) { return d.size * 10; })
  // geef elk woord een padding van 2 en een fontsize die groter word op basis van de hoeveelheid size;
  .on("end", draw);
  // op het einde van de transition de callback draw meegeven;
layout.start();

function draw(words) {
// functie draw aanamken
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style('opacity', 0)
        .text(function(d) { return d.text; })
        .transition()
        .delay(function(d, i) {
          return i * 15;
        })
        .style('opacity', 1)
        // delay aanamken die ervoor zorgt dat er een delay is per woord dat verschijnt
}
});
