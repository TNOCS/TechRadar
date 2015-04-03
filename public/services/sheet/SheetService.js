var csComp;
(function (csComp) {
    var Services;
    (function (Services) {
        var SpreadsheetService = (function () {
            function SpreadsheetService() {
            }
            SpreadsheetService.prototype.loadSheet = function (url, callback) {
                console.log('Initializing tabletop');
                Tabletop.init({
                    key: url,
                    callback: callback,
                    simpleSheet: true
                });
            };
            return SpreadsheetService;
        })();
        Services.SpreadsheetService = SpreadsheetService;
    })(Services = csComp.Services || (csComp.Services = {}));
})(csComp || (csComp = {}));
