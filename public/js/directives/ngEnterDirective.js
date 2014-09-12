/**
 * Created by airswoop1 on 7/11/14.
 */
angular.module('formApp.ngEnterDirective',[]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
	            console.log("keypress?");
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});