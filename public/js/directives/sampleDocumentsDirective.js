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
		controller: function($scope, $window) {

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

		}
	}
});
