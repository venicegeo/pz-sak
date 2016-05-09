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
            label: 'Home',
            onSelect: function(branch) {
                return $scope.bodyDiv = "app/home/home.tpl.html";
            },

        },
        {
        label: 'Access',
        onSelect: function(branch) {
                     return $scope.bodyDiv = "app/access/access.tpl.html";
                  },

        children: [
        {
        label: 'Admin',
          onSelect: function(branch) {
            return $scope.bodyDiv = "app/access/access.admin.tpl.html";
          }
        }
        ]

        },

      {
        label: 'Jobs',
        onSelect: function(branch) {
          return $scope.bodyDiv = "app/jobs/jobs.tpl.html";
        },

        children: [
          {
            label: 'Admin',
              onSelect: function(branch) {
                  return $scope.bodyDiv = "app/jobs/jobs.admin.tpl.html";
              }
          }
        ]

      },
        {
            label: 'Loader',
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

      },
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
        label: 'Admin',
                onSelect: function(branch) {
                    return $scope.bodyDiv = "app/user-service-registry/user-service-registry.admin.tpl.html";
              },
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
        label: 'Workflow',
          onSelect: function(branch) {
            console.log(branch);
            branch.expanded = !branch.expanded;
          },

        children: [
            {
                label: 'Event Types',
                onSelect: function(branch) {
                    return $scope.bodyDiv = "app/workflow/eventtypes.tpl.html";
                }
            },
          {
            label: 'Events',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/events.tpl.html";
            }
          },
          {
            label: 'Alerts',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/alerts.tpl.html";
            }
          },
          {
            label: 'Triggers',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/triggers.tpl.html";
            }
          },
          {
            label: 'Admin',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/workflow.admin.tpl.html";
            }
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

  app.filter('utc', function() {
      return function(input) {
          // Multiply the result by 1000 because a unix timestamp is SECONDS since epoch
          return (!!input) ? moment.utc(input * 1000).toISOString() : '';
      };
  });

  app.factory('discover', [function() {
    var hostname;
    if (window.location.hostname == "localhost") {
        hostname = ".int.geointservices.io"
    } else {
        var firstDotIndex = window.location.hostname.indexOf(".");
        hostname = window.location.hostname.substring(firstDotIndex);
    }

    var CORE_SERVICE = "core-service";
    var INFRASTRUCTURE = "infrastructure";
    var discover = {
          loggerHost : "pz-logger" + hostname,
          loggerType : CORE_SERVICE,
          loggerPort : "",
          uuidHost : "pz-uuidgen" + hostname,
          uuidType : CORE_SERVICE,
          uuidPort : "",
          workflowHost : "pz-workflow" + hostname,
          workflowType : CORE_SERVICE,
          workflowPort : "",
          searchHost : "pz-search-query" + hostname,
          searchType : CORE_SERVICE,
          searchPort : "",
          serviceControllerHost : "pz-servicecontroller" + hostname,
          serviceControllerType : CORE_SERVICE,
          serviceControllerPort : "",
          dispatcherHost : "pz-dispatcher" + hostname,
          dispatcherType : CORE_SERVICE,
          dispatcherPort : "",
          gatewayHost : "pz-gateway" + hostname,
          gatewayType : CORE_SERVICE,
          gatewayPort : "",
          accessHost : "pz-access" + hostname,
          accessType : CORE_SERVICE,
          accessPort : "",
          jobsHost : "pz-jobmanager" + hostname,
          jobsType : CORE_SERVICE,
          swaggerUI : "pz-swagger" + hostname,
          docs : "pz-docs" + hostname
    };
    return discover;

  }]);

}).call(this);
