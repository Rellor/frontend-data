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
//voor elk word
    if(finalData.some(el => el.word === word)) {
      //dit is een loop die loopt wanneer el.word gelijk is aan word binnen wordsRemovedI
      finalData.find(el => {
         if(el.word === word) {
           console.log('test')
           el.amount = el.amount + 1
           //als el.word gelijk staat aan word dan zet je de amount van het element met een meer totdat er geen woord meer is. Hierdoor tel je hoeveel heer het woord er is
         }
      })
    } else {
      finalData.push({
        word: word,
        amount: 1
        //anders push je het woord gewoon door zonder te loopen en geef je de amount 1 mee
      })
    }

  })

  // finalData.sort((a,b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0))

  console.log(finalData)
  // console.log(finalData);

  // de dementies en margin van de graph maken;
  const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 2900 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

  // svg aanmaken en deze op de body zetten. Hoogte, breedte geven en groupperen met g om vervolgens de groep een margin te geven;
  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var textScale = d3.scaleLinear()
  .domain([1, 60])
  .range([1.2, 10]);

const layout = d3.layout.cloud()
// roep layout cloud aan van d3;
  .size([width, height])
  // geef de hoogte en breedte mee van de layout;
  .words(finalData.map(function(d) { return {text: d.word, size: d.amount}; }))
  // genereer de woorden die in de wordcloud staat. Map de array van de JSON en gooi daar de function d overheen return vervoglgens text als d.word en size als d.amount;
  .padding(2)
  .fontSize(function(d) {
     return d.size
   })
  // geef elk woord een padding van 2 en een fontsize die groter word op basis van de hoeveelheid size;
  .on("end", draw);
  // op het einde van de transition de callback draw meegeven;
layout.start();

function draw(words) {
// functie draw aanamken
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 3.95 + "," + layout.size()[1] / 3.95 + ")")
      //positie van sv
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) {
          console.log(d)
          return textScale(d.size) + "em";
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          //geen rotate
          return "translate(" + [d.x, d.y] + ")";
          //wel rotate
          // return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style('opacity', 0)
        .text(function(d) { return d.text; })
        .transition()
        .delay(function(d, i) {
          return i * 5;
        })
        .style('opacity', 1)
        // delay aanamken die ervoor zorgt dat er een delay is per woord dat verschijnt
}
});
