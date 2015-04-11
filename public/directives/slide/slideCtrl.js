var Slide;
(function (Slide) {
    var SlideCtrl = (function () {
        function SlideCtrl($scope, busService) {
            var _this = this;
            this.$scope = $scope;
            this.busService = busService;
            $scope.vm = this;
            busService.subscribe('technology', function (title, technology) {
                if (title !== 'selected')
                    return;
                _this.showSlide(technology);
            });
        }
        SlideCtrl.prototype.showSlide = function (technology) {
            this.technology = technology;
            this.title = technology.title;
            this.subTitle = technology.subTitle;
            this.text = technology.text;
            this.media = technology.media;
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        };
        SlideCtrl.$inject = [
            '$scope',
            'busService'
        ];
        return SlideCtrl;
    })();
    Slide.SlideCtrl = SlideCtrl;
})(Slide || (Slide = {}));
