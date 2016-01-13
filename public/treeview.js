(function() {
  var app, deps;

  deps = ['angularBootstrapNavTree', 'angularSpinner', 'openlayers-directive'];

  if (angular.version.full.indexOf("1.2") >= 0) {
    deps.push('ngAnimate');
  }

  app = angular.module('SAKapp', deps );

  app.controller('SAKappController', function($scope, $timeout, $http) {
    var tree, treedata_avm;
    $scope.my_tree_handler = function(branch) {
      var _ref;

    };


    treedata_avm = [
    {
      label: 'Name Server',
      onSelect: function(branch) {
      return $scope.bodyDiv = "";
      },

        children: [
        {
        label: 'Admin'
        }
        ]
       },
      {
        label: 'WFS',
        onSelect: function(branch) {
            return $scope.bodyDiv = "app/wfs/wfs.tpl.html";
        },


      }, {
        label: 'WMS',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "app/wms/wms.tpl.html";
                },



      }, {
        label: 'Jobs',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "app/jobs/jobs.tpl.html";
                },

        children: [
        {
        label: 'Admin'
        }
        ]

      },
      {
        label: 'UUIDs',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "app/uuid/uuid.tpl.html";
                },

        children: [
        {
        label: 'Admin'
        }
        ]
        },
        {
        label: 'Ingester',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "";
                },

        children: [
        {
        label: 'Admin'
        }
        ]

        },
        {
        label: 'Access',
        onSelect: function(branch) {
                     return $scope.bodyDiv = "";
                  },

        children: [
        {
        label: 'Admin'
        }
        ]

        },
        {
        label: 'Search',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "";
                  },

        children: [
        {
        label: 'Admin'
        }
        ]

        },
        {
        label: 'User Service Registry',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "";
                },

        children: [
        {
        label: 'Admin'
        }
        ]

        },
        {
        label: 'Alerts',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "";
                },

        children: [
        {
        label: 'Admin'
        }
        ]

        },
        {
        label: 'Logger',
                onSelect: function(branch) {
                      return $scope.bodyDiv = "";
                },

        children: [
        {
        label: 'Admin'
        }
        ]

        }
    ];

    $scope.my_data = treedata_avm;

    $scope.my_tree = tree = {};
    $scope.try_async_load = function() {
      $scope.my_data = [];
      $scope.doing_async = true;

    };

  });

}).call(this);