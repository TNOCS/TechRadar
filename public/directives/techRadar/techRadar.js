var TechRadar;
(function (TechRadar) {
    'use strict';
    var moduleName = 'techRadar.techRadarChart';
    TechRadar.myModule;
    try {
        TechRadar.myModule = angular.module(moduleName);
    }
    catch (err) {
        TechRadar.myModule = angular.module(moduleName, []);
    }
    var RadarSection = (function () {
        function RadarSection() {
        }
        return RadarSection;
    })();
    TechRadar.RadarSection = RadarSection;
    TechRadar.myModule
        .directive('techRadarChart', ['$filter',
        function ($filter) {
            return {
                terminal: true,
                restrict: 'EA',
                transclude: true,
                scope: {
                    technologies: '=',
                    startangle: '@',
                    endangle: '@',
                    radius: '@',
                    margin: '@'
                },
                controller: TechRadar.TechRadarCtrl,
                link: function (scope, element, attrs) {
                    var rad2deg = 180 / Math.PI;
                    var padding = scope.padding || { top: 15, right: 5, bottom: 0, left: 10 };
                    var outerRadius = scope.radius || 100;
                    var startAngle = scope.startangle ? scope.startangle / rad2deg : -Math.PI / 2;
                    var endAngle = scope.endangle ? scope.endangle / rad2deg : Math.PI / 2;
                    var cursorTextHeight = 12;
                    var actualWidth = 2 * outerRadius + padding.left + padding.right;
                    var actualHeight = 2 * outerRadius + padding.top + padding.bottom;
                    var chart = d3.select(element[0])
                        .append('svg:svg')
                        .attr('width', actualWidth)
                        .attr('height', actualHeight)
                        .append("g")
                        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
                    scope.render = function (technologies) {
                        var color = d3.scale.category20c();
                        var categories = [];
                        var categoryCounts = {};
                        var periods = [];
                        var periodCounts = {};
                        technologies.forEach(function (t) {
                            if (categories.indexOf(t.category) < 0) {
                                categories.push(t.category);
                                categoryCounts[t.category] = 1;
                            }
                            else {
                                categoryCounts[t.category]++;
                            }
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodCounts[t.timePeriod] = 1;
                            }
                            else {
                                periodCounts[t.timePeriod]++;
                            }
                        });
                        console.log(categories);
                        console.log(periods);
                        console.log(periodCounts);
                        var totalTech = technologies.length;
                        var curRadius = 0;
                        var index = 0;
                        var curCount = 0;
                        periods.forEach(function (period) {
                            curCount += periodCounts[period];
                            var innerR = curRadius;
                            var outerR = curRadius = outerRadius * curCount / totalTech;
                            var arc = d3.svg.arc()
                                .innerRadius(innerR)
                                .outerRadius(outerR)
                                .startAngle(startAngle)
                                .endAngle(endAngle);
                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(index++));
                            chart.append("text")
                                .attr("transform", function (d) { return "translate(" + (curRadius - 10) + ", -5)"; })
                                .attr("text-anchor", "end")
                                .text(period);
                        });
                        var curAngle = startAngle;
                        var totAngle = endAngle - startAngle;
                        categories.forEach(function (category) {
                            if (curAngle < 0) {
                                chart.append("text")
                                    .attr("transform", "translate(" + (Math.sin(curAngle) * (outerRadius - 5) + 5) + "," + (-Math.cos(curAngle) * (outerRadius - 5) - 5) + ")" +
                                    "rotate(" + (90 + curAngle * rad2deg) + ")")
                                    .attr("text-anchor", "start")
                                    .text(category);
                            }
                            else {
                                chart.append("text")
                                    .attr("transform", "translate(" + (Math.sin(curAngle) * (outerRadius - 5) - 5) + "," + (-Math.cos(curAngle) * (outerRadius - 5) + 5) + ")" +
                                    "rotate(" + (-90 + curAngle * rad2deg) + ")")
                                    .attr("dy", "1.2em")
                                    .attr("text-anchor", "end")
                                    .text(category);
                            }
                            var x1 = +Math.sin(curAngle) * outerRadius;
                            var y1 = -Math.cos(curAngle) * outerRadius;
                            curAngle += totAngle * categoryCounts[category] / totalTech;
                            var x2 = +Math.sin(curAngle) * outerRadius;
                            var y2 = -Math.cos(curAngle) * outerRadius;
                            chart.append('line')
                                .attr("x1", 0)
                                .attr("y1", 0)
                                .attr("x2", x1)
                                .attr("y2", y1)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                            chart.append('line')
                                .attr("x1", 0)
                                .attr("y1", 0)
                                .attr("x2", x2)
                                .attr("y2", y2)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                        });
                    };
                    scope.$watch('technologies', function (newVal, oldVal) {
                        if (newVal !== oldVal)
                            scope.render(scope.technologies);
                    });
                    if (scope.technologies)
                        scope.render(scope.technologies);
                }
            };
        }]);
})(TechRadar || (TechRadar = {}));
