/**
 * Created by jmcmahon on 5/20/2016.
 */

'use strict';

describe('Controller: LoggerController', function () {

    // load the controller's module
    beforeEach(module('SAKapp'));

    var LoggerController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LoggerController = $controller('LoggerController', {
            $scope: scope
        });
    }));

    it('should have page size default to 100', function () {
        expect(scope.size).toBe(100);
    });

    it('should add items to the list', function () {
        scope.getLogs();
        expect(scope.logs.length).toBe(0);
    });

    it('should add then remove an item from the list', function () {
        scope.todos = [];
        expect(scope.todos.length).toBe(0);
    });

});