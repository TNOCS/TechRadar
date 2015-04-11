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
        .directive('techRadarChart', ['$filter', 'busService',
        function ($filter, bus) {
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
                        var categoriesInfo = {};
                        var periods = [];
                        var periodsInfo = {};
                        technologies.forEach(function (t) {
                            if (categories.indexOf(t.category) < 0) {
                                categories.push(t.category);
                                categoriesInfo[t.category] = { count: 1, startAngle: 0, endAngle: 0, innerRadius: 0, outerRadius: 0 };
                            }
                            else {
                                categoriesInfo[t.category].count++;
                            }
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodsInfo[t.timePeriod] = { count: 1, innerRadius: 0, outerRadius: 0 };
                            }
                            else {
                                periodsInfo[t.timePeriod].count++;
                            }
                        });
                        console.log(categories);
                        console.log(periods);
                        console.log(periodsInfo);
                        var totalTech = technologies.length;
                        var curRadius = innerRadius;
                        var index = 0;
                        var curCount = 0;
                        periods.forEach(function (period) {
                            curCount += periodsInfo[period].count;
                            var innerR = curRadius;
                            var outerR = curRadius = innerRadius + (outerRadius - innerRadius) * curCount / totalTech;
                            periodsInfo[period].innerRadius = innerR;
                            periodsInfo[period].outerRadius = outerR;
                            var arc = d3.svg.arc()
                                .innerRadius(innerR)
                                .outerRadius(outerR)
                                .startAngle(startAngle)
                                .endAngle(endAngle);
                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(index++));
                            chart.append("text")
                                .attr("transform", function (d) { return "translate(" + (curRadius - 5) + ", -5)"; })
                                .attr("dy", "1.2em")
                                .attr("text-anchor", "end")
                                .text(period);
                        });
                        var curAngle = startAngle;
                        var totAngle = endAngle - startAngle;
                        categories.forEach(function (category) {
                            categoriesInfo[category].startAngle = curAngle;
                            if (curAngle > Math.PI || curAngle < 0) {
                                chart.append("text")
                                    .attr("transform", "translate(" + (Math.sin(curAngle) * (outerRadius - 5)) + "," + (-Math.cos(curAngle) * (outerRadius - 5) - 5) + ")" +
                                    "rotate(" + (90 + curAngle * rad2deg) + ")")
                                    .attr("text-anchor", "start")
                                    .attr("dy", Math.cos(curAngle) * 0.6 + "em")
                                    .text(category);
                            }
                            else {
                                chart.append("text")
                                    .attr("transform", "translate(" + (Math.sin(curAngle) * (outerRadius - 5) - 5) + "," + (-Math.cos(curAngle) * (outerRadius - 5) + 3) + ")" +
                                    "rotate(" + (-90 + curAngle * rad2deg) + ")")
                                    .attr("dy", Math.cos(curAngle) * 0.4 + 1 + "em")
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
                            curAngle += totAngle * categoriesInfo[category].count / totalTech;
                            categoriesInfo[category].endAngle = curAngle;
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
                        var elem = chart.selectAll("g")
                            .data(technologies);
                        var elemEnter = elem.enter()
                            .append("g")
                            .attr('class', 'shortTitle')
                            .attr("transform", function (t) {
                            var categoryInfo = categoriesInfo[t.category];
                            var periodInfo = periodsInfo[t.timePeriod];
                            var angle = categoryInfo.startAngle + Math.max(0.3, t.relativeAngle || Math.random()) * (categoryInfo.endAngle - categoryInfo.startAngle);
                            var radius = periodInfo.innerRadius + Math.max(0.1, Math.min(0.9, t.relativeRadius || Math.random())) * (periodInfo.outerRadius - periodInfo.innerRadius);
                            var x = Math.sin(angle) * radius;
                            var y = -Math.cos(angle) * radius;
                            return "translate(" + x + "," + y + ")";
                        })
                            .on("mouseover", function (t, i) {
                            bus.publish('technology', 'selected', t);
                        });
                        var circle = elemEnter.append("circle")
                            .attr("r", 10)
                            .attr("stroke", "black")
                            .attr("fill", function (t) { return t.thumbnail.toLowerCase() === 'new' ? "red" : "black"; });
                        elemEnter.append("text")
                            .attr("dx", function (t, i) { return i > 9 ? -7 : -4; })
                            .attr("dy", 5)
                            .text(function (t, i) { return (i + 1); });
                        elemEnter.append("text")
                            .attr("dx", 14)
                            .attr("dy", 5)
                            .text(function (t, i) { return t.shortTitle; });
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
