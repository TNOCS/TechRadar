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
                    innerradius: '@',
                    margin: '@'
                },
                controller: TechRadar.TechRadarCtrl,
                link: function (scope, element, attrs) {
                    var rad2deg = 180 / Math.PI;
                    var padding = scope.padding || { top: 15, right: 5, bottom: 0, left: 10 };
                    var outerRadius = scope.radius || 100;
                    var innerRadius = scope.innerradius || 75;
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
                        var categoryInfo = {};
                        var periods = [];
                        var periodInfo = {};
                        technologies.forEach(function (t) {
                            if (categories.indexOf(t.category) < 0) {
                                categories.push(t.category);
                                categoryInfo[t.category] = { count: 1, startAngle: 0, endAngle: 0, innerRadius: 0, outerRadius: 0 };
                            }
                            else {
                                categoryInfo[t.category].count++;
                            }
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodInfo[t.timePeriod] = { count: 1, innerRadius: 0, outerRadius: 0 };
                            }
                            else {
                                periodInfo[t.timePeriod].count++;
                            }
                        });
                        console.log(categories);
                        console.log(periods);
                        console.log(periodInfo);
                        var totalTech = technologies.length;
                        var curRadius = innerRadius;
                        var index = 0;
                        var curCount = 0;
                        periods.forEach(function (period) {
                            curCount += periodInfo[period].count;
                            var innerR = curRadius;
                            var outerR = curRadius = innerRadius + (outerRadius - innerRadius) * curCount / totalTech;
                            periodInfo[period].innerRadius = innerR;
                            periodInfo[period].outerRadius = outerR;
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
                            categoryInfo[category].startAngle = curAngle;
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
                            var x0 = +Math.sin(curAngle) * innerRadius, y0 = -Math.cos(curAngle) * innerRadius;
                            var x1 = +Math.sin(curAngle) * outerRadius, y1 = -Math.cos(curAngle) * outerRadius;
                            chart.append('line')
                                .attr("x1", x0)
                                .attr("y1", y0)
                                .attr("x2", x1)
                                .attr("y2", y1)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                            curAngle += totAngle * categoryInfo[category].count / totalTech;
                            categoryInfo[category].endAngle = curAngle;
                            var x0 = +Math.sin(curAngle) * innerRadius, y0 = -Math.cos(curAngle) * innerRadius;
                            var x2 = +Math.sin(curAngle) * outerRadius, y2 = -Math.cos(curAngle) * outerRadius;
                            chart.append('line')
                                .attr("x1", x0)
                                .attr("y1", y0)
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
