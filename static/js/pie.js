
function pieChart(country_name, year) {
	fetch('/pie/' + country_name + '/' + year)
	.then(function(response){
	return response.json()
	}).then(function(data_input){

        d3.selectAll("#pie_chart svg").remove()
          var data = data_input
          var text = "";
          
          var width = 320;
          var height = 320;
          var thickness = 40;
          var duration = 750;
          
          var radius = Math.min(width, height) / 2;
          //var color = d3.scaleOrdinal(d3.schemeCategory10);
         // var color = ["#FF0000", "#FFC0CB", "#DC143C", "#FFA07A", "#FF6347", "#FF4500", "#FF8C00", "#FFD700", "#FF69B4", "#FF1493"]
          
         var color = ["#FF0000", "#FF4500", "#DC143C", "#FF6347", "#FF8C00", "#FFA07A", "#FF5733", "#FFC0CB", "#FF1493", "#E60073"]

         var svg = d3.select("#pie_chart")
          .append('svg')
          .attr('class', 'pie')
          .attr('width', width)
          .attr('height', height);
          
          var g = svg.append('g')
          .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
          
          var arc = d3.arc()
          .innerRadius(radius - thickness)
          .outerRadius(radius);
          
          var pie = d3.pie()
          .value(function(d) { return d['Percentage']; })
          .sort(null);
          
          var prevArea = null;
        //   var prevArea = d3.select(svg)
        //   .style("cursor", "pointer")
        //   .style("fill", "white")
        //   .append("g")
        //   .attr("class", "text-group");
   
        //   prevArea.append("text")
        //   .attr("class", "name-text")
        //   .text('Type of Attack')
        //   .attr('text-anchor', 'middle')
        //   .attr('dy', '0.3em')
        //   .style("font-size", "25px");

          var path = g.selectAll('path')
          .data(pie(data))
          .enter()
          .append("g")
          .on("mouseover", function(d) {
                let g = d3.select(this)
                  .style("cursor", "pointer")
                  .style("fill", "white")
                  .append("g")
                  .attr("class", "text-group");

                if (typeof prevArea != "undefined") {
                    d3.select(prevArea)
                    .select(".text-group").remove()
                }
                d3.selectAll(".name-text-base").remove();
                prevArea = this;
           
                g.append("text")
                  .attr("class", "name-text")
                  .text(`${d.data['Attack Type']}`)
                  .attr('text-anchor', 'middle')
                  .attr('dy', '-0.2em')
                  .style("font-size", "18px");
            
                g.append("text")
                  .attr("class", "value-text")
                  .text(`${d.data['Percentage']}` + '%')
                  .attr('text-anchor', 'middle')
                  .attr('dy', '1.6em')
                  .style("font-size", "18px");
              })
            .on("mouseout", function(d) {
                d3.select(this)
                  .style("cursor", "none")  
                  .style("fill", color[this._current])
                  .select(".text-group").remove()

                let g = d3.select(this)
                  .style("cursor", "pointer")
                  .style("fill", "white")
                  .append("g")
                  .attr("class", "text-group");
           
                g.append("text")
                  .attr("class", "name-text")
                  .text('Types of Attack')
                  .attr('text-anchor', 'middle')
                  .attr('dy', '0.3em')
                  .style("font-size", "25px");
                // d3.select(".name-text-base").style("display", "block");
              });
        path.append("text")
        .attr("class", "name-text-base")
        .text('Types of Attack')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .style("font-size", "25px")
        .style("fill", "white");
         path
            .append('path')
            .attr('d', arc)
            .attr('fill', (d,i) => color[i])
            .on("mouseover", function(d) {
                d3.select(this)     
                  .style("cursor", "pointer")
                  .style("fill", "#EEEEEE");
              })
            .on("mouseout", function(d) {
                d3.select(this)
                  .style("cursor", "none")  
                  .style("fill", color[this._current]);
              })
            .each(function(d, i) { this._current = i; });
          
          
          g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(text);
        

	});


	}
