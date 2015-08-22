app.controller('HomeController', ['$scope', '$location', '$cookies', 'TeasHelper', 'ShoppingCart', function ($scope, $location, $cookies, TeasHelper, ShoppingCart) {
  TeasHelper.getTeas().then(function (teaData) {
    $scope.teas = teaData[0];
    $scope.categories = teaData[1];
  });
  if($cookies.get('cart_id')){
    ShoppingCart.getCart().then(function (cart) {
      $scope.cart = cart;
    });
  } else {
    $scope.cart = {items: []}
  }
  $scope.goToCart = function () {
    $location.path('/cart');
  }
  $scope.addToCart = function () {
    var item = {};
    item.item_id = this.tea._id;
    item.quantity = this.quantity ? this.quantity : 1;
    if($cookies.get('cart_id')) {
      ShoppingCart.addItem(item, $cookies.get('cart_id')).then(function (cart) {
        $scope.cart = cart;
      })
    } else {
      ShoppingCart.createCart(item).then(function (cart) {
        $scope.cart = cart;
      })
    }
  }
}]);

app.controller('CartController', ['$scope', '$cookies', 'ShoppingCart', function ($scope, $cookies, ShoppingCart) {
  $scope.qtyForm = false;
  $scope.showEdit = false;
  ShoppingCart.showCart($cookies.get('cart_id')).then(function (cart) {
    $scope.cart = cart[0];
    $scope.total = cart[1];
  })
  $scope.removeItem = function () {
    $scope.total = $scope.total - (this.item.quantity * this.item.info.price * .01);
    ShoppingCart.removeItem($scope.cart, $cookies.get("cart_id"));
  }
  $scope.editQty = function () {
    this.qtyForm = !this.qtyForm;
  }
  $scope.updateQty = function () {
    $scope.total = $scope.total - (this.item.quantity * this.item.info.price * .01) + (this.qty * this.item.info.price * .01);
    this.item.quantity = this.qty;
    ShoppingCart.changeQty($scope.cart, $cookies.get("cart_id"));
    this.qtyForm = !this.qtyForm;
  }
}]);
