var Charts;
(function (Charts) {
    'use strict';
    var moduleName = 'techRadar.techradarChart';
    Charts.myModule;
    try {
        Charts.myModule = angular.module(moduleName);
    }
    catch (err) {
        Charts.myModule = angular.module(moduleName, []);
    }
    Charts.myModule
        .directive('techradarChart', ['$filter',
        function ($filter) {
            return {
                terminal: true,
                restrict: 'EA',
                scope: {
                    timestamps: '=',
                    sensor: '=',
                    showaxis: '=',
                    width: '@',
                    height: '@',
                    margin: '@'
                },
                link: function (scope, element, attrs) {
                    var margin = scope.margin || { top: 15, right: 5, bottom: 0, left: 10 };
                    var width = scope.width || 100;
                    var height = scope.height || 70;
                    var showAxis = typeof scope.showaxis !== 'undefined' && scope.showaxis;
                    var cursorTextHeight = 12;
                    var chart = d3.select(element[0])
                        .append('svg:svg')
                        .attr('width', width)
                        .attr('height', height);
                    var marginAxis = showAxis
                        ? { top: 0, right: 0, bottom: 20, left: 10 }
                        : { top: 0, right: 0, bottom: 0, left: 0 };
                    var x = d3.scale.linear().range([margin.left + marginAxis.left, width - margin.left - margin.right - marginAxis.left - marginAxis.right]);
                    var y = d3.scale.linear().range([height - margin.bottom - marginAxis.bottom, margin.top + marginAxis.top + cursorTextHeight]);
                    var bisect = d3.bisector(function (d) { return d.time; }).left;
                    var line = d3.svg.line()
                        .interpolate("cardinal")
                        .x(function (d) { return x(d.time); })
                        .y(function (d) { return y(d.measurement); });
                    var data = [];
                    for (var i = 0; i < scope.timestamps.length; i++) {
                        data.push({ time: scope.timestamps[i], measurement: scope.sensor[i] });
                    }
                    x.domain(d3.extent(data, function (d) { return d.time; }));
                    y.domain(d3.extent(data, function (d) { return d.measurement; }));
                    var path = chart.append("svg:path")
                        .attr("d", line(data))
                        .attr('class', 'sparkline-path');
                    var measurements = data.map(function (d) { return d.measurement; });
                    if (showAxis) {
                        var strokeLength = 6;
                        var xbor = d3.min(x.range()), xmin = xbor - strokeLength, xmax = d3.max(x.range()), ybor = d3.max(y.range()), ymin = d3.min(y.range()), ymax = ybor + strokeLength;
                        chart.append('line')
                            .attr("x1", xmin)
                            .attr("y1", ymin)
                            .attr("x2", xbor)
                            .attr("y2", ymin)
                            .attr("stroke", "black");
                        chart.append("text")
                            .attr("x", xmin - 2)
                            .attr("y", ymin)
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .text(d3.max(y.domain()));
                        chart.append('line')
                            .attr("x1", xmin)
                            .attr("y1", ybor)
                            .attr("x2", xbor)
                            .attr("y2", ybor)
                            .attr("stroke", "black");
                        chart.append("text")
                            .attr("x", xmin - 2)
                            .attr("y", ybor)
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .text(d3.min(y.domain()));
                        chart.append('line')
                            .attr("x1", xbor)
                            .attr("y1", ymax)
                            .attr("x2", xbor)
                            .attr("y2", ybor)
                            .attr("stroke", "black");
                        chart.append("text")
                            .attr("x", xbor)
                            .attr("y", ymax + 9)
                            .attr("dy", ".35em")
                            .style("text-anchor", "start")
                            .text('');
                        chart.append('line')
                            .attr("x1", xmax)
                            .attr("y1", ymax)
                            .attr("x2", xmax)
                            .attr("y2", ybor)
                            .attr("stroke", "black");
                        chart.append("text")
                            .attr("x", xmax)
                            .attr("y", ymax + 9)
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .text('');
                    }
                    var cursor = chart.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", 0)
                        .attr("y2", 0)
                        .attr("opacity", 0)
                        .attr("stroke", "black");
                    var timestampText = chart.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", ".35em")
                        .attr("opacity", 0)
                        .style("text-anchor", "end")
                        .text("");
                    var measurementText = chart.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", ".35em")
                        .attr("opacity", 0)
                        .text("");
                    var pathEl = path.node();
                    var pathLength = pathEl.getTotalLength();
                    chart
                        .on("mouseout", function () {
                        cursor.attr("opacity", 0);
                        timestampText.attr("opacity", 0);
                        measurementText.attr("opacity", 0);
                    })
                        .on("mousemove", function () {
                        var offsetLeft = element[0].getBoundingClientRect().left;
                        var xpos = d3.event.clientX - offsetLeft;
                        var beginning = xpos, end = pathLength, target;
                        while (true) {
                            target = Math.floor((beginning + end) / 2);
                            var pos = pathEl.getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== xpos) {
                                break;
                            }
                            if (pos.x > xpos)
                                end = target;
                            else if (pos.x < xpos)
                                beginning = target;
                            else
                                break;
                        }
                        var t0 = x.invert(d3.mouse(this)[0]);
                        var i = bisect(data, t0, 1);
                        if (0 < i && i < data.length) {
                            var d0 = data[i - 1];
                            var d1 = data[i];
                            var d = t0 - d0.time > d1.time - t0 ? d1 : d0;
                        }
                        else if (i <= 0)
                            d = data[0];
                        else
                            d = data[data.length - 1];
                        xpos = x(d.time);
                        cursor
                            .attr("x1", xpos)
                            .attr("y1", 0)
                            .attr("x2", xpos)
                            .attr("y2", d3.max(y.range()) + (strokeLength || 0))
                            .attr("opacity", 1);
                        timestampText
                            .attr("x", xpos - 6)
                            .attr("y", 4)
                            .attr("dy", ".35em")
                            .attr("opacity", 1)
                            .text('');
                        measurementText
                            .attr("x", xpos + 6)
                            .attr("y", 4)
                            .attr("dy", ".35em")
                            .attr("opacity", 1)
                            .text(d.measurement);
                    });
                }
            };
        }])
        .directive('barChart', ['$filter',
        function ($filter) {
            return {
                terminal: true,
                restrict: 'EA',
                scope: {
                    data: '=',
                },
                link: function (scope, element, attrs) {
                    var chart = d3.select(element[0]);
                    chart.append("div").attr("class", "chart")
                        .selectAll('div')
                        .data(scope.data).enter().append("div")
                        .transition().ease("elastic")
                        .style("width", function (d) { return d + "%"; })
                        .text(function (d) { return d + "%"; });
                }
            };
        }
    ]);
})(Charts || (Charts = {}));
