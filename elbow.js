function draw_line_plot(d) {

    d3.select("#mds-scatterplot-graph-data").selectAll("*").remove()
    d3.select("#pcp-graph").selectAll("*").remove()
    d3.select("#scree-plot-graph").selectAll("*").remove()
    d3.select("#biplot-graph").selectAll("*").remove()
    d3.select("#lineplotContainer").selectAll("*").remove()
    d3.select("#scatterplot-matrix").selectAll("*").remove()
    var mData = d;
    // console.log(mData);
 
    // // console.log(mData["inertia"][1]);
    // var li = [];
    // for (var i = 1; i < 16; i++){
    //         li.push(mData["inertia"][i]);
    //     //    console.log(mData["inertia"][i]);
    // }
    // console.log(li);
    console.log(mData.inertia)
    data = [];
    for (i = 0; i < 15; i++) {
        data.push({ 'i': i, 'inertia': mData["inertia"][i+1] });
    }
   console.log(data)
    // console.log(d3.max(data, function (d) { return d.inertia; }))
    document.getElementById("lineplotContainer").innerHTML = "";

    var margin = { top: 80, right: 20, bottom: 50, left: 240 };
    var width = 900;
    var height = 550;

    var x = d3.scaleLinear().domain([0.5, data.length+0.5]).range([0, width]);
    var y = d3.scaleLinear().domain([d3.min(data, function (d) { return d.inertia; })-200,
    d3.max(data, function (d) { return d.inertia; }) + 200])
        .range([height, 0]);

    // data.forEach(d => {
    //     d.key = +d.i
    //     d.inertia = +d.inertia
    //     // d.value.variance_percentage = +d.value.variance_percentage
    //     // feature_count += 1
    // });
    // xValue = d => d.key
    // yValue = d => d.inertia

    let line = d3.line()
    // .x(d => x(xValue(d)))
    // .y(d => y(yValue(d)))
        .x(function (d, i) { return x(i + 1); })
        .y(function (d) { return y(d.inertia); })
    .curve(d3.curveMonotoneX);

    var xAxis = d3.axisBottom().scale(x).ticks(16)
        .tickFormat(function (d) { return d });
    var yAxis = d3.axisLeft().scale(y).ticks(12)

    var svg = d3.select("#lineplotContainer")
        .append("svg")
            .attr("width", width + margin.left + margin.right+300)
            .attr("height", height + margin.top + margin.bottom+300)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    svg.append('text')
        .attr('fill', 'black')
        .attr('y', 10)
        .attr('x', width / 3)
        .text("Elbow Method")
        .style('font-weight','bold')
        .style("font-size", "3em")            

    var div = d3.select("#lineplotContainer").append("div")
        .attr("class", "tooltiptext")
        .style("opacity", 0);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "black")
        .attr("stroke-width", 1.2)
        .attr("d", line);

    svg.append("g")
        .attr("class", "x axis-text")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis);

    svg.append("text")
        .attr("y", height + 60)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style('font-weight','bold')
        .text('Number of Clusters (k)');

    svg.append("line")
        .attr("x1", x(4))
        .attr("x2", x(4))
        .attr("y1", y(d3.min(data, function (d) { return d.inertia; })))
        .attr("y2", y(d3.max(data, function (d) { return d.inertia; })))
        .attr("stroke", 'red')
        .attr("stroke-dasharray", "7,7")
        .attr("stroke-width", 3.5);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d, i) { return x(i + 1) })
        .attr("cy", function (d) { return y(d.inertia) })
        .attr("fill", "blue")
        .attr("stroke", 'black')
        .attr("stroke-width", 2.5)
        .attr("r", 6);

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

    svg.append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -75)
        .attr("text-anchor", "middle")
        .style('font-weight','bold')
        .text("Sum of Squared Errors")
}
