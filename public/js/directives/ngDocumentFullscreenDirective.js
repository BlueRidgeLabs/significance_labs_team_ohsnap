angular.module('formApp.ngDocumentFullscreen',[]).directive('ngDocumentFullscreen', function(){
    return {
        restrict: "A",
        link: function(scope, elem, attr, ctrl) {
            elem.bind('click', function(e) {
                this.classList.toggle('fullscreen');
            });
        }
    }
});