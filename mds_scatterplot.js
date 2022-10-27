function mds_data_scatterplot(data) {
    var margin = { top: 70, right: 40, bottom: 80, left: 70 },
        width = 1100 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    scatter_color = ["blue", "#11A100", "red", "#7900AA", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
    legend_names = ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"]

    data = d3.entries(data.chart_data)
    console.log(data)
    xValue = d => d.value.dim1
    yValue = d => d.value.dim2
    colorValue = d => d.value.label


    d3.select("#scree-plot-graph").selectAll("*").remove()
    d3.select("#biplot-graph").selectAll("*").remove()
    d3.select("#lineplotContainer").selectAll("*").remove()
    d3.select("#scatterplot-matrix").selectAll("*").remove()
    d3.select("#mds-scatterplot-graph-data").selectAll("*").remove()
    d3.select("#pcp-graph").selectAll("*").remove()
    
    var svg = d3.select("#mds-scatterplot-graph-data")
        .append("svg")
        .attr("width", width + margin.left + margin.right+100)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // legend with cluster name and corresponding color values.
    legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width-10}, -70)`);

    legend.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 130)
        .attr("width", 120)
        .style("fill", "none")
        .style("stroke", "black");

    legend.selectAll("mydots")
        .data(legend_names)
        .enter()
        .append("circle")
        .attr("cx", 18)
        .attr("cy", function(d, i) { return 30 + i * 25 }) // 30 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d, i) { return scatter_color[i] })

    legend.selectAll("mylabels")
        .data(legend_names)
        .enter()
        .append("text")
        .attr("x", 28)
        .attr("y", function(d, i) { return 32 + i * 25 })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "2em")

    //title header
    svg.append('text')
        .attr('fill', 'black')
        .attr('x', width/2)
        .attr('y', -30)
        .attr("text-anchor", "middle")
        .text("Multidimensional scaling plot (MDS Scatterplot)")
        .style('font-weight','bold')
        .style("font-size", "3em")

    var xScale = d3.scaleLinear()
        .domain([d3.min(data, xValue) - 1, d3.max(data, xValue) ])
        .range([0, width])
        .nice();

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    xAxis.append('text')
        .attr('fill', 'black')
        .attr('x', width/2)
        .attr('y', 50)
        .text("Dimension 1")
        .style('text-anchor', 'middle')
        .style('font-weight','bold')
        .style("font-size", "2em");

    var yScale = d3.scaleLinear()
        .domain([d3.min(data, yValue) , d3.max(data, yValue) ])
        .range([height, 0])
        .nice();

    var yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    yAxis.append('text')
        .attr('fill', 'black')
        .attr('x', -height/2)
        .attr('y', -40)
        .text("Dimension 2")
        .style('text-anchor', 'middle')
        .style('font-weight','bold')
        .style("font-size", "2em")
        .attr('transform', 'rotate(-90)');

    svg.append("g").selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 6)
        .style("fill", d => scatter_color[colorValue(d)]);
}