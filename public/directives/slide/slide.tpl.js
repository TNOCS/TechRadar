var slide;
(function (slide) {
    slide.html = '<div class="slide">    <h1 class="center">{{vm.title}}</h1>    <h2 class="center">{{vm.subTitle}}</h2>    <p>        {{vm.text}}    </p>    <!-- <img ng-src="vm.media" alt="{{vm.title}}" /> --></div>';
})(slide || (slide = {}));
