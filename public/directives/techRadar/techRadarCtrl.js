var TechRadar;
(function (TechRadar) {
    var TechRadarCtrl = (function () {
        function TechRadarCtrl($scope, busService) {
            var _this = this;
            this.$scope = $scope;
            this.busService = busService;
            $scope.vm = this;
            busService.subscribe('spreadsheet', function (title, spreadsheet) {
                if (title !== 'newSheet')
                    return;
                _this.parseSheet(spreadsheet);
            });
        }
        TechRadarCtrl.prototype.parseSheet = function (spreadsheet) {
            var _this = this;
            if (!spreadsheet)
                return;
            this.technologies = [];
            spreadsheet.forEach(function (row) {
                // console.log(row.Category);
                // console.log(row.Title);
                var deltaTimeString = row.DeltaTime;
                var deltaCatString = row.DeltaCategory;
                var deltaTime = 0, deltaCategory = 0;
                if (typeof deltaTimeString === 'string') {
                    deltaTime = +deltaTimeString.replace(',', '.');
                }
                else {
                    deltaTime = deltaTimeString;
                }
                if (typeof deltaCatString === 'string') {
                    deltaCategory = +deltaCatString.replace(',', '.');
                }
                else {
                    deltaCategory = deltaCatString;
                }
                var technology = new TechRadar.Technology(row.Category, row.Thumbnail, row.TimeCategory, deltaTime, deltaCategory, row.ShortTitle, row.Title, row.SubTitle, row.Text, row.Media);
                _this.technologies.push(technology);
            });
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        };
        TechRadarCtrl.$inject = [
            '$scope',
            'busService'
        ];
        return TechRadarCtrl;
    })();
    TechRadar.TechRadarCtrl = TechRadarCtrl;
})(TechRadar || (TechRadar = {}));
