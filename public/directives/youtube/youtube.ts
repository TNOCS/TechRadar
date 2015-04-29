module Youtube {
    export interface IYoutubeScope extends ng.IScope {
        url: string;
        onResize: Function;
    }

    /**
      * Config
      */
    var moduleName = 'techRadar.youtube';

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

    /**
      * Directive to display a youtube video.
      * See also: http://plnkr.co/edit/0N728e9SAtXg3uBvuXKF?p=preview
      */
    myModule.directive('youtube', [
        '$window', '$compile',
        function ($window, $compile)  : ng.IDirective {
            return {
                restrict  : 'EA',    // E = elements, other options are A=attributes and C=classes
                scope: {
                    url: '='
                },
                template: '<iframe style="overflow:hidden;height:auto;width:100%" width="100%" height="auto" src="{{url}}" frameborder="0" allowfullscreen></iframe>',
                link: (scope: IYoutubeScope, element, attrs) => {
                    scope.onResize = () => {
                        var video = element[0],
                            parent = element.parent();

                        var newWidth  = parent.width(),
                            newHeight = newWidth * 9 / 16;

                        if (newHeight < parent.height()) {
                            newHeight = parent.height();
                            newWidth  = newHeight * 16 / 9;
                        }

                        // Resize video according to the aspect ratio
                        video.style.width  = newWidth  + 'px';
                        video.style.height = newHeight + 'px';
                        // var margin = Math.min(50, parent.height() - newHeight);
                        // if (margin > 0) video.style.marginTop = margin + 'px';
                    };

                    // Call to the function when the page is first loaded
                    scope.onResize();

                    angular.element($window).bind('resize', () => {
                        scope.onResize();
                        scope.$apply();
                    });
                },
                replace: true    // Remove the directive from the DOM
            }
        }
    ]);
}
