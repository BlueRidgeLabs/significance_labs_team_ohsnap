/**
 * Created by airswoop1 on 7/21/14.
 */
angular.module('formApp.feedbackFooterDirective',[]).directive('feedbackFooter', function(){
    return {
        restrict:'E',
        templateUrl:'templates/basic/feedback-footer.html',
        controller: function($scope, $window) {

            $scope.isActive = {
                about:false,
                faqs:false,
                contact:false
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
                $window.ga('send','event','footer', 'tap', name, 1);


            };

            $scope.external = function(name) {
                $window.ga('send','event','external', 'tap', name, 1);
            }

        }
    }
});