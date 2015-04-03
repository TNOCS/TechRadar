var Slide;
(function (Slide) {
    var SlideCtrl = (function () {
        function SlideCtrl($scope) {
            this.$scope = $scope;
            this.public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
            $scope.vm = this;
            this.init();
            this.table = 'Hello';
        }
        SlideCtrl.prototype.init = function () {
            var _this = this;
            console.log('Initializing tabletop');
            Tabletop.init({
                key: this.public_spreadsheet_url,
                callback: function (data) { return _this.showInfo(data); },
                simpleSheet: true
            });
        };
        SlideCtrl.prototype.showInfo = function (data) {
            var table = JSON.stringify(data);
            this.table = table;
            if (this.$scope.$$phase != '$apply' && this.$scope.$$phase != '$digest') {
                this.$scope.$apply();
            }
            console.log(table);
        };
        SlideCtrl.$inject = [
            '$scope'
        ];
        return SlideCtrl;
    })();
    Slide.SlideCtrl = SlideCtrl;
})(Slide || (Slide = {}));
