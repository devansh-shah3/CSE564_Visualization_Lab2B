let select_bar = false
let select_bar_index = 0
function home_display() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/init_home",
        data: {},
        success: function(response) {
            console.log()
        },
        error: function(error) {
            console.log(error);
        }
    });
}
$(document).ready(function() {
    $(".home").show()
    $(".scree-plot").hide()
    $(".biplot").hide()
    $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
    $(".mds").hide()
    $(".mds-corr").hide()
    $(".pcp").hide()
    d3.select("#reset-pcp-and-mds").selectAll("*").remove()

    home_display()
    $("#nav-home").click(function() {
        $(".home").show()
        $(".scree-plot").hide()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()
        d3.select("#reset-pcp-and-mds").selectAll("*").remove()
    });

    $("#nav-screeplot").click(function() {
        $(".home").hide()
        $(".scree-plot").show()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()
        d3.select("#reset-pcp-and-mds").selectAll("*").remove()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/screeplot",
            data: {},
            success: function(response) {
                scree_plot(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#nav-elbow").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").show()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()
        d3.select("#reset-pcp-and-mds").selectAll("*").remove()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/elbow",
            data: {},
            dataType: 'json',
            success: function(response) {
                //console.log(response);
                draw_line_plot(response)
            },
            error: function(error) {
                console.log("abbc");
                console.log(error);
            }
        });
    });

    $("#nav-biplot").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").show()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()
        d3.select("#reset-pcp-and-mds").selectAll("*").remove()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/biplot",
            data: null,
            success: function(response) {
                biplot(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
//lab2 part2
    $("#nav-mds").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
        $(".mds").show()
        $(".mds-corr").hide()
        $(".pcp").hide()
        d3.select("#reset-pcp-and-mds").selectAll("*").remove()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/mds",
            data: null,
            success: function(response) {
                mds_data_scatterplot(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#nav-mds-corr").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
        $(".mds").hide()
        $(".mds-corr").show()
        $(".pcp").hide()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/pcp",
            data: null,
            success: function(response) {
                plot_mds_variables(response)
                default_pcp(response)

            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#nav-pcp").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".col-md-10 col-xl-10 col-lg-10 col-sm-12 col-xs-12").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").show()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/pcp",
            data: null,
            success: function(response) {
                default_pcp(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#reset-pcp-and-mds").click(function() {
        d3.select("#mds-scatterplot-graph-attr").selectAll("*").remove()
        d3.select("#pcp-graph").selectAll("*").remove()
        
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/pcp",
            data: null,
            success: function(response) {
                plot_mds_variables(response)
                default_pcp(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});