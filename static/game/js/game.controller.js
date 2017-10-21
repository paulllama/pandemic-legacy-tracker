class GameController {

    constructor(CampaignService) {
        this.campaignService = CampaignService;
        this.campaigns = [];

        this.campaignService.getCampaigns().then(function(campaigns) {
            this.campaigns = campaigns;
        }.bind(this));
    }

    startGame(campaign) {
        this.campaignId = campaign.id;

        this.campaignService.getCities(this.campaignId).then(function(cities) {
            this.cities = cities;
        }.bind(this));
    }

}

GameController.$inject = ["CampaignService"];

angular.module("game.controller", ['campaign.service']).controller("GameController", GameController);
angular.bootstrap(document, ["game.controller"]);