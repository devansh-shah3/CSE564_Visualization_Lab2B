function show_table(data) {
    node = document.getElementById("imp-features-table-div")
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    feature_table_values = data
    // console.log(feature_table_values)

    var table = document.createElement("TABLE");
    // var head1 = document.createElement("thead");
    // head1.style.textAlign = "center";
    // head1.setAttribute("colspan", "1");
    // head1.innerHTML="Top 4 attributes based on di"
    // table.appendChild(head1)
    
    table.setAttribute("id", "imp-feature-table");
    document.getElementById("imp-features-table-div").appendChild(table)

    var header = table.createTHead();
    // var row1 = header.insertRow(0);
    // row1.style.align = "center";
    // var head1 = row1.insertCell();
    // row1.innerHTML = "Top 4 attributes based on selected Intrinsic Dimensionality Index"
    var row = header.insertRow(0);
    row.setAttribute("class", "head-table")
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "<b>Features</b>";
    var cell2 = row.insertCell(1);
    cell2.innerHTML = "<b>Sum of Squared Loadings</b>"

    for (var key in feature_table_values) {
        var newRow = table.insertRow(table.length);
        newRow.setAttribute("class", "table-content")
        var cell1 = newRow.insertCell();
        cell1.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);;
        var cell2 = newRow.insertCell();
        cell2.innerHTML = feature_table_values[key];
    }
}