/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2598765432098765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Update Delivery Date Line Item"], "isController": false}, {"data": [0.44594594594594594, 500, 1500, "Search By PO Approver"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "ReOpen PO LineItem"], "isController": false}, {"data": [0.45348837209302323, 500, 1500, "Close PO LineItem"], "isController": false}, {"data": [0.0, 500, 1500, "Search By Invoice Approver"], "isController": false}, {"data": [0.0, 500, 1500, "Search By Date Range"], "isController": false}, {"data": [0.22, 500, 1500, "ReOpen PO"], "isController": false}, {"data": [0.11666666666666667, 500, 1500, "Search By Company Code"], "isController": false}, {"data": [0.475, 500, 1500, "Decrease Price Line Item"], "isController": false}, {"data": [0.5, 500, 1500, "Load PO Line Item Data"], "isController": false}, {"data": [0.0, 500, 1500, "Search By PO Owner"], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "Load PO Header And Line Item Data"], "isController": false}, {"data": [0.0, 500, 1500, "Close PO"], "isController": false}, {"data": [0.49, 500, 1500, "Update PO Invoice Approver"], "isController": false}, {"data": [0.4605263157894737, 500, 1500, "Decrease Quantity Line Item"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 810, 0, 0.0, 3057.124691358028, 826, 42882, 1371.0, 7201.699999999999, 10044.4, 13642.13, 6.084004326403077, 64.96326477248829, 13.591614613064836], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Update Delivery Date Line Item", 35, 0, 0.0, 1026.9714285714285, 924, 1404, 998.0, 1153.8, 1228.799999999999, 1404.0, 0.5136408329786766, 0.312999882596381, 1.205866443294052], "isController": false}, {"data": ["Search By PO Approver", 74, 0, 0.0, 1274.3378378378375, 1131, 2049, 1210.5, 1539.5, 1662.75, 2049.0, 0.659771754636234, 0.43878269603691156, 1.4865151485600927], "isController": false}, {"data": ["ReOpen PO LineItem", 48, 0, 0.0, 1652.2083333333335, 862, 5994, 1620.0, 2663.4, 3966.95, 5994.0, 0.5834305717619602, 0.4340594309120964, 1.3108670781067677], "isController": false}, {"data": ["Close PO LineItem", 43, 0, 0.0, 1137.5348837209303, 953, 3009, 1038.0, 1489.2000000000005, 1903.9999999999998, 3009.0, 0.5425251391009223, 0.4113787550940587, 1.2179462663546097], "isController": false}, {"data": ["Search By Invoice Approver", 74, 0, 0.0, 3931.8783783783774, 3111, 13710, 3497.5, 5220.0, 6418.5, 13710.0, 0.6061052821256275, 3.625505578318631, 1.370335766456987], "isController": false}, {"data": ["Search By Date Range", 69, 0, 0.0, 11396.782608695652, 8504, 42882, 10817.0, 13655.0, 16373.0, 42882.0, 0.5695277871781961, 36.539895576254814, 1.2664206751999538], "isController": false}, {"data": ["ReOpen PO", 50, 0, 0.0, 2832.7399999999993, 863, 7679, 2662.0, 6145.799999999998, 7173.349999999999, 7679.0, 0.5600734816407913, 0.3620568768622443, 1.2328179957210386], "isController": false}, {"data": ["Search By Company Code", 60, 0, 0.0, 3879.7666666666664, 865, 10051, 3385.0, 6373.099999999999, 7038.549999999998, 10051.0, 0.6124198750663454, 27.369476817993917, 1.3779447188992775], "isController": false}, {"data": ["Decrease Price Line Item", 40, 0, 0.0, 1052.725, 929, 1936, 980.0, 1303.4999999999998, 1544.7999999999993, 1936.0, 0.5140925623658539, 0.3524345495906538, 1.1862786285295668], "isController": false}, {"data": ["Load PO Line Item Data", 53, 0, 0.0, 902.0943396226414, 826, 1324, 871.0, 995.0, 1083.4999999999998, 1324.0, 0.5633024402686846, 1.509318819217116, 1.1645617832507866], "isController": false}, {"data": ["Search By PO Owner", 75, 0, 0.0, 4631.506666666666, 3855, 9893, 4146.0, 6265.400000000005, 7559.8, 9893.0, 0.620275567758903, 4.269401961311345, 1.3938997319375754], "isController": false}, {"data": ["Load PO Header And Line Item Data", 52, 0, 0.0, 982.3846153846155, 829, 1728, 893.5, 1336.3, 1482.7999999999993, 1728.0, 0.5612338510355844, 1.667122135144032, 1.164669856885368], "isController": false}, {"data": ["Close PO", 49, 0, 0.0, 3738.632653061225, 1642, 7266, 3567.0, 6415.0, 6528.5, 7266.0, 0.5853192378904617, 0.350717930627725, 1.2872450427044138], "isController": false}, {"data": ["Update PO Invoice Approver", 50, 0, 0.0, 1039.8199999999997, 916, 1788, 1026.0, 1120.2, 1166.6, 1788.0, 0.5546557806225457, 0.3358267421738069, 1.2940162694406852], "isController": false}, {"data": ["Decrease Quantity Line Item", 38, 0, 0.0, 1118.2894736842104, 925, 1987, 1022.0, 1343.8000000000009, 1912.8999999999999, 1987.0, 0.4935513618121128, 0.3507827010247685, 1.1393842216175498], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 810, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
