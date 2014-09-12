/**
 * Created by airswoop1 on 7/21/14.
 */
angular.module('formApp.modalDirective',[]).directive('modalDialog',function(){
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function(scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function() {
                scope.show = false;
            };

            scope.goToAddress = function() {
                scope.show = false;
                goAddress();
            }
        },
        controller : function($state){
          goAddress = function(){
              $state.go('form.address');
          };

        },
        templateUrl: 'templates/basic/modal.html'
    };
})