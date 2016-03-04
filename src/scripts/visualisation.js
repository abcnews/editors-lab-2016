
var d3 = require('d3');
var width = window.innerWidth,
    height = window.innerHeight,
    inside = 2400,
    c = {y:height/2, x: width/2};

var rootEl, svg, node, inited;

var nodes = window.nodes = d3.range(inside).map(function(i){return {id:i};});
var nodesOut = [];

var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .charge(-0.5)
    .gravity(0)
    .theta(0.99)
    .size([width, height])
    .on("tick", tick)
    // .on('end', end);

var forceOut = d3.layout.force()
    .nodes(nodesOut)
    .links([])
    .charge(-0.5)
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
    var dots = Math.ceil(value/10000);

    while (nodes.length > dots) {
        nodesOut.push(nodes.pop());
    }

    while (nodes.length <= dots) {
        nodes.push(nodesOut.pop());
    }

    force.start();
    forceOut.start();
}

function init() {
    svg = d3.select(rootEl).append("svg")
        .attr("width", width)
        .attr("height", height);

console.log(nodes.length);
    node = svg.selectAll("circle").data(nodes, nodeId).enter()
        .append('circle')
        .attr('r',1);
    console.time('layout');
    force.start();

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

function tickOut(e) {

    node.attr("cx", function(d) { return Math.max(Math.min(d.x,width-1),1); })
        .attr("cy", function(d) { return Math.max(Math.min(d.y,height-1),1); });

}

function end() {
    console.timeEnd('layout');
    console.log('end');
    inited = true;
    nodes.forEach(distance);
    nodes.sort(function(a,b){
        return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0;
    });

    node = node.data(nodes, nodeId);
    node.enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 1);
}

function nodeId(d) {
    return d.id;
}
// var intId = setInterval(function(){
//   d3.range(100).forEach(function(){nodes.push({id:0});});
//   force.start();
//
//   if (nodes.length >= inside) {
//       clearInterval(intId);
//   }
//
//
// }, 10);


function distance(d) {
    d.distance = Math.sqrt(Math.pow(d.x-width/2,2)+Math.pow(d.y-height/2,2));
}
