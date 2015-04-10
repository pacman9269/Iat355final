function parallel(data){
    var w = 1600;
    var h = 600;
    var margin = {
        top: 30,
        right: 10,
        bottom: 10,
        left: 10
    }

    var x = d3.scale.ordinal().rangePoints([0, w], 1),
        y = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left");

    var svg = d3.select("#fifteenyears")
                .append("svg")
                .attr("width", w)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate("  + margin.left + "," + margin.top + ")" );

        // Extract the list of dimensions and create a scale for each.
      x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
        if( d != "Currency") {
     y[d] = d3.scale.linear()
            .domain(d3.extent(data, function(p) { return +p[d]; }))
            .range([h, 0]);
            return true;
        }
        else{
        	y[d] = d3.scale.ordinal().rangePoints([0, h])
            y[d].domain(data.map(function(d){ return d.Currency; }));
        	return true;
        }
      }));


      var bg = svg.append("g")
          .attr("class", "bg")
        .selectAll("path")
          .data(data)
        .enter().append("path")
          .attr("d", path);


      var fg = svg.append("g")
          .attr("class", "fg")
        .selectAll("path")
         .data(data)
        .enter()
        .append("path")
    //     	.attr("class", function(d){ 
    //     	if(d.Species == "Iris-setosa") return "setosa";
    //     	if(d.Species == "Iris-versicolor") return "versicolor";
    //     	if(d.Species == "Iris-virginica") return "virginica";
    // })
          .attr("d", path);


      var g = svg.selectAll(".dimension")
          .data(dimensions)
        .enter().append("g")
          .attr("class", "dimension")
          .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

      g.append("g")
          .attr("class", "axis")
          .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function(d) { return d; });

      g.append("g")
          .attr("class", "brush")
          .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
        .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);

        function path(d) {
          return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
        }

    function brush() {
      var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
          extents = actives.map(function(p) { return y[p].brush.extent(); });
      fg.style("display", function(d) {
        return actives.every(function(p, i) {
            if (typeof d[p] == 'string' || d[p] instanceof String){
                var scale = d3.scale.ordinal().rangePoints([0, h])
                scale.domain(data.map(function(d){ return d.Currency; }));
                var mappedValue = scale(d[p]);
                log(mappedValue);
                return extents[i][0] <= mappedValue && mappedValue <= extents[i][1];
            }
            // it's a string
            else{
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }
        }) ? null : "none";
      });
    }
}
