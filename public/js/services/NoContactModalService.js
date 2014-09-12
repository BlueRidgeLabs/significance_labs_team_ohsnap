/**
 * Created by airswoop1 on 7/9/14.
 */

angular.module('NoContactModal',[]).service('modalService', ['$modal',
    function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'templates/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $state, $location, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;

                    $scope.modalOptions.goToAddress = function () {
                        $modalInstance.dismiss('cancel');
                        $state.go('form.address');
                    };

                    $scope.modalOptions.goToTelephone = function () {
                        $modalInstance.dismiss('cancel');
                    };

                }
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);