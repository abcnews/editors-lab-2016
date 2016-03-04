var NUMBER_DELIMITER_PATTERN = /(\d)(?=(\d{3})+(?!\d))/g;

var d3 = require('d3');
var width = window.innerWidth,
    height = window.innerHeight,
    c = {y:height/2, x: width/2};

var rootEl, svg, node, nodes, inited;

var nodesOut = [];

var force = d3.layout.force()
    // .nodes(nodes)
    .links([])
    .charge(-0.5)
    .gravity(0)
    .theta(0.99)
    .size([width, height])
    .on("tick", tick);

var forceOut = d3.layout.force()
    .nodes(nodesOut)
    .links([])
    .charge(-1)
    .gravity(-0.1)
    .size([width,height])
    .on('tick', tickOut);

function visualisation(el, maxValue) {
    rootEl = el;
    init(maxValue); // ?
    return update;
}

module.exports = visualisation;


function update(value) {

    rootEl.querySelector('.value').innerHTML = value.toString().replace(NUMBER_DELIMITER_PATTERN, '$1' + ',');

    var target = Math.ceil(value/10000);

    nodes.forEach(distance);
    nodes.sort(function(a,b){
        return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0;
    });

    while (nodes.length !== target) {
        if (nodes.length > target) {
            nodesOut.push(nodes.pop());
        } else {
            nodes.push(nodesOut.pop());
        }
    }

    force.start();
    inited = true;

    if (nodesOut.length) {
        forceOut.start();
    }
}

function init(maxValue) {

    nodes = d3.range(Math.ceil(maxValue/10000)).map(function(i){return {id:i};});
    force.nodes(nodes);

    svg = d3.select(rootEl).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('viewBox', '0 0 '+width+' '+height);

    node = svg.selectAll("circle").data(nodes, nodeId).enter()
        .append('circle')
        .attr('r',1);

    // update(maxValue);
}

function tick(e) {
    console.log('tick');
    var k = 0.1 * e.alpha;

    // Push nodes toward their designated focus.
    nodes.forEach(function(o) {
        o.y += (c.y - o.y) * k;
        o.x += (c.x - o.x) * k;
    });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

}

function tickOut() {
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

function nodeId(d) {
    return d.id;
}

function distance(d) {
    d.distance = Math.sqrt(Math.pow(d.x-width/2,2)+Math.pow(d.y-height/2,2));
}
