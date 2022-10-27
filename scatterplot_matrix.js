function scatterplot_matrix(data) {
    data = d3.entries(data)
    console.log(d3.legend)
    n = 4;
    var width = 900,
        size = (200),
        padding = 50;

    const AxisTickFormat = number =>
        d3.format('.3s')(number)
        .replace('K', 'M');

    var xScale = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var yScale = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .tickFormat(AxisTickFormat)
        .scale(xScale)
        .ticks(3);

    var yAxis = d3.axisLeft()
        .tickFormat(AxisTickFormat)
        .scale(yScale)
        .ticks(3);

    traits = []
    for (key in data[0].value) {
        if (key != "label") {
            traits.push(key)
        }
    }

    var domainByTrait = {};

    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) {
            return d.value[trait];
        });
    });
    color_pick = ["#3400d1", "#ff1717", "#ffd20a", "#0de002",  "black", "grey","brown", "slateblue", "darkgreen"]
    keys = ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"]
    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    color_scale = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(color_pick);

    d3.select("#scatterplot-matrix").selectAll("*").remove()

    var svg = d3.select("#scatterplot-matrix").append("svg")
        .attr("width", width + 20)
        .attr("height", width + 30)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) { return 20 + i * 100 })
        .attr("cy", 8) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d, i) { return color_pick[i] })

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", function(d, i) { return 30 + i * 100 })
        .attr("y", 8) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return color_pick[d] })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    svg.append('text')
        .attr('fill', 'black')
        .attr('y', -6)
        .attr('x', width / 2.8)
        .text("Scatterplot matrix")
        .style("font-size", "2.5em")

    svg.selectAll(".xAxis")
        .data(traits)
        .enter().append("g")
        .attr("class", "axis-scatterplotmatrix")
        .attr("transform", function(d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function(d) {
            xScale.domain(domainByTrait[d]).nice();
            d3.select(this).call(xAxis);
        });

    svg.selectAll(".yAxis")
        .data(traits)
        .enter().append("g")
        .attr("class", "axis-scatterplotmatrix")
        .attr("transform", function(d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function(d) {
            yScale.domain(domainByTrait[d]).nice();
            d3.select(this).call(yAxis);
        });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
        })
        .each(plot);

    cell.filter(function(d) {
            return d.i === d.j;
        }).append("text")
        .attr("x", size / 2)
        .attr("y", size / 2)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.x;
        });

    function plot(p) {
        var cell = d3.select(this);

        xScale.domain(domainByTrait[p.x]);
        yScale.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .classed("diagonal", function(d) {
                return d.i === d.j;
            })
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.filter(function(d) {
                return d.i !== d.j;
            })
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) {
                return xScale(d.value[p.x]);
            })
            .attr("cy", function(d) {
                return yScale(d.value[p.y]);
            })
            .attr("r", 2.5)
            .style("fill", function(d) {
                return color_pick[d.value.label];
            });
    }
    function cross(a, b) {
        var c = [],
            n = a.length,
            m = b.length,
            i, j;
        for (i = -1; ++i < n;)
            for (j = -1; ++j < m;) c.push({
                x: a[i],
                i: i,
                y: b[j],
                j: j
            });
        return c;
    }
}