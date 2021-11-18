var width = 400 * 2, height = 300 * 2

var nodes = [
	{name: 'Test'},
	{name: 'Test'},
	{name: 'Test'},
	{name: 'Test'},
	{name: 'Test'},
	{name: 'Test'},
	{name: 'Test'},
	{name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'},
  {name: 'Test'}
]

var simulation = d3.forceSimulation(nodes)
	.force('charge', d3.forceManyBody().strength(-2))
	.force('center', d3.forceCenter(width / 10, height / 10))
	.on('tick', ticked);

function updateNodes() {
	u = d3.select('.nodes')
		.selectAll('text')
		.data(nodes)
		.join('text')
		.text(function(d) {
			return d.name
		})
		.attr('x', function(d) {
			return d.x
		})
		.attr('y', function(d) {
			return d.y
		})
		.attr('dy', function(d) {
			return 5
		});
}

function ticked() {
	updateNodes()
}
