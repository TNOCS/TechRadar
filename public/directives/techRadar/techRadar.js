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
    var RadarRing = (function () {
        function RadarRing() {
        }
        return RadarRing;
    })();
    TechRadar.RadarRing = RadarRing;
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
                scope: {
                    technologies: '=',
                    startAngle: '@',
                    endAngle: '@',
                    width: '@',
                    height: '@',
                    margin: '@'
                },
                controller: TechRadar.TechRadarCtrl,
                link: function (scope, element, attrs) {
                    var margin = scope.margin || { top: 15, right: 5, bottom: 0, left: 10 };
                    var width = scope.width || 100;
                    var height = scope.height || 70;
                    var startAngle = scope.startAngle || -Math.PI / 2;
                    var endAngle = scope.endAngle || Math.PI / 2;
                    var cursorTextHeight = 12;
                    var actualWidth = width - margin.left - margin.right;
                    var actualHeight = height - margin.top - margin.bottom;
                    var outerRadius = Math.min(actualWidth, actualHeight) / 2;
                    var chart = d3.select(element[0])
                        .append('svg:svg')
                        .attr('width', actualWidth)
                        .attr('height', actualHeight)
                        .append("g")
                        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
                    scope.render = function (technologies) {
                        var color = d3.scale.category20c();
                        var categories = [];
                        var periods = [];
                        var periodCounts = {};
                        technologies.forEach(function (t) {
                            if (categories.indexOf(t.category) < 0)
                                categories.push(t.category);
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
                        var radarRings = [];
                        var totalTech = technologies.length;
                        var curRadius = 0;
                        var index = 0;
                        var curCount = 0;
                        periods.forEach(function (period) {
                            curCount += periodCounts[period];
                            var radarRing = new RadarRing();
                            radarRing.title = period;
                            radarRing.innerRadius = curRadius;
                            radarRing.outerRadius = curRadius = outerRadius * curCount / totalTech;
                            var arc = d3.svg.arc()
                                .innerRadius(radarRing.innerRadius)
                                .outerRadius(radarRing.outerRadius)
                                .startAngle(startAngle)
                                .endAngle(endAngle);
                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(index++));
                        });
                        chart.data([radarRings]);
                        var arc = d3.svg.arc().outerRadius(outerRadius);
                        var pie = d3.layout.pie();
                        console.log('Technologies: ');
                        console.log(scope.technologies);
                        chart.append("text")
                            .attr("x", 100)
                            .attr("y", 100)
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .text('Hello world');
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
