var Slide;
(function (Slide) {
    var InfoSlide = (function () {
        function InfoSlide(title, subTitle, text, media) {
            this.title = title;
            this.subTitle = subTitle;
            this.text = text;
            this.media = media;
        }
        return InfoSlide;
    })();
    Slide.InfoSlide = InfoSlide;
})(Slide || (Slide = {}));
