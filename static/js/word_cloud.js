function wc(country_name, year) {
    fetch('/wc/' + country_name + "/" + year)
	.then(function(response){
	return response.json()
	}).then(function(data_input){
        myWords = data_input;

var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 600 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

d3.selectAll("#word_cloud svg").remove()
var svg = d3.select("#word_cloud").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

var layout = d3.layout.cloud()
.size([width, height])
.words(myWords.map(function(d) { return {text: d.target_type, size:d.count*2}; }))
.padding(5)        //space between words
.rotate(function() { return 360; })
.fontSize(function(d) { return d.size; })      // font size of words
.on("end", draw);
layout.start();


function draw(words) {
    svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "red")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    };
    });
}

