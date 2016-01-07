(function() {
  var app, deps;

  deps = ['angularBootstrapNavTree', 'angularSpinner'];

  if (angular.version.full.indexOf("1.2") >= 0) {
    deps.push('ngAnimate');
  }

  app = angular.module('SAKapp', deps );

  app.controller('SAKappController', function($scope, $timeout, $http) {
    var tree, treedata_avm;
    $scope.my_tree_handler = function(branch) {
      var _ref;

      //$scope.bodyPage = "app/wfs/wfs.tpl.html";


    };


    treedata_avm = [
      {
        label: 'WFS',
        onSelect: function(branch) {
            return $scope.bodyDiv = "app/wfs/wfs.tpl.html";
        },

      }, {
        label: 'WMS',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "";
                },

      }, {
        label: 'Jobs',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "";
                },

      },
      {
        label: 'UUIDs',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "";
                },
        }
    ];

    $scope.my_data = treedata_avm;
    $scope.try_changing_the_tree_data = function() {

    };
    $scope.my_tree = tree = {};
    $scope.try_async_load = function() {
      $scope.my_data = [];
      $scope.doing_async = true;

    };

  });

}).call(this);