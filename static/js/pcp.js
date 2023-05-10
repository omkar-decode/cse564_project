
var data;
const dataVariables = ['country_txt', 'city', 'gname', 'attacktype1_txt', 'targtype1_txt', 'targsubtype1_txt', 'weaptype1_txt'];
clusterColors = ["#003f5c", "#bc5090", "#ffa600"]
var margin = {top: 30, right: 30, bottom: 70, left: 140},
    width = 850 + 2 * margin.left + margin.right,
    height = 560 - margin.top - margin.bottom;

async function plotPCP(country_name, year) {
    document.getElementById("pcp").innerHTML = "";
    data = await (await fetch('/pcp/' + country_name + '/' + year)).json()
    // console.log(data)
    plotPcpGraph();
};

function plotPcpGraph() {
    // pcpPoints = []
    // for (var index=0; index < Object.keys(data['cluster']).length; index++) {
    //     pcpPoints.push({
    //         'Fouls_Committed': data['Fouls_Committed'][index], 
    //         'Goals': data['Goals'][index], 
    //         'Matches_Played': data['Matches_Played'][index],
    //         'Mins': data['Mins'][index],
    //         'On_Target': data['On_Target'][index],
    //         'On_Target_Per_Avg_Match': data['On_Target_Per_Avg_Match'][index],
    //         'Shots': data['Shots'][index],
    //         'Shots_Per_Avg_Match': data['Shots_Per_Avg_Match'][index],
    //         'Substitution': data['Substitution'][index],
    //         'xG': data['xG'][index],
    //         'xG_Per_Avg_Match': data['xG_Per_Avg_Match'][index],
    //         'cluster': data['cluster'][index]
    //     });
    // }
    pcpPoints = data
    dimensions = dataVariables



//     var x = d3.scale.ordinal().rangePoints([0, width], 1),
//     y = {},
//     dragging = {};

//     var line = d3.svg.line(),
//         axis = d3.svg.axis().orient("left"),
//         background,
//         foreground;

//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     x.domain(dimensions = d3.keys(pcpPoints[0]).filter(function(d) {
//         return (y[d] = d3.scale.ordinal()
//             .domain(pcpPoints.map(function(p) { return +p[d]; }))
//             .range([height, 0]));
//         }));

//     background = svg.append("g")
//     .attr("class", "background")
//     .selectAll("path")
//     .data(pcpPoints)
//     .enter().append("path")
//     .attr("d", path);
  
//     foreground = svg.append("g")
//         .attr("class", "foreground")
//         .selectAll("path")
//         .data(pcpPoints)
//         .enter().append("path")
//         .attr("d", path)
//         .attr("stroke", function(d) { return 'red' });
    
//     var g = svg.selectAll(".dimension")
//     .data(dimensions)
//     .enter().append("g")
//     .attr("class", "dimension")
//     .attr("transform", function(d) { console.log(d); return "translate(" + x(d) + ")"; })
//     .call(d3.behavior.drag()
//     .origin(function(d) { return {x: x(d)}; })
//     .on("start", function(d) {
//     dragging[d] = x(d);

//     background.attr("visibility", "hidden");
//     })
//     .on("drag", function(d) {
//     dragging[d] = Math.min(width, Math.max(0, d3.event.x));
//     foreground.attr("d", path);
//     dimensions.sort(function(a, b) { return position(a) - position(b); });
//     x.domain(dimensions);
//     g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
//     })
//     .on("end", function(d) {
//     delete dragging[d];
//     transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
//     transition(foreground).attr("d", path);
//     background
//         .attr("d", path)
//         .transition()
//         .delay(500)
//         .duration(0)
//         .attr("visibility", null);
//     }));

//     g.append("g")
//       .attr("class", "axis")
//       .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
//     .append("text")
//       .style("text-anchor", "middle")
//       .attr("y", -9)
//       .text(function(d) { return d; });

//   g.append("g")
//       .attr("class", "brush")
//       .attr("color", "red")
//       .each(function(d) {
//         d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("start", brushstart).on("brush", brush));
//       })
//     .selectAll("rect")
//       .attr("x", -8)
//       .attr("width", 16);

//       function position(d) {
//         var v = dragging[d];
//         return v == null ? x(d) : v;
//     }
    
//     function transition(g) {
//         return g.transition().duration(500);
//     }
    
//     function path(d) {
//         return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
//     }
    
//     function brushstart() {
//         d3.event.sourceEvent.stopPropagation();
//     }
    
//     function brush() {
//         var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
//             extents = actives.map(function(p) { return y[p].brush.extent(); });
//         foreground.style("display", function(d) {
//           return actives.every(function(p, i) {
//             return extents[i][0] <= d[p] && d[p] <= extents[i][1];
//           }) ? null : "none";
//         });
//     }
}
