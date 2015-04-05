var TechRadar;
(function (TechRadar) {
    var Technology = (function () {
        function Technology(category, thumbnail, timePeriod, relativeTime, shortTitle, title, subTitle, text, media) {
            this.category = category;
            this.thumbnail = thumbnail;
            this.timePeriod = timePeriod;
            this.relativeTime = relativeTime;
            this.shortTitle = shortTitle;
            this.title = title;
            this.subTitle = subTitle;
            this.text = text;
            this.media = media;
        }
        return Technology;
    })();
    TechRadar.Technology = Technology;
})(TechRadar || (TechRadar = {}));
