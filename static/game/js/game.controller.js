class GameController {
    constructor(CampaignService) {
        this.INFECTION_AMOUNTS = [2, 2, 2, 3, 3, 4, 4];

        this.campaignService = CampaignService;
        this.campaigns = [];
        this.showEpidemicModal = false;
        this.epidemicSearch = "";
        this.infectionLevel = 0;

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

    playCityCard(city) {
        this.moveCityToDiscardFromDeckSection(0, city);
    }

    triggerEpidemic(city) {
        this.moveCityToDiscardFromDeckSection(this.deck.length - 1, city);

        let discardCopy = this.discardPile.slice();
        this.deck.splice(0, 0, discardCopy);

        this.infectionLevel++;
        this.discardPile = [];
        this.closeEpidemicModal();
    }

    get infectionAmount() {
        return INFECTION_AMOUNTS[this.infectionLevel];
    }

    moveCityToDiscardFromDeckSection(sectionIndex, city) {
        let cardIndex = this.deck[sectionIndex].indexOf(city);

        // We only want to allow pulling off of specified section
        if (cardIndex === -1) {
            return;
        }

        // Pull the city out of the top deck section
        this.deck[sectionIndex].splice(cardIndex, 1);

        // If the section is empty, delete it
        if (this.deck[sectionIndex].length === 0) {
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
    'city-row.directive',
    'modal.directive',
    'text-input-with-label.directive'
]).controller("GameController", GameController);

angular.bootstrap(document, ["game.controller"]);