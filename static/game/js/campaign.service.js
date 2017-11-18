class CampaignService {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;

        this.username = document.getElementById("username").value;
    }

    getCampaigns() {
        return this._getResponseDataPromise("/campaigns/");
    }

    getCities(seasonId) {
        return this._getResponseDataPromise("/campaigns/season-" + seasonId + "/cities/");
    }

    clearGameData(season) {
        let deferred = this.$q.defer();

        window.localStorage.removeItem(this._getLSKeyForSeason(season));
        deferred.resolve();

        return deferred.promise;
    }

    saveGameState(season, gameData) {
        let deferred = this.$q.defer();

        if (this._verifyGameDataStructure(gameData)) {
            let gameDataString = JSON.stringify(gameData);
            window.localStorage.setItem(this._getLSKeyForSeason(season), gameDataString);
            deferred.resolve();
        }
        else {
            deferred.reject("Game data does not have a [discard] and [deck] and [infectionLevel]");
        }

        return deferred.promise;
    }

    loadGameState(season) {
        let deferred = this.$q.defer();

        let gameDataString = window.localStorage.getItem(this._getLSKeyForSeason(season));

        // If there is game data, and it's bigger than just {}, destringify it
        if (gameDataString && gameDataString.length > 2) {
            let gameData = JSON.parse(gameDataString);

            deferred.resolve(gameData);
        }
        else {
            this.getCities(season).then(function(cities) {
                deferred.resolve({
                    deck: [cities],
                    discard: {},
                    infectionLevel: 0
                });
            })
        }

        return deferred.promise;
    }

    _getLSKeyForSeason(season) {
        return this.username + "__game-data--season-" + season;
    }

    _getResponseDataPromise(url, params) {
        let data = {};

        if (params) {
            data['params'] = params;
        }

        return this.$http.get(url, data).then(function(response) {
            return response.data;
        }.bind(this));
    }

    _verifyGameDataStructure(gameData) {
        return gameData && gameData['discard'] && gameData['deck'] && gameData['infectionLevel'] > -1;
    }
}

CampaignService.$inject = ["$http", "$q"];

angular.module("campaign.service", []).service("CampaignService", CampaignService);
