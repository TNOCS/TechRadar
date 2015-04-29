var Slide;
(function (Slide) {
    var moduleName = 'techRadar.infoslide';
    Slide.myModule;
    try {
        Slide.myModule = angular.module(moduleName);
    }
    catch (err) {
        Slide.myModule = angular.module(moduleName, []);
    }
    Slide.myModule.directive('infoslide', [
        '$window', '$compile',
        function ($window, $compile) {
            return {
                terminal: false,
                restrict: 'E',
                scope: {},
                templateUrl: 'directives/slide/slide.tpl.html',
                link: function (scope, element, attrs) {
                    scope.onResizeFunction = function () {
                        var filterHeight = 50;
                        var paginationCtrlHeight = 100;
                        var itemHeight = 60;
                        scope.numberOfItems = Math.floor(($window.innerHeight - filterHeight - paginationCtrlHeight) / itemHeight);
                    };
                    scope.onResizeFunction();
                    angular.element($window).bind('resize', function () {
                        scope.onResizeFunction();
                        scope.$apply();
                    });
                },
                replace: true,
                transclude: true,
                controller: Slide.SlideCtrl
            };
        }
    ]);
})(Slide || (Slide = {}));
