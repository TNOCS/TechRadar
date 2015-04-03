var csComp;
(function (csComp) {
    var Services;
    (function (Services) {
        var SheetService = (function () {
            function SheetService() {
                this.public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
                this.loadSheet(this.public_spreadsheet_url);
            }
            SheetService.prototype.loadSheet = function (url) {
                var _this = this;
                console.log('Initializing tabletop');
                Tabletop.init({
                    key: url,
                    callback: function (data) { return _this.showInfo(data); },
                    simpleSheet: true
                });
            };
            SheetService.prototype.showInfo = function (data) {
                var table = JSON.stringify(data);
                console.log(table);
            };
            return SheetService;
        })();
        Services.SheetService = SheetService;
    })(Services = csComp.Services || (csComp.Services = {}));
})(csComp || (csComp = {}));
