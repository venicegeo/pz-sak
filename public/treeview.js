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

  app.factory('discover', ['$http', function($http) {
    var discover = {
      async: function() {
        var promise = $http({
          method: "GET",
          url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources"
        }).then(function successCallback( html ) {
          var data = {};

          data.loggerHost = html.data["pz-logger"].host;
          data.loggerType = html.data["pz-logger"].type;
          data.loggerPort = html.data["pz-logger"].port;
          data.uuidHost = html.data["pz-uuidgen"].host;
          data.uuidType = html.data["pz-uuidgen"].type;
          data.uuidPort = html.data["pz-uuidgen"].port;
          data.workflowHost = html.data["pz-workflow"].host;
          data.workflowType = html.data["pz-workflow"].type;
          data.workflowPort = html.data["pz-workflow"].port;
          data.kafkaHost = html.data["kafka"].host;
          data.kafkaType = html.data["kafka"].type;
          data.kafkaPort = html.data["kafka"].port;
          data.zookeeperHost = html.data["zookeeper"].host;
          data.zookeeperType = html.data["zookeeper"].type;
          data.zookeeperPort = html.data["zookeeper"].port;
          data.searchHost = html.data["elasticsearch"].host;
          data.searchType = html.data["elasticsearch"].type;
          data.searchPort = html.data["elasticsearch"].port;
          data.serviceControllerHost = html.data["pz-servicecontroller"].address;
          data.serviceControllerType = html.data["pz-servicecontroller"].type;
          data.serviceControllerPort = html.data["pz-servicecontroller"].port;
          data.dispatcherHost = html.data["pz-dispatcher"].host;
          data.dispatcherType = html.data["pz-dispatcher"].type;
          data.dispatcherPort = html.data["pz-dispatcher"].port;
          data.gatewayHost = html.data["pz-gateway"].host;
          data.gatewayType = html.data["pz-gateway"].type;
          data.gatewayPort = html.data["pz-gateway"].port;

          return data;
        }, function errorCallback(response){
          console.log("search.controller fail");
          return "";
        });

        return promise;

      }
    };
    return discover;

  }]);

}).call(this);
