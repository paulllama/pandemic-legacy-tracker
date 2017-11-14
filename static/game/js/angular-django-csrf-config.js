window.ANGULAR_DJANGO_CSRF_CONFIG = ["$httpProvider", function($httpProvider) {
    let token = document.getElementById("csrf_token");
    $httpProvider.defaults.headers.post['X-CSRFToken'] = token.value;
}];