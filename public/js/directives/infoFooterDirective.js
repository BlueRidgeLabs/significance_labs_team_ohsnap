/**
 * Created by airswoop1 on 7/11/14.
 */
angular.module('formApp.infoFooterDirective',[]).directive('infoFooter', function(){
    return {
        restrict:'E',
        templateUrl:'templates/basic/info-footer.html',
        controller: function($scope, $window) {

            $scope.isActive = {
                about:false,
                faqs:false,
                contact:false
            };

            $scope.faqActive = {
                diff:false,
                cost:false,
                info:false,
                more:false
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

            $scope.clickFAQ = function(name) {
                if(!$scope.faqActive[name]) {
                    for(var i in $scope.faqActive) {
                        $scope.faqActive[i] = false;
                    }
                    $scope.faqActive[name]=true;

                }
                else if($scope.faqActive[name]) {
                    $scope.faqActive[name]=false;
                }
                $window.ga('send','event','faq', 'tap', name, 1);
            };

            $scope.external = function(name) {
                $window.ga('send','event','external', 'tap', name, 1);
            }

        }
    }
});
