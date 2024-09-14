angular.module('myApp').config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'app/landingpage/landingpage.html',
        controller: 'LandingPageController'
    })
    .when('/products', {
        templateUrl: 'app/products/products.html',
        controller: 'ProductsController',
        CSS: "/app/products/product.css"
    })
    .when('/cart', {
        templateUrl: 'app/cart/cart.html',
        controller: 'CartController'
    })
    .when('/confirm-order', {
        templateUrl: 'app/confirm-order/confirm-order.html',
        controller: 'ConfirmOrderController'
    })
    .when('/order', {
        templateUrl: 'app/order/order.html',
        controller: 'OrderController'
    })
    .when('/product-detail/:id', {
        templateUrl: 'app/product-detail/detail-product.html',
        controller: 'ProductsDetailController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
