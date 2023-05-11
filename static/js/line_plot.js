function create_chart(country_name,year) {

    fetch('/lineplot/'+country_name+'/'+year)
    .then(function(response){
      return response.json()
    }).then(function(data){
    transformed_data = [];
    killValues = []
    woundVlaues = []
        data.forEach(function (d) { 
            var row1 = {
                date: d['Year'],
                price: d['Number Killed']
            }
            var row2 = {
                date: d['Year'],
                price: d['Number Wounded']
            }
            killValues.push(row1)
            woundVlaues.push(row2)
        });

        var killedObj = {
            name: "Killed",
            values: killValues
        }
        var woundedObj = {
            name: "Wounded",
            values: woundVlaues
        }
        transformed_data.push(killedObj)
        transformed_data.push(woundedObj)
        data = transformed_data

      var width = 550;
      var height = 400;
      var margin = 50;
      var duration = 250;
      
      var lineOpacity = "5";
      var lineOpacityHover = "0.85";
      var otherLinesOpacityHover = "0.1";
      var lineStroke = "3px";
      var lineStrokeHover = "5px";
      
      var circleOpacity = '0.85';
      var circleOpacityOnLineHover = "0.25"
      var circleRadius = 3;
      var circleRadiusHover = 6;
      
      
      /* Format Data */
      var parseDate = d3.timeParse("%Y");
      data.forEach(function(d) { 
        d.values.forEach(function(d) {
          d.date = parseDate(d.date);
          d.price = +d.price;    
        });
      });
      
      
      /* Scale */
      var xScale = d3.scaleTime()
        .domain(d3.extent(data[0].values, d => d.date))
        .range([0, width-margin]);
      max1 = d3.max(data[0].values, d => d.price)
      max2 = d3.max(data[1].values, d => d.price)
      var yScale = d3.scaleLinear()
        .domain([0, Math.max(max1, max2)])
        .range([height-margin, 0]);
      
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      
      /* Add SVG */
      d3.selectAll("#chart svg").remove()
      var svg = d3.select("#chart").append("svg")
        .attr("width", (width+margin)+"px")
        .attr("height", (height+margin)+"px")
        .append('g')
        .attr("transform", `translate(${margin}, ${margin})`);
      
      
      /* Add line into SVG */
      var line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.price));
      
      let lines = svg.append('g')
        .attr('class', 'lines');
      
      lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')
          
        .on("mouseover", function(d, i) {
            svg.append("text")
              .attr("class", "title-text")
              .style("fill", color(i))        
              .text(d.name)
              .style("font-size", '20px')
              .attr("text-anchor", "middle")
              .attr("x", (width-margin)/2)
              .attr("y", 5);
          })
        .on("mouseout", function(d) {
            svg.select(".title-text").remove();
          })
        .append('path')
        .attr('class', 'line')  
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => color(i))
        .style("stroke-width", lineStroke)
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                          .style('opacity', otherLinesOpacityHover);
            d3.selectAll('.circle')
                          .style('opacity', circleOpacityOnLineHover);
            d3.select(this)
              .style('opacity', lineOpacityHover)
              .style("stroke-width", lineStrokeHover)
              .style("cursor", "pointer");
          })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                          .style('opacity', lineOpacity);
            d3.selectAll('.circle')
                          .style('opacity', circleOpacity);
            d3.select(this)
              .style("stroke-width", lineStroke)
              .style("cursor", "none");
          });
      
      
      /* Add circles in the line */
      lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d, i) => color(i))
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", "circle")  
        .on("mouseover", function(d) {
            d3.select(this)     
              .style("cursor", "pointer")
              .append("text")
              .attr("class", "text")
              .text(`${d.price}`)
              .attr("x", d => xScale(d.date) + 5)
              .attr("y", d => yScale(d.price) - 10);
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("cursor", "none")  
              .transition()
              .duration(duration)
              .selectAll(".text").remove();
          })
        .append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.price))
        .attr("r", circleRadius)
        .style('opacity', circleOpacity)
        .on("mouseover", function(d) {
              d3.select(this)
                .transition()
                .duration(duration)
                .attr("r", circleRadiusHover);
            })
          .on("mouseout", function(d) {
              d3.select(this) 
                .transition()
                .duration(duration)
                .attr("r", circleRadius);  
            });
      
      
      /* Add Axis into SVG */
      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(5);
      
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis);
      
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // .append('text')
        // .attr("y", 15)
        // .attr("transform", "rotate(-90)")
        // .attr("fill", "#000")
        //.text("Total values");

        svg.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height) + ")")
        .style("text-anchor", "middle")
        .text('Year')
        .style("font-size", '18px')
        .style("fill", "white")

        svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin - 5 )
      .attr("x",0 - (height /2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text('Number of People')
      .style("font-size", '15px')
      .style("fill", "white")
})
}

