/**
 Copyright 2016, RadiantBlue Technologies, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function() {
  var app, deps;

  deps = ['angularBootstrapNavTree', 'angularSpinner', 'openlayers-directive', 'toaster'];

  if (angular.version.full.indexOf("1.2") >= 0) {
    deps.push('ngAnimate');
  }

  app = angular.module('SAKapp', deps );

  app.controller('SAKappController', function($scope, $timeout, $http) {
    $scope.year = (new Date()).getFullYear();
    var tree, treedata_avm;
    $scope.my_tree_handler = function(branch) {
      var _ref;

    };


    treedata_avm = [
    {
      label: 'Name Server',
      onSelect: function(branch) {
      return $scope.bodyDiv = "app/name-server/name-server.tpl.html";
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
        label: 'Admin',
          onSelect: function(branch) {
            return $scope.bodyDiv = "app/uuid/uuid.admin.tpl.html";
          }
        }
        ]
        },
        {
        label: 'Ingester',
        onSelect: function(branch) {
                    return $scope.bodyDiv = "app/ingester/ingester.tpl.html";
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
                     return $scope.bodyDiv = "app/access/access.tpl.html";
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
                     return $scope.bodyDiv = "app/search/search.tpl.html";
                  },

        children: [
        {
        label: 'Admin',
              onSelect: function(branch) {
                return $scope.bodyDiv = "app/search/search.admin.tpl.html";
              }
        }
        ]

        },
        {
        label: 'User Service Registry',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "app/user-service-registry/user-service-registry.tpl.html";
                },

        children: [
        {
        label: 'Admin'
        }
        ]

        },
        {
        label: 'Workflow',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "app/workflow/workflow.tpl.html";
                },

        children: [
          {
            label: 'Admin',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/workflow.admin.tpl.html";
            }
          }
        ]

        },
        {
        label: 'Logger',
                onSelect: function(branch) {
                      return $scope.bodyDiv = "app/logger/logger.tpl.html";
                },

        children: [
        {
        label: 'Admin',
          onSelect: function(branch) {
            return $scope.bodyDiv = "app/logger/logger.admin.tpl.html";
          }
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

  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    };
  });

}).call(this);
