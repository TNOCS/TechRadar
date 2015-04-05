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
    TechRadar.myModule
        .directive('techRadarChart', ['$filter',
        function ($filter) {
            return {
                terminal: true,
                restrict: 'EA',
                scope: {
                    technologies: '=',
                    width: '@',
                    height: '@',
                    margin: '@'
                },
                controller: TechRadar.TechRadarCtrl,
                link: function (scope, element, attrs) {
                    var margin = scope.margin || { top: 15, right: 5, bottom: 0, left: 10 };
                    var width = scope.width || 100;
                    var height = scope.height || 70;
                    var cursorTextHeight = 12;
                    var chart = d3.select(element[0])
                        .append('svg:svg')
                        .attr('width', width)
                        .attr('height', height);
                    scope.render = function (technologies) {
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
