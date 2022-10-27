function scree_plot(data) {

    d3.select("#scree-plot-graph").selectAll("*").remove()
    d3.select("#biplot-graph").selectAll("*").remove()
    d3.select("#lineplotContainer").selectAll("*").remove()
    d3.select("#scatterplot-matrix").selectAll("*").remove()
    d3.select("#mds-scatterplot-graph-data").selectAll("*").remove()
    d3.select("#pcp-graph").selectAll("*").remove()
    d3.select("#imp-features-table-div").selectAll("*").remove()

    // set the dimensions and margins of the graph
    var margin = { top: 40, right: 60, bottom: 80, left: 50 },
        width = 650 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var feature_count = 0
    // console.log(width)
    data = data.chart_data
    console.log(data)
    data = d3.entries(data)
    // console.log(data)

    data.forEach(d => {
        d.key = +d.key
        d.value.cumulative_variance = +d.value.cumulative_variance
        d.value.variance_percentage = +d.value.variance_percentage
        feature_count += 1
    });
    xValue = d => d.key
    yValue = d => d.value.cumulative_variance
    barValue = d => d.value.variance_percentage

    console.log(xValue);
    console.log(yValue);
    console.log(barValue);

    var svg = d3.select("#scree-plot-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append('text')
        .attr('fill', 'black')
        .attr('y', -height/15)
        .attr('x', width / 2)
        .text("Scree plot")
        .style('font-weight','bold')
        .style('text-anchor', 'middle')
        .style("font-size", "16px")

    var xScale = d3.scaleBand()
        .domain(data.map(function(d){ return d.key; }))
        .range([0, width])
        .paddingInner(1.0)
        .paddingOuter(0.6)
        .align(0.5);           

    tickDistance = height / feature_count

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    xAxis.append('text')
        .attr('fill', 'black')
        .attr('x', width / 2)
        .attr('y', height/7)
        .text("Component Number")
        .style('text-anchor', 'middle')
        .style('font-weight','bold')
        .style("font-size", "14px");

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([height, 0])
        .nice();

    var yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    var yAxis_right = svg.append("g")
        .attr("transform", "translate(" + width + " ,0)")
        .call(d3.axisRight(yScale));

    yAxis.append('text')
        .attr('fill', 'black')
        .attr('x', -width/4)
        .attr('y', -height/8)
        .text("Percentage Variance Explained")
        .style('text-anchor', 'middle')
        .style("font-size", "14px")
        .style('font-weight','bold')
        .attr('transform', 'rotate(-90)');

    let line = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.2)
        .attr("d", line);

    var combine = svg.append("g")
        .attr("class", "rect-circle-scree-combine")
        .selectAll('.rect-bar')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "rect-bar-cover");

    combine.append('rect')
        .attr('class', 'rect-bar')
        .on("click", pca_click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr('x', function(d) { return xScale(xValue(d)) - (tickDistance / 2) })
        .attr('y', d => yScale(barValue(d)))
        .attr('width', tickDistance)
        .attr('height', d => height - yScale(barValue(d)));
        // .style("fill", "steelblue");

    combine.append('circle')
        .attr("class", "circle-point")
        .on("click", pca_click)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 4);
        // .style("fill", "steelblue");

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function mouseover(d) {
        for (var i = 0; i < xValue(d); i++) {
            d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#ff2121").style("opacity", "1")
            d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#ff2121").style("opacity", "1")
        }
        div.transition()
            .duration(100)
            .style("opacity", 1);

        div.html(`Percentage data: %${yValue(d).toFixed(2)}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 45 ) + "px");
    }

    function mousemove(d) {
        div.html(`Percentage data: %${yValue(d).toFixed(2)}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
    }

    function mouseout(d) {
        if (select_bar) {
            for (var i = 0; i < xValue(d); i++) {
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#ff2121").style("opacity", "1")
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#ff2121").style("opacity", "1")
            }
            for (var i = xValue(d); i < d3.max(data, xValue); i++) {
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#3364BC").style("opacity", "1")
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#3364BC").style("opacity", "1")
            }
        } else {
            for (var i = 0; i < select_bar_index; i++) {
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#ff2121").style("opacity", "1")
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#ff2121").style("opacity", "1")
            }
            for (var i = select_bar_index; i < d3.max(data, xValue); i++) {
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#3364BC").style("opacity", "1")
                d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#3364BC").style("opacity", "1")
            }
        }
        select_bar = false
        div.transition()
            .duration('200')
            .style("opacity", 0);
    }

    function pca_click(d) {
        select_bar = true
        select_bar_index = xValue(d)
        for (var i = 0; i < select_bar_index; i++) {
            d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#ff2121").style("opacity", "1")
            d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#ff2121").style("opacity", "1")
        }
        for (var i = select_bar_index; i < d3.max(data, xValue); i++) {
            d3.select(this.parentNode.parentNode.childNodes[i]).select('.rect-bar').style("fill", "#3364BC").style("opacity", "1")
            d3.select(this.parentNode.parentNode.childNodes[i]).select('.circle-point').style("fill", "#3364BC").style("opacity", "1")
        }
        $("#intrinsic-dimentionality-index").html(xValue(d))
        // console.log(xValue(d))

        $(document).ready(function() {
            let di
            di = $("#intrinsic-dimentionality-index").text()
            console.log(di,typeof di)
            $.ajax({
                type: 'POST',
                url: "http://127.0.0.1:5000/id_index",
                data: { 'data': di },
                // dataType: "json",
                success: function(response) {
                    show_table(response["feature_data"])
                    console.log(response["feature_data"])
                    scatterplot_matrix(response["chart_data"])
                    console.log(response["chart_data"])
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    }
    $(document).ready(function() {
        let node_rect_circle = d3.select('.rect-circle-scree-combine').node().childNodes
        for (var i = 0; i < select_bar_index; i++) {
            temp1 = d3.select(node_rect_circle[i].childNodes[0]).style("fill", "#ff2121").style("opacity", "1")
            temp2 = d3.select(node_rect_circle[i].childNodes[1]).style("fill", "#ff2121").style("opacity", "1")
        }
        for (var i = select_bar_index; i < d3.max(data, xValue); i++) {
            d3.select(node_rect_circle[i].childNodes[0]).style("fill", "#3364BC").style("opacity", "1")
            d3.select(node_rect_circle[i].childNodes[1]).style("fill", "#3364BC").style("opacity", "1")
        }
    });
}