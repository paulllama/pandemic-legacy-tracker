angular.module("modal.directive", []).directive("modal", function() {
    return {
        restrict: "E",
        scope: {
            show: "=",
            close: "&"
        },
        transclude: true,
        templateUrl: "/static/game/modal/modal.html"

    }
});