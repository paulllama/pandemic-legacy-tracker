const MAX_DECIMAL_PLACES = 2;
const NUM_PREDICTIONS = 3;
const INFECTION_AMOUNTS = [2, 2, 2, 3, 3, 4, 4];

class ManageCitiesController {
    constructor(CampaignService) {
        this.campaignService = CampaignService;

        this._clearOutNewCityForm();

        this.loading = false;
    }

    init(season) {
        this.season = season;
        this.loadCities();
    }

    loadCities() {
        this.cities = this.campaignService.getCities(this.season);
    }

    addCity() {
        this.loading = true;

        this.campaignService.createCity(this.season, this.newCityName, this.newCityColor, this.newCityFrequency)
            .then(function() {
                this.loadCities();

                this._clearOutNewCityForm();
                this.loading = false;
            }.bind(this));
    }

    _clearOutNewCityForm() {
        this.newCityName = "";
        this.newCityColor = "";
        this.newCityFrequency = 0;
    }
}

ManageCitiesController.$inject = ["CampaignService"];

angular.module("manage-cities.controller", [
    'campaign.service',
    'city-row.directive',
    'modal.directive',
    'text-input-with-label.directive'
]).controller("ManageCitiesController", ManageCitiesController);

angular.bootstrap(document, ["manage-cities.controller"]);