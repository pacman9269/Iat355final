////bargraph function
function allCurreniesGraph(json){
    //global svg
    var margin = {top:30, right:30, bottom:30, left:30},
        width = 800 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var svg = d3.select("#allCurrenies").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //global tool tips
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    tooltip.append("div").attr("class", "label");
    tooltip.append("div").attr("class", "rate");
    
    svg.on("mousemove", function(d){
        tooltip.style("top", (d3.event.pageY + 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
    })
    //axis and scales
    var yMax;
    yMax = d3.max(json, function(d){ return d.rate;});
    
    
    var yScale = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xScale = d3.scale.ordinal().rangePoints([margin.left, width]);
    xScale.domain(json.map(function(d){ return d.name; }));

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(20, "$");
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(10," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+ margin.left +",0)")
        .call(yAxis);
    
    var referenceLine = svg.append("svg:line")
        .attr("x1", margin.left)
        .attr("y1", yScale(1))
        .attr("x2", width+margin.right)
        .attr("y2", yScale(1))
        .style("stroke", "blue");
    
    //log(json);
    
    var bar = svg.selectAll("rect")
            .data(json)
            .enter()
            .append("rect")
            .attr("x", function(d){ return xScale(d.name) + 5;})
            .attr("y", function(d){ return yScale(d.rate);})
            .attr("width", 10)
            .attr("height", function(d){ return height-yScale(d.rate);});
    
    bar.on("mouseover", function(d){
        tooltip.select(".label").html(String(d.name));
        tooltip.select(".rate").html(
            '<ul>'+
            '<li>Currency: ' + currenciesName[d.name] +'</li>'+
            '<li>Rate To USD: ' + d.rate +'</li>'+
            '<li>Timestamp: ' + d.date +'</li>'
            +'</ul>'
        );
        tooltip.style("display", "block");
    })

    bar.on("mouseout", function(d){
        tooltip.style("display", "none");
    })
}
//
//Argentina ARS
//Australia
//Brazil
//Canada
//China
//European Function
//Hong Kong
//India
//Japan
//Mexico
//Russia
//Saudi Arabia
//South Africa
//South Korea
//Taiwan
//Turkey
//United Kingdom
//United States
//
//x axis as year
//y axis as rate
//
//x axis as currency
//y axis as rate
//
//x axis as day
//y axis as rate