/**
 * Created by airswoop1 on 7/20/14.
 */
angular.module('formApp.appSubmittedDropdownDirective',[]).directive('appSubmittedDropdown', function(){
    return {
        restrict:'E',
        templateUrl:'templates/basic/app-submitted-dropdowns.html',
        controller: ["$scope", "$window", function($scope, $window) {

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



        }]
    }
});
/**
 * Created by airswoop1 on 7/21/14.
 */
angular.module('formApp.feedbackFooterDirective',[]).directive('feedbackFooter', function(){
    return {
        restrict:'E',
        templateUrl:'templates/basic/feedback-footer.html',
        controller: ["$scope", "$window", function($scope, $window) {

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

        }]
    }
});
/**
 * Created by airswoop1 on 7/11/14.
 */
angular.module('formApp.infoFooterDirective',[]).directive('infoFooter', function(){
    return {
        restrict:'E',
        templateUrl:'templates/basic/info-footer.html',
        controller: ["$scope", "$window", function($scope, $window) {

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

        }]
    }
});

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
        controller : ["$state", function($state){
          goAddress = function(){
              $state.go('form.address');
          };

        }],
        templateUrl: 'templates/basic/modal.html'
    };
})
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
/**
 * Created by airswoop1 on 7/30/14.
 */
angular.module('formApp.sampleDocumentsDirective',[]).directive('sampleDocuments', function(){



	return {
		restrict:'E',
		templateUrl:'templates/documents/sample-documents.html',
		scope:{
			docContent:'=docContent',
			type:'=current_type'
		},
		controller: ["$scope", "$window", function($scope, $window) {

			$scope.isActive = {
				showExampleDocs:true
			};

			$scope.exampleActive = {};
			$scope.currentContent = $scope.$parent.docContent[$scope.$parent.$parent.current_type];

			for(var x in $scope.currentContent.valid_docs){
				$scope.exampleActive[$scope.currentContent.valid_docs[x].name] = false;
			}

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
			};

			$scope.clickEx = function(name) {
				if(!$scope.exampleActive[name]) {
					for(var i in $scope.exampleActive) {
						$scope.exampleActive[i] = false;
					}
					$scope.exampleActive[name]=true;

				}
				else if($scope.exampleActive[name]) {
					$scope.exampleActive[name]=false;
				}

			};

			$scope.external = function(name) {
				$window.ga('send','event','external', 'tap', name, 1);
			}

		}]
	}
});
