var Slide;
(function (Slide) {
    var SlideCtrl = (function () {
        function SlideCtrl($scope, busService) {
            var _this = this;
            this.$scope = $scope;
            this.busService = busService;
            this.public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
            $scope.vm = this;
            this.table = 'Hello';
            busService.subscribe('spreadsheet', function (title, spreadsheet) {
                if (title !== 'newSheet')
                    return;
                _this.showSheet(spreadsheet);
            });
        }
        SlideCtrl.prototype.showSheet = function (spreadsheet) {
            this.table = JSON.stringify(spreadsheet);
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
