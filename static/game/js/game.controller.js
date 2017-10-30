const MAX_DECIMAL_PLACES = 2;
const NUM_PREDICTIONS = 3;
const INFECTION_AMOUNTS = [2, 2, 2, 3, 3, 4, 4];

class GameController {
    constructor(CampaignService) {
        this.INFECTION_AMOUNTS = INFECTION_AMOUNTS;

        this.campaignService = CampaignService;
        this.showEpidemicModal = false;
        this.epidemicSearch = "";
        this.deckSearchInput = "";
        this.infectionLevel = 0;
    }

    startGame(campaignId) {
        this.campaignId = campaignId;

        this.campaignService.getCities(this.campaignId).then(function(cities) {
            this.deck = [cities];
            this.discardPile = [];
            this.generateProbabilitiesForFullDeck();
        }.bind(this));
    }

    playCityCard(city) {
        this.moveCityToDiscardFromDeckSection(0, city);
        this.generateProbabilitiesForFullDeck();
    }

    triggerEpidemic(city) {
        this.moveCityToDiscardFromDeckSection(this.deck.length - 1, city);

        let discardCopy = this.discardPile.slice();
        this.deck.splice(0, 0, discardCopy);

        this.infectionLevel++;
        this.discardPile = [];
        this.closeEpidemicModal();
        this.generateProbabilitiesForFullDeck();
    }

    get infectionAmount() {
        return this.INFECTION_AMOUNTS[this.infectionLevel];
    }

    generateProbabilitiesForFullDeck() {
        this.predictionsForDeckSection = [];

        for (let i = 0; i < this.deck.length; i++) {
            this.predictionsForDeckSection.push(this.generateProbabilitiesForDeckSection(i));
        }

        console.log(this.predictionsForDeckSection);
    }

    generateProbabilitiesForDeckSection(deckSectionIndex) {
        let set = 0;
        let offset = 0;
        let totalPicked = 0;
        let numLeftToPick = this.infectionAmount;
        let probabilities = [];

        while (set < deckSectionIndex && probabilities.length < NUM_PREDICTIONS) {
            if (totalPicked + numLeftToPick < this.deck[set].length + offset) {
                probabilities.push(0);
                totalPicked += numLeftToPick;
                numLeftToPick = this.infectionAmount;
            }
            else {
                numLeftToPick = (totalPicked + this.infectionAmount) - (this.deck[set].length + offset);
                totalPicked += this.infectionAmount - numLeftToPick;
                offset += this.deck[set].length;
                set++;

                if (numLeftToPick === 0) {
                    numLeftToPick = this.infectionAmount;
                    probabilities.push(0);
                }
            }
        }

        let probability = 0;
        let numLeftInSet = 0;

        while (probabilities.length < NUM_PREDICTIONS && probability < 1) {
            numLeftInSet = this.deck[set].length - (totalPicked - offset);

            probability = 0;

            if (numLeftInSet > 0) {
                probability = Math.min(numLeftToPick / numLeftInSet, 1);
            }

            totalPicked += numLeftToPick;
            numLeftToPick = this.infectionAmount;

            let decimalPlaceAdjust = Math.pow(10, MAX_DECIMAL_PLACES);
            probabilities.push(Math.round(probability * 100 * decimalPlaceAdjust) / decimalPlaceAdjust);
        }

        // Check to see that there is at least 1 prediction
        for (let i = 0; i < probabilities.length; i++) {
            if (probabilities[i] !== 0) {
                return probabilities;
            }
        }

        // If all the predictions are 0, just return an empty array
        return [];
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
        this.deckSearchInput = "";
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