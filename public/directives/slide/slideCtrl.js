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
            busService.subscribe('page', function (action) {
                if (action === 'previous' && _this.page > 0)
                    _this.selectPage(_this.page - 1);
                if (action === 'next' && _this.technology.content.length - 1 > _this.page)
                    _this.selectPage(_this.page + 1);
                5;
            });
        }
        SlideCtrl.prototype.selectPage = function (id) {
            var _this = this;
            this.activeContent = null;
            5;
            if (!this.technology.content)
                return;
            this.page = id;
            this.technology.content.forEach(function (c) {
                c.isSelected = c.id === id;
                if (c.isSelected)
                    _this.activeContent = c;
            });
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        };
        SlideCtrl.prototype.showSlide = function (technology) {
            if (!technology) {
                console.log("ERROR: Technology is empty");
                return;
            }
            this.technology = technology;
            this.activeContent = null;
            if (this.technology.content.length > 0) {
                this.selectPage(0);
            }
            if (!technology.title) {
                console.log('Missing title:');
                console.log(JSON.stringify(technology));
                return;
            }
            this.title = technology.title;
            this.subTitle = technology.subTitle;
            this.text = technology.text;
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        };
        SlideCtrl.$inject = [
            '$scope',
            'busService'
        ];
        return SlideCtrl;
    }());
    Slide.SlideCtrl = SlideCtrl;
})(Slide || (Slide = {}));
