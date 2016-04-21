var csComp;
(function (csComp) {
    var Services;
    (function (Services) {
        var SpreadsheetService = (function () {
            function SpreadsheetService() {
            }
            SpreadsheetService.prototype.loadTechnologies = function (url, callback) {
                var _this = this;
                this.loadSheet(url, function (spreadsheet) {
                    _this.technologies = [];
                    var id = 1;
                    var page = 0;
                    var technology;
                    spreadsheet.forEach(function (row) {
                        if (row.Category !== '') {
                            var deltaTimeString = row.DeltaTime;
                            var priority = parseInt(row.Relevance.toString(), 10);
                            var color;
                            switch (priority) {
                                case 1:
                                    color = '#F39092';
                                    break;
                                case 2:
                                    color = '#F5DC8F';
                                    break;
                                case 3:
                                    color = '#9EBACB';
                                    break;
                                case 4:
                                    color = '#DFE0DC';
                                    break;
                                default:
                                    color = 'white';
                                    break;
                            }
                            var deltaTime = 0;
                            if (typeof deltaTimeString === 'string') {
                                deltaTime = +deltaTimeString.replace(',', '.');
                            }
                            else {
                                deltaTime = deltaTimeString;
                            }
                            page = 0;
                            technology = new TechRadar.Technology(id++, priority, row.Category, row.Thumbnail, row.TimeCategory, deltaTime, row.ShortTitle, row.Title, row.Subtitle, row.Text, color);
                            _this.technologies.push(technology);
                        }
                        if (row.ContentType === '')
                            row.ContentType = 'markdown';
                        if (row.Content !== '') {
                            var c = new TechRadar.Content(page++, row.ContentType, row.Content, row.Subtitle);
                            if (c.contentType.toLowerCase() === 'youtube') {
                                c.videoUrl = c.content.indexOf('http') > 0
                                    ? c.content
                                    : 'http://www.youtube.com/embed/' + c.content + '?rel=0&autoplay=1';
                            }
                            ;
                            technology.content.push(c);
                        }
                    });
                    callback();
                });
            };
            SpreadsheetService.prototype.loadSheet = function (url, callback) {
                console.log('Initializing tabletop');
                Tabletop.init({
                    key: url,
                    callback: callback,
                    simpleSheet: true
                });
            };
            return SpreadsheetService;
        }());
        Services.SpreadsheetService = SpreadsheetService;
    })(Services = csComp.Services || (csComp.Services = {}));
})(csComp || (csComp = {}));
