/**
 * Created by airswoop1 on 7/20/14.
 */
angular.module('formApp.appSubmittedDropdownDirective',[]).directive('appSubmittedDropdown', function(){
    return {
        restrict:'E',
        templateUrl:'templates/basic/app-submitted-dropdowns.html',
        controller: function($scope, $window) {

            $scope.isActive = {
                when:false,
                how:false,
                what:false
            };

            $scope.click = function(name) {

                if(!$scope.isActive[name]) {
                    for(var i in $scope.isActive) {
                        $scope.isActive[i] = false;
                    }
                    $scope.isActive[name]=true;

                }
                else if($scope.isActive[name]) {
                    $scope.isActive[name]=false;
                }
                $window.ga('send','event','app-submitted', 'tap', name, 1);


            };



        }
    }
});