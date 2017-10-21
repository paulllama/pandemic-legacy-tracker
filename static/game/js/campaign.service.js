class CampaignService {
    constructor($http) {
        this.$http = $http;
    }

    getCampaigns() {
        return this._getResponseDataPromise("/campaigns/");
    }

    getCities(campaignId) {
        return this._getResponseDataPromise("/campaigns/" + campaignId + "/cities/");
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
}

CampaignService.$inject = ["$http"];

angular.module("campaign.service", []).service("CampaignService", CampaignService);
