var TechRadar;
(function (TechRadar) {
    var Technology = (function () {
        function Technology(category, thumbnail, timePeriod, relativeRadius, relativeAngle, shortTitle, title, subTitle, text, media) {
            this.category = category;
            this.thumbnail = thumbnail;
            this.timePeriod = timePeriod;
            this.relativeRadius = relativeRadius;
            this.relativeAngle = relativeAngle;
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
