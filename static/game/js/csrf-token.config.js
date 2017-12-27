angular.module('csrf-token', []).config(["$httpProvider", function($httpProvider) {
    let token = document.getElementById("csrf_token");
    $httpProvider.defaults.headers.post['X-CSRFToken'] = token.value;
}]);