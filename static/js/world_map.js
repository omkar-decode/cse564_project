function world_map(year) {

  d3.selectAll("#world_map svg").remove()
var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Number of terrorist attacks: </strong><span class='details'>" + format(d.frequency) + "</span>";
            })

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 1100 - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
    .domain([0,10,50,100,200,500,800,1000,3000,5000])
    // .domain([1000,800,600,400,100,50,10,5,1,0])
    // .range(["rgb(32, 62, 78)", "rgb(0, 66, 109)", "rgb(0, 108, 132)", "rgb(0, 121, 142)", "rgb(0, 133, 149)", "rgb(0, 146, 153)", "rgb(0, 171, 150)", "rgb(0, 195, 134)", "rgb(0, 217, 104)", "rgb(11, 238, 54)"]);
    .range(["rgb(11, 238, 54)", "rgb(0, 217, 104)", "rgb(0, 195, 134)", "rgb(0, 171, 150)", "rgb(0, 146, 153)", "rgb(0, 133, 149)", "rgb(0, 121, 142)", "rgb(0, 108, 132)", "rgb(0, 66, 109)", "rgb(32, 62, 78)"]); 

var path = d3.geoPath();

var svg = d3.select("#world_map")
            .append("svg")
            .attr("width", width)
            .attr("style", "margin-left:-100px;margin-top:20px;")
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

svg.call(tip);

queue()
    .defer(d3.json, "../static/world_countries.json")
    .defer(d3.csv, "../static/map_" + year + ".csv")
    .await(ready);

function ready(error, data, population) {
  var populationById = {};

  population.forEach(function(d) {
   populationById[d.id] = +d['frequency'];});
  data.features.forEach(function(d) { 
    if(populationById.hasOwnProperty(d.properties.name))
    {
      d.frequency = populationById[d.properties.name];
    }
    else
    {
      d.frequency = 0;
    }
  });

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      // .style("fill", function(d) { return color(populationById[d.properties.name]); })
      .style("fill", function(d) { return color(d.frequency); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        })
        .on('click',function(d){
        country_name = d.properties.name
        pcp(country_name, year)
        // createSpiderChart(country_name)
        // pcp(country_name)
        // line_plot('Age');
        // line_plot('Value');
        // line_plot('Overall');
        wc(country_name, year)
        pieChart(country_name, year)
        });
        // .on('dblclick',function(d){
        // country_name = "world"
        // pcp()
        // line_plot('Age');
        // line_plot('Value');
        // line_plot('Overall');
        // });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}

};