class LoginController {
    constructor($http) {
        this.$http = $http;
        this.email = "";
        this.password = "";

        this.LOGIN_URL = "/login/";
        this.CREATE_USER_URL = "/create-account/";
        this.REDIRECT_URL = "/campaigns/";
    }

    login() {
        this.postUserDataToUrl(this.LOGIN_URL);
    }

    createUser() {
        this.postUserDataToUrl(this.CREATE_USER_URL);
    }

    postUserDataToUrl(url) {
        this.$http.post(url, {
            email: this.email,
            password: this.password
        })
        .then(function (response) {
            if (response.data.error) {
                this.error = response.data.error;
            }
            else {
                window.location = this.REDIRECT_URL;
            }
        }.bind(this))


    }
}

LoginController.$inject = ["$http"];

angular.module("login.controller", [
    'text-input-with-label.directive'
])
    .controller("LoginController", LoginController)
    .config(window.ANGULAR_DJANGO_CSRF_CONFIG);


angular.bootstrap(document, ["login.controller"]);