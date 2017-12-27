class CampaignService {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;

        this.username = document.getElementById("username").value;

        this.cityLists = {};
    }

    getCampaigns() {
        return this._getRequestWithParams("/campaigns/");
    }

    getCities(seasonId) {
        if (!this.cityLists[seasonId]) {
            this.cityLists[seasonId] = [];

            this._updateCityListForSeason(seasonId);
        }

        return this.cityLists[seasonId];
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
            this.getCities(season)._promise.then(function(cities) {
                deferred.resolve({
                    deck: [cities],
                    discard: {},
                    infectionLevel: 0,
                    freshLoad: true
                });
            })
        }

        return deferred.promise;
    }

    createCity(season, name, color, frequency) {
        return this._postRequestWithParams("/campaigns/season-" + season + "/cities/", {
            name: name,
            color: color,
            frequency: frequency || 1
        }).then(function() {
            this._updateCityListForSeason(season)
        }.bind(this));
    }

    updateCity(season, city) {
        return this._postRequestWithParams("/campaigns/season-" + season + "/cities/" + city.id + "/", {
            'name': city.name,
            'color': city.color,
            'frequency': city.frequency
        }).then(function() {
            this._updateCityListForSeason(season)
        }.bind(this));
    }

    deleteCity(season, cityId) {
        return this._postRequestWithParams("/campaigns/season-" + season + "/cities/" + cityId + "/", {
            'delete': true
        }).then(function() {
            this._updateCityListForSeason(season)
        }.bind(this));
    }

    _updateCityListForSeason(seasonId) {
        this.cityLists[seasonId]._loading = true;
        this.cityLists[seasonId]._promise = this._getRequestWithParams("/campaigns/season-" + seasonId + "/cities/");

        this.cityLists[seasonId]._promise.then(function(data) {
            this.cityLists[seasonId].splice(0, this.cityLists[seasonId].length);
            angular.merge(this.cityLists[seasonId], data);

            this.cityLists[seasonId]._loading = false;
        }.bind(this));
    }

    _getLSKeyForSeason(season) {
        return this.username + "__game-data--season-" + season;
    }

    _getRequestWithParams(url, params) {
        let data = {};

        if (params) {
            data['params'] = params;
        }

        return this.$http.get(url, data).then(function(response) {
            return response.data;
        }.bind(this));
    }
    
    _postRequestWithParams(url, params) {
        return this.$http.post(url, params).then(function(response) {
            return response.data;
        }.bind(this));
    }

    _verifyGameDataStructure(gameData) {
        return gameData && gameData['discard'] && gameData['deck'] && gameData['infectionLevel'] > -1;
    }
}

CampaignService.$inject = ["$http", "$q"];

angular.module("campaign.service", ['csrf-token']).service("CampaignService", CampaignService);
