class LoginController {
    constructor($http) {
        this.$http = $http;
        this.username = "";
        this.password = "";
        this.passwordConfirm = "";

        this.LOGIN_URL = "/login/";
        this.CREATE_USER_URL = "/create-account/";
        this.REDIRECT_URL = "/campaigns/";
    }

    login() {
        this.postUserDataToUrl(this.LOGIN_URL);
    }

    createUser() {
        if (this.password === this.passwordConfirm) {
            this.postUserDataToUrl(this.CREATE_USER_URL);
        }
        else {
            this.error = "Passwords do not match";
        }
    }

    postUserDataToUrl(url) {
        this.$http.post(url, {
            username: this.username,
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

    clearError() {
        this.error = "";
    }
}

LoginController.$inject = ["$http"];

angular.module("login.controller", [
    'text-input-with-label.directive'
])
    .controller("LoginController", LoginController)
    .config(window.ANGULAR_DJANGO_CSRF_CONFIG);


angular.bootstrap(document, ["login.controller"]);