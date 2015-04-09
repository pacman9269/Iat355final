function parallel(data){
  log(data);
  var w = 1000;
var h = 500;
var margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 10
}

var x = d3.scale.ordinal().rangePoints([0, w], 1),
    y = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("  + margin.left + "," + margin.top + ")" );

    // data.forEach(function(d){
    //     d["Petal Length"] = +d["Petal Length"]
    //     d["Petal Width"] = +d["Petal Width"]
    //     d["Sepal Width"] = +d["Sepal Width"]
    //     d["Sepal Length"] = +d["Sepal Length"]
    // })

    // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    if( d != "Species") {
 y[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
        .range([h, 0]);

  		return true;	

    }
    else{
    	y[d] = d3.scale.ordinal()
    	.domain(d3.extent(data, function(p) { return +p[d]}))
    	.range([0, h/2, h])
    	return true;
    }
  }));

 
  unselected = svg.append("g")
      .attr("class", "unselected")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

 
  selected = svg.append("g")
      .attr("class", "selected")
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

}



function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  selected.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}