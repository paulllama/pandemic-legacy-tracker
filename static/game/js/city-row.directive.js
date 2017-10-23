angular.module("city-row.directive", []).directive("cityRow", function() {
    return {
        restrict: 'E',
        scope: {
            city: '='
        },
        templateUrl: '/static/game/angular-templates/city-row.html'
    };
});