class GameController {

    constructor(CampaignService) {
        this.campaignService = CampaignService;
        this.campaigns = [];
        this.showEpidemicModal = false;

        this.campaignService.getCampaigns().then(function(campaigns) {
            this.campaigns = campaigns;
        }.bind(this));
    }

    startGame(campaignId) {
        this.campaignId = campaignId;

        this.campaignService.getCities(this.campaignId).then(function(cities) {
            this.deck = [cities];
            this.discardPile = [];
        }.bind(this));
    }

    playCityCard(deckSectionIndex, cardIndex) {
        // We only want to allow pulling off of the top of the deck
        if (deckSectionIndex !== 0) {
            return;
        }

        // Pull the city out of the top deck section
        let city = this.deck[0].splice(cardIndex, 1)[0];

        // If the section is empty, delete it
        if (this.deck[0].length === 0) {
            this.deck.splice(0, 1);
        }

        // Put the city on the top of the discard pile
        this.discardPile.splice(0, 0, city);
    }

    openEpidemicModal() {
        this.showEpidemicModal = true;
        this.epidemicSearch = "";
    }

    closeEpidemicModal() {
        this.showEpidemicModal = false;
    }

}

GameController.$inject = ["CampaignService"];

angular.module("game.controller", [
    'campaign.service',
    'city-row.directive'
]).controller("GameController", GameController);

angular.bootstrap(document, ["game.controller"]);