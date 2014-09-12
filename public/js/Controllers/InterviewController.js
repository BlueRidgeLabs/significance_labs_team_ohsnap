/**
 * Created by airswoop1 on 7/31/14.
 */

angular.module('formApp.interviewCtrl',['formApp.userDataFactory', 'formApp.apiFactory']).controller('interviewCtrl',
	function($scope, $state, $rootScope, $location, $anchorScroll, userDataFactory, API){


		$scope.show_interview_progress=false;
		$scope.int_progress = 0;

		$scope.interview_progress_status = 0;
		$scope.interview_steps = -1;
		$scope.user = userDataFactory.userData.user.formData; //? userDataFactory.userData.user.formData : {"household":1};
		$scope.user.household_members = (typeof $scope.user.household_members!== 'undefined') ? $scope.user.household_members : {};
		$scope.interviewCompleted = userDataFactory.userData.interviewProgress;
		$scope.estimated_benefit = $scope.user.benefit_amount;

		$scope.user['disabled'] = 'no';

		$scope.minutes_saved = 0;

		if(!isEmpty($scope.user.household_members)){

			for(var i=0; i<$scope.user.household-1;i++ ){
				$scope.user.household_members[i] = {
					"applying":false,
			        "income":0,
					"show":false,
					"relation":'Select'
				};
			}
		}

		$scope.stepsCompleted = {
			"int.ssn":false,
			"int.dob":false,
			"int.marital_status":false,
			"int.disabled":false,
			"int.citizen":false,
			"int.household":false,
			"int.household-applying":false,
			"int.household-ssn":false,
			"int.household-dob":false,
			"int.household-relation":false,
			"int.income-frequency":false,
			"int.income-hours":false,
			"int.income-household-amount":false,
			"int.income-household-frequency":false,
			"int.resources":false,
			"int.expenses-mortgage":false
		};

		var interviewMinutesCategory = {
			"eligibility":5,
			"household":10,
			"income":5,
			"expenses":5
		};

		$scope.BoolOpts = [
			{"value":true, "name":"Yes"},
			{"value":false, "name":"No"}
		];

		$scope.YNOpts = [
			{"value":"Yes", "name":"Yes"},
			{"value":"No", "name":"No"}
		];

		$scope.MaritalOpts = [
			{"value":"Single", "name":"Single"},
			{"value":"Divorced", "name":"Divorced"},
			{"value":"Married", "name":"Married"}

		];

		$scope.relationshipOptions = [
			{name:"Select", value:"Select"},
			{name:"Partner", value:"Partner"},
			{name: "Child", "value":"Child"},
			{name:"Parent", "value":"Parent"},
			{name:"Roommate", "value":"Roommate"},
			{name:"Other family member", "value":"Other family member"}
		];


		$scope.showHouseholdMember = function(k) {
			for(var n in  $scope.user.household_members){
				if($scope.user.household_members[n].name == k){
					$scope.user.household_members[n].show = !$scope.user.household_members[n].show;
				}
			}
		};

		$scope.hasApplyingMembers = function() {
			var isApplying = false;
			for(var member in $scope.user.household_members){
				isApplying = isApplying || $scope.user.household_members[member].applying;
			}
			return isApplying;
		}

		$scope.updateMinutes = function(num) {
			$scope.minutes_saved += num;
		};

		$scope.hasHouseholdMembers = function() {
			var has_members =false;
			for(var member in $scope.user.household_members){
				has_members = has_members || $scope.user.household_members[member].name;
			}
			return has_members;
		};


		$scope.$on('int-main', function(meta, type){

			if(!$scope.interviewCompleted[type]){
				$scope.updateMinutes(interviewMinutesCategory[type]);
			}

			$scope.interviewCompleted[type] = true;
			$scope.show_interview_progress = false;
			calculateBenefit();


			API.uploadPartialInterviewInfo($scope.user, function(result){
				if(result) {

				}
				else {
					alert("Oops! Looks like something went wrong. Your information was NOT submitted. Please refill your information");
				}
			});
		});

		function updateProgress(name) {
			$scope.stepsCompleted[name] = true;
			$scope.int_progress = 0;
			for(var x in $scope.stepsCompleted) {
				if($scope.stepsCompleted[x] === true){
					$scope.int_progress += 7.4;
				}
			}
		};

		function updateProgressStatus(){
			if( $scope.interviewCompleted.eligibility &&
				$scope.interviewCompleted.household &&
				$scope.interviewCompleted.income && 
				$scope.interviewCompleted.expenses){
				$scope.interview_progress_status = 2;
			} else if ( !$scope.interviewCompleted.eligibility && 
						!$scope.interviewCompleted.household && 
						!$scope.interviewCompleted.income && 
						!$scope.interviewCompleted.expenses){
				$scope.interview_progress_status = 0;
			} else {
				$scope.interview_progress_status = 1;
			}

		}

		function calculateBenefit() {

			var applying = $scope.interviewCompleted.household ? 1 : $scope.user.household,
				income = (typeof $scope.user.monthly_income !== 'undefined') ? $scope.user.monthly_income : parseInt($scope.user.income),
				expenses = (typeof $scope.user.eligibility_expenses !== 'undefined') ? $scope.user.eligibility_expenses : 0;

			if(typeof $scope.user.rent !== 'undefined'){
				expenses += parseInt($scope.user.rent);
			}

			for(var users in $scope.user.household_members){

				if($scope.user.household_members[users].applying){
					applying += 1;
					income += (typeof $scope.user.household_members[users].income !== 'undefined') ? parseInt($scope.user.household_members[users].income) : 0;
				}

			}

			var house = applying;
			var grossIncome = income - expenses;
			var benefit = 0;
			var eligible = false;


			if($scope.user.personal_disabled === "Yes" || $scope.user.disabled === "yes") {

				if( (house === 1 && grossIncome <= 1915) ||
					(house === 2 && grossIncome <= 2585) ||
					(house === 3 && grossIncome <= 3255) ||
					(house === 4 && grossIncome <= 3925) )
				{
					eligible = true;
				}
				else if(house >= 5 && (grossIncome <= (((house-4)*670)+3925)) ){
					eligible = true;
				}
			}
			else {
				if( (house === 1 && grossIncome <= 1245) ||
					(house === 2 && grossIncome <= 1681) ||
					(house === 3 && grossIncome <= 2116) ||
					(house === 4 && grossIncome <= 2552) )
				{
					eligible = true;
				}
				else if(house >= 5 && (grossIncome <= (((house-4)*436)+2552)) ){
					eligible = true;
				}
			}

			if(eligible){
				if(house === 1){ benefit=189; }
				else if(house === 2){ benefit=347;}
				else if(house === 3){ benefit=497;}
				else if(house === 4){ benefit=632;}
				else if(house === 5){ benefit=750;}
				else if(house === 6){ benefit=900;}
				else if(house === 7){ benefit=995;}
				else if(house === 8){ benefit=1137}
				else if(house >= 9) {
					benefit = 1337 + (142*(house-8))
				}
			}

			$scope.estimated_benefit = benefit;

		}



		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
			if(fromState.name !== 'int.main' && $scope.int_progress < 100){
				updateProgress(fromState.name);
			}
			if(fromState.name == 'int.main') {
				$scope.show_interview_progress = true;
			}
			if(toState.name == 'int.main'){
				$scope.show_interview_progress = false;
			}

			switch(toState.name) {
			    case "int.ssn":
			    case "int.dob":
			    case "int.marital_status":
			    case "int.disabled":
			    case "int.citizen":
			        $scope.interview_steps = 0;
			        break;
			    case "int.household":
			    case "int.household-applying":
			    case "int.household-ssn":
			    case "int.household-dob":
			    case "int.household-relation":
			        $scope.interview_steps = 1;
			        break;
			    case "int.income-frequency":
			    case "int.income-hours":
			    case "int.income-household-amount":
			    case "int.income-household-frequency":
			        $scope.interview_steps = 2;
			        break;
			    case "int.resources":
			    case "int.expenses-mortgage":
			        $scope.interview_steps = 3;
			        break;
			    case "int.main":
			        $scope.interview_steps = -1;
			        break;
			    default:
			        $scope.interview_steps = -1;
			}
			updateProgressStatus();
		});


		$scope.submitBasicApp = function() {
			API.uploadPartialInterviewInfo($scope.user, function(result){
				if(result) {
					$state.go('upload.documents');
				}
				else {
					alert("Oops! Looks like something went wrong. Your form was NOT submitted. Please wait and try again.");
				}
			});
		};

		/**
		 * Takes the number in formData.household and allows ng-repeat to create n items
		 * @param n
		 * @returns {Array}
		 */
		$scope.getNumber = function(n) {
			return new Array(n-1);
		};

		/**
		 * Back Button
		 * **/
		$scope.goBack = function() {
			window.history.back();
		};

		$scope.scrollDown = function() {
			$location.hash('confirm_anchor');
			$anchorScroll();
		};

		function isEmpty(object) {

			for(var i in object) {
				if(object.hasOwnProperty(i)){
					return true;
				}
			}
			return false;
		}


	});