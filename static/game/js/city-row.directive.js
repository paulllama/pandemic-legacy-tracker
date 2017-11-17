angular.module("city-row.directive", []).directive("cityRow", function() {
    return {
        restrict: 'E',
        scope: {
            city: '=',
            probabilities: '='
        },
        templateUrl: '/static/game/angular-templates/city-row.html'
    };
});