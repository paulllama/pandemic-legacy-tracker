angular.module("city-row.directive", ['campaign.service']).directive("cityRow", ['CampaignService', function(campaignService) {
    return {
        restrict: 'E',
        scope: {
            city: '=',
            season: '=',
            editable: '=',
            probabilities: '='
        },
        templateUrl: '/static/game/angular-templates/city-row.html',
        link: function(scope) {
            scope.cityColorClass = scope.city.is_faded ? '' : scope.city.color;

            scope.showViewState = function() {
                scope.state = 'VIEW'
            };

            if (scope.editable) {
                if (!scope.season) {
                    throw "No season for " + scope.city.name + " [" + scope.city.id + "]";
                }

                scope.newCity = angular.copy(scope.city);

                scope.updateCity = function() {
                    scope.showLoadingState();

                    campaignService.updateCity(scope.season, scope.newCity).then(scope.showViewState);
                };

                scope.deleteCity = function() {
                    scope.showLoadingState();

                    campaignService.deleteCity(scope.season, scope.newCity.id).then(scope.showViewState);
                };

                scope.showLoadingState = function() {
                    scope.state = 'LOADING';
                };

                scope.showEditState = function() {
                    scope.state = 'EDIT';
                };

                scope.showDeleteState = function() {
                    scope.state = 'DELETE';
                };
            }

            scope.showViewState();
        }
    };
}]);