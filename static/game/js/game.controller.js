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
    }

    startGame(season) {
        this.season = season;

        this.campaignService.loadGameState(this.season).then(function(gameData) {
            this.deck = gameData.deck;
            this.discardPile = gameData.discard;
            this.infectionLevel = gameData.infectionLevel;

            this.probabilityCache = {};
        }.bind(this));
    }

    resetGame() {
        this.campaignService.clearGameData(this.season).then(function() {
            this.startGame(this.season);
        }.bind(this));
    }

    playCityCard(city) {
        this.moveCityToDiscardFromDeckSection(0, city);
        this.probabilityCache = {};

        this.campaignService.saveGameState(this.season, {
            deck: this.deck,
            discard: this.discardPile,
            infectionLevel: this.infectionLevel
        });
    }

    submitEpidemicForm(cityList) {
        if (cityList && cityList.length === 1) {
            this.triggerEpidemic(cityList[0]);
        }
    }

    triggerEpidemic(city) {
        this.moveCityToDiscardFromDeckSection(this.deck.length - 1, city);

        let discardCopy = Object.values(this.discardPile);
        this.deck.splice(0, 0, discardCopy);

        this.infectionLevel++;
        this.discardPile = {};
        this.closeEpidemicModal();
        this.probabilityCache = {}; //this.generateProbabilitiesForFullDeck();
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

    getProbabilitiesForDeckSectionAndFrequency(deckSection, frequency) {
        let probabilityCacheHash = deckSection + "-" + frequency;

        if (!this.probabilityCache[probabilityCacheHash]) {
            let probabilities = this.generateProbabilities(deckSection, frequency);
            let hasAtLeastOnePrediction = false;

            // Check to see that there is at least 1 prediction
            for (let i = 0; i < probabilities.length; i++) {
                if (probabilities[i] !== 0) {
                    hasAtLeastOnePrediction = true;
                    break;
                }
            }

            // If all the predictions are 0, just return an empty array
            if (hasAtLeastOnePrediction) {
                this.probabilityCache[probabilityCacheHash] = probabilities;
            }
            else {
                this.probabilityCache[probabilityCacheHash] = [];
            }
        }

        return this.probabilityCache[probabilityCacheHash];
    }


    generateProbabilities(deckSection, frequency) {
        let cardsBeforeSection = 0;
        let probabilities = [];
        let cardsPicked = 0;
        let cardsInSection = this.getSizeOfSection(deckSection);

        for (let section = 0; section < deckSection; section++) {
            cardsBeforeSection += this.getSizeOfSection(section);
        }

        while (probabilities.length < NUM_PREDICTIONS && cardsInSection > 0) {
            // If the next set is not even in this section, add 0
            if (cardsPicked + this.infectionAmount <= cardsBeforeSection) {
                probabilities.push(0);
                cardsPicked += this.infectionAmount;
            }
            // Else we have the chance to pull this card
            else {
                // The city has to get picked
                if (cardsInSection < this.infectionAmount) {
                    probabilities.push(100);
                }
                else {
                    let probabilityToNotChoose = 1;
                    /*
                      n - f       n - 1 - f       n - 2 - f
                     -------  *  -----------  *  ----------- * ...
                        n           n - 1           n - 2
                    */
                    for (let chosenInSet = 0; chosenInSet < this.infectionAmount; chosenInSet++) {
                        probabilityToNotChoose *= (cardsInSection - chosenInSet - frequency) / (cardsInSection - chosenInSet);
                    }

                    let probability = Math.min(1.0 - probabilityToNotChoose, 1.0);
                    let decimalPlaceAdjust = Math.pow(10, MAX_DECIMAL_PLACES);
                    probabilities.push(Math.round(probability * 100 * decimalPlaceAdjust) / decimalPlaceAdjust);
                }

                if (probabilities[probabilities.length - 1] === 100) {
                    break;
                }

                cardsInSection -= this.infectionAmount;
            }
        }

        return probabilities;
    }

    getSizeOfSection(deckSectionIndex) {
        let section = this.deck[deckSectionIndex];
        let numCards = 0;

        for (let cityIndex = 0; cityIndex < section.length; cityIndex++) {
            let city = section[cityIndex];
            numCards += city.frequency;
        }

        return numCards;
    }

    OLDgenerateProbabilitiesForDeckSection(deckSectionIndex) {
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

        // Lower the amount of this card
        this.deck[sectionIndex][cardIndex].frequency--;

        // If it was the last one remove it
        if (this.deck[sectionIndex][cardIndex].frequency === 0) {
            this.deck[sectionIndex].splice(cardIndex, 1);
        }

        // If the section is empty, delete it
        if (this.deck[sectionIndex].length === 0) {
            this.deck.splice(0, 1);
        }

        // If this city is not in the discard already, add it
        if (!this.discardPile[city.name]) {
            let cityCopy = angular.copy(city);
            cityCopy.frequency = 0;
            this.discardPile[city.name] = cityCopy;
        }

        this.discardPile[city.name].frequency++;
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