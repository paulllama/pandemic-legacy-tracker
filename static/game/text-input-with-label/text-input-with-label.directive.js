angular.module("text-input-with-label.directive", []).directive("textInputWithLabel", function() {
    return {
        restrict: "E",
        templateUrl: "/static/game/text-input-with-label/text-input-with-label.html",
        scope: {
            ngModel: "=",
            label: "@",
            cssClass: "@"
        },
    };
});