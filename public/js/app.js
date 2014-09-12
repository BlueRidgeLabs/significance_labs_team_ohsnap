/**
 * Created by airswoop1 on 6/10/14.
 */
// app.js
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
var app = angular.module('formApp',['ui.router', "ngAnimate", 'formApp.formController',
		'formApp.interviewCtrl','formApp.documentUploadCtrl'])

// configuring our routes
// =============================================================================
	.config(function($stateProvider, $urlRouterProvider) {

		$stateProvider

			/************Step 1 - Initial Questions ****************/

			// route to show our basic form (/form)
			.state('form', {
				url: '/form',
				templateUrl: 'templates/basic/form.html',
				controller: 'formController'
			})

			.state('form.intro', {
				url: '/intro',
				templateUrl: 'templates/basic/form-intro.html'
			})

			.state('form.recert', {
				url: '/recert',
				templateUrl: 'templates/basic/form-recert.html'
			})

			.state('form.name', {
				url: '/name',
				templateUrl:'templates/basic/form-name.html'
			})

			.state('form.address', {
				url: '/address',
				templateUrl: 'templates/basic/form-address.html'
			})

			.state('form.telephone', {
				url: '/telephone',
				templateUrl: 'templates/basic/form-telephone.html'
			})

			.state('form.income', {
				url: '/income',
				templateUrl:'templates/basic/form-income.html'
			})

			.state('form.household', {
				url:'/household',
				templateUrl:'templates/basic/form-household.html'
			})

			.state('form.eligibility-expenses', {
				url:'/eligibility-expenses',
				templateUrl:'templates/basic/form-eligible-expenses.html'
			})

			.state('form.expenses', {
				url:'/expenses',
				templateUrl:'templates/basic/form-expenses.html'
			})

			.state('form.eligibility', {
				url:'/elibility',
				templateUrl:'templates/basic/form-eligibility.html'
			})


			.state('form.basic-confirmation', {
				url: '/basic-confirmation',
				templateUrl: 'templates/basic/form-basic-confirmation.html'
			})

			.state('form.basic-app-submitted', {
				url: '/app-submitted',
				templateUrl: 'templates/basic/basic-app-submitted.html'
			})

			.state('form.feedback-submitted', {
				url: '/feedback-submitted',
				templateUrl:'templates/basic/form-feedback-submitted.html'
			})



			/************************ Step 2 - INTERVIEW ****************/

			.state('int', {
				url:'/interview',
				templateUrl:'templates/interview/interview.html',
				controller: 'interviewCtrl'
			})

			.state('int.main', {
				url:'/main',
				templateUrl:'templates/interview/interview-main.html'
			})

			.state('int.ssn', {
				url:'/ssn',
				templateUrl:'templates/interview/interview-ssn.html'
			})

			.state('int.dob', {
				url:'/dob',
				templateUrl:'templates/interview/interview-dob.html'
			})

			.state('int.marital_status', {
				url:'/marital_status',
				templateUrl:'templates/interview/interview-marital-status.html'
			})

			.state('int.disabled', {
				url:'/disabled_or_pregnant',
				templateUrl:'templates/interview/interview-disabled.html'
			})

			.state('int.citizen', {
				url:'/citizen',
				templateUrl:'templates/interview/interview-citizen.html'
			})

			.state('int.household', {
				url:'/household-names',
				templateUrl:'templates/interview/interview-household-names.html'
			})

			.state('int.household-applying', {
				url: '/household-applying',
				templateUrl: 'templates/interview/interview-household-applying.html'
			})

			.state('int.household-ssn', {
				url: '/household-ssn',
				templateUrl: 'templates/interview/interview-household-ssn.html'
			})

			.state('int.household-dob', {
				url: '/household-dob',
				templateUrl: 'templates/interview/interview-household-dob.html'
			})

			.state('int.household-relation', {
				url: '/household-relation',
				templateUrl: 'templates/interview/interview-household-relation.html'
			})

			.state('int.income-frequency', {
				url: '/income-frequency',
				templateUrl: 'templates/interview/interview-income-frequency.html'
			})

			.state('int.income-hours', {
				url: '/income-hours',
				templateUrl: 'templates/interview/interview-income-hours.html'
			})

			.state('int.income-household-amount', {
				url: '/income-household-amount',
				templateUrl: 'templates/interview/interview-income-household-amount.html'
			})

			.state('int.income-household-frequency', {
				url: '/income-household-frequency',
				templateUrl: 'templates/interview/interview-income-household-frequency.html'
			})

			.state('int.resources', {
				url: '/resources',
				templateUrl: 'templates/interview/interview-resources.html'
			})

			.state('int.expenses-mortgage', {
				url: '/expenses-mortgage',
				templateUrl: 'templates/interview/interview-expenses-mortgage.html'
			})

			.state('int.expenses-utilities', {
				url: '/expenses-utilities',
				templateUrl: 'templates/interview/interview-expenses-utilities.html'
			})

			.state('int.expenses-utilities-total', {
				url: '/expenses-utilities-total',
				templateUrl: 'templates/interview/interview-expenses-utilities-total.html'
			})

			.state('int.info-confirmation', {
				url: '/confirmation',
				templateUrl: 'templates/interview/interview-info-confirmation.html'
			})


		/********************* DOCUMENTS ****************************************/

			.state('upload', {
				url:'/upload',
				templateUrl:'templates/documents/upload-main.html',
				controller: 'documentUploadCtrl'

			})

			.state('upload.documents',{
				url:'/documents',
				templateUrl:'templates/documents/form-document-upload.html'
			})


			.state('upload.detail',{
				url:'/detail?type',
				templateUrl:'templates/documents/form-document-detail.html'
			})


		// catch all route
		// send users to the form page
		$urlRouterProvider.otherwise('/form/intro');
	})

/**************** Google Analytics Send event on page tarnsition ****************/
	.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
		$rootScope
			.$on('$stateChangeSuccess',
			function(event){

				if (!$window.ga)
					return;

				$window.ga('send', 'pageview', { page: $location.path() });
			});

	}]);


