module TechRadar {
    'use strict'
    /**
      * Config
      */
    var moduleName = 'techRadar.techRadarChart';

    /**
      * Module
      */
    export var myModule;
    try {
        myModule = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        myModule = angular.module(moduleName, []);
    }

    declare var String;

    export interface ITechRadarChartScope extends ng.IScope {
        technologies: Technology[];
        startAngle? : number;
        endAngle?   : number;
        width?      : number;
        height?     : number;
        margin?     : { top: number; right: number; bottom: number; left: number; };
        render(technologies: Technology[]): void;
    }

    export class RadarRing {
        title      : string;
        innerRadius: number;
        outerRadius: number;
    }

    export class RadarSection {
        title     : string;
        startAngle: number;
        endAngle  : number;
    }

    /**
      * Directive to create a sparkline chart.
      *
      * @seealso: http://odiseo.net/angularjs/proper-use-of-d3-js-with-angular-directives
      * @seealso: http://cmaurer.github.io/angularjs-nvd3-directives/sparkline.chart.html
      * @seealso: http://www.tnoda.com/blog/2013-12-19
      */
    myModule
        .directive('techRadarChart', ['$filter',
        function ($filter): ng.IDirective {
            return {
                terminal: true,       // do not compile any other internal directives
                restrict: 'EA',       // E = elements, other options are A=attributes and C=classes
                scope: {
                    technologies: '=',  // = means that we use angular to evaluate the expression,
                    startAngle  : '@',
                    endAngle    : '@',
                    width       : '@',  // the value is used as is
                    height      : '@',
                    margin      : '@'
                },
                controller: TechRadarCtrl,
                //controller: [
                //    '$scope',
                //    '$element',
                //    '$attrs',
                //    function ($scope, $element, $attrs) {
                //        $scope.d3Call    = function (data, chart) {
                //            ChartHelpers.checkElementID($scope, $attrs, $element, chart, data);
                //        };
                //    }
                //],
                link: function (scope: ITechRadarChartScope, element, attrs) {
                    var margin           = scope.margin     || { top: 15, right: 5, bottom: 0, left: 10 };
                    var width            = scope.width      || 100;
                    var height           = scope.height     || 70;
                    var startAngle       = scope.startAngle || -Math.PI/2;
                    var endAngle         = scope.endAngle   || Math.PI/2;
                    var cursorTextHeight = 12;// + (showAxis ? 5 : 0); // leave room for the cursor text (timestamp | measurement)

                    var actualWidth  = width  - margin.left - margin.right;
                    var actualHeight = height - margin.top  - margin.bottom;
                    var outerRadius  = Math.min(actualWidth, actualHeight) / 2;

                    var chart = d3.select(element[0])
                        .append('svg:svg')
                        .attr('width', actualWidth)
                        .attr('height', actualHeight)
                        .append("g")
                        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

                    scope.render = function(technologies: Technology[]) {
                        var color = d3.scale.category20c();

                        var categories   : string[] = [];
                        var periods      : string[] = [];
                        var periodCounts : { [period: string] : number } = {};

                        technologies.forEach((t) => {
                            if (categories.indexOf(t.category) < 0) categories.push(t.category);
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodCounts[t.timePeriod] = 1;
                            } else {
                                periodCounts[t.timePeriod]++;
                            }
                        });

                        console.log(categories);
                        console.log(periods);
                        console.log(periodCounts);

                        // Draw the rings
                        var totalTech   = technologies.length;
                        var curRadius   = 0;
                        var index       = 0;
                        var curCount    = 0;
                        periods.forEach((period) => {
                            curCount += periodCounts[period];
                            var radarRing = new RadarRing();
                            radarRing.title       = period;
                            radarRing.innerRadius = curRadius;
                            radarRing.outerRadius = curRadius = outerRadius * curCount / totalTech;

                            var arc = d3.svg.arc()
                                .innerRadius(radarRing.innerRadius)
                                .outerRadius(radarRing.outerRadius)
                                .startAngle(startAngle) //converting from degs to radians
                                .endAngle(endAngle) //just radians

                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(index++));

                            chart.append("text")
                                .attr("transform", function(d){ return "translate(" + (curRadius - 10) + ", -5)";})
                                .attr("text-anchor", "end")
                                .text(period);
                        });
                        // console.log('Technologies: ')
                        // console.log(scope.technologies);
                    };

                    scope.$watch('technologies', function (newVal, oldVal) {
                        if (newVal !== oldVal) scope.render(scope.technologies);
                    });

                    if (scope.technologies) scope.render(scope.technologies);
                }
            }
        }])
}
