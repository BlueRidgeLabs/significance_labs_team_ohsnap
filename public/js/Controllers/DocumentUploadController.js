/**
 * Created by airswoop1 on 7/23/14.
 */

angular.module('formApp.documentUploadCtrl', ['formApp.ngDocumentFullscreen', 'formApp.DocumentUploader','formApp.userDataFactory', 'formApp.sampleDocumentsDirective']).controller('documentUploadCtrl',
	function($scope, $upload, $state, $stateParams, $rootScope, $location, $window, documentUpload, userDataFactory){

		$scope.docs = userDataFactory.userData.docs;
		$scope.docProgress = userDataFactory.userData.docProgress;

		$scope.user = (typeof userDataFactory.userData.user.formData !== "undefined") ? userDataFactory.userData.user.formData : {};

		$scope.DOC_STATUS = {
			"UPLOADED": 2,
			"IN_PROGRESS":1,
			"NOT_UPLOADED":0
		};

		$scope.localDocs = {
			'IDENTITY':0,
				'RESIDENCE':0,
				'HOUSEHOLD_COMPOSITION':0,
				'AGE':0,
				'SSN':0,
				'CITIZENSHIP':0,
				'ALIEN_STATUS':0,
				'EARNED_INCOME':0,
				'ALT_INCOME':0,
				'RESOURCES':0
		};

		$scope.current_type = $state.params.type;
		$scope.docSafetyOpen = false;

		$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState){
			if(toParams){
				$scope.current_type = toParams.type;
			}
		});


		$scope.renderImg = function(type, url) {
				$scope.localDocs[type] = url;
		};

		$scope.isNotUploaded = function(name) {
			return $scope.docs[name] === $scope.DOC_STATUS.NOT_UPLOADED;
		};

		$scope.isInProgress = function(name) {
			return $scope.docs[name] === $scope.DOC_STATUS.IN_PROGRESS;
		};

		$scope.isUploaded = function(name) {
			return $scope.docs[name] === $scope.DOC_STATUS.UPLOADED;
		};


		$scope.goToDocUpload = function(name) {
			$state.go('upload.detail', {'type':name});

		};

		$scope.getCurrentContent = function(){
			var type =  $state.params.type;
			$scope.current_sample_image = $scope.docContent[type].sample_image;
			return $scope.docContent[type].header;
		};

		$scope.getDocDetailState = function() {
			return $scope.docs[$state.params.type];
		};

		$scope.getCurrentType = function() {
			if($state.params.type == "ALT_INCOME") {
				return "OTHER INCOME";
			} else if($state.params.type == "EARNED_INCOME") {
				return "INCOME";
			} else {
				return $state.params.type ? $state.params.type : "Documents";
			}
		};


		$scope.uploadFile = function($files) {
			//display upload in progress;
			var type = $state.params.type;

			$scope.docs[type] = $scope.DOC_STATUS.IN_PROGRESS;
			$scope.uploadProgress(type);
			console.log($files);

			documentUpload.onFileSelect($files, $scope, type, $scope.user.user_id).then(
				//it succeeeded
				function(result){

					$scope.docProgress[type] = 100;
					$scope.docs[type] = $scope.DOC_STATUS.UPLOADED;
				},
				//it failed
				function(reason){
					$scope.docs[type] = $scope.DOC_STATUS.NOT_UPLOADED;
					//throw some sort of error indicating failure.
					alert('Sorry we were unable to upload your documents, please try again');

				})
		};

		$scope.uploadProgress = function(type) {
			$scope.docProgress[type] += 10;

			var upload = setInterval(function(){

				if($scope.docProgress[type] < 100 && $scope.docs[type] !== $scope.DOC_STATUS.UPLOADED){
					$scope.docProgress[type] += 10;
				}
				else{
					$scope.docProgress[type] = 100;
					clearInterval(upload);
				}

			},50);

		};


		//update status based on whats in the db
		$scope.updateUploadedFilesStatus = function(data) {

			var status = data.status;
			if(status){
				for (var uploaded in status){
					if(status.hasOwnProperty(uploaded)){
						$scope.docs[uploaded] = status[uploaded];
					}
				}
			}

		};


		$window.onbeforeunload = function(){
			var message = 'Your documents are still uploading! If you leave now they won\'t be submitted.';

			if($scope.docStillUploading()){

				if (typeof event == 'undefined') {
					event = window.event;
				}
				if (event) {
					event.returnValue = message;
				}
				return message;
			}
			else{
				return null;
			}
		};


		$scope.docStillUploading = function() {
			var uploading = false;
			for(var x in $scope.docs){
				uploading = (uploading || ($scope.docs[x] === $scope.DOC_STATUS.IN_PROGRESS)) ;
			}

			return uploading;

		};

		//API.getDocumentStatus($scope.user_id, $scope.updateUploadedFilesStatus);

		$scope.docContent = {
			'IDENTITY':{
				header:"Take a picture of 1 of these documents to confirm your identity.",
				sample_image:"sample_id.png",
				valid_docs : [
					{
						"name":"Drivers license or state photo ID",
						"image":"sample_dl.jpg",
						"link":"http://dmv.ny.gov/driver-license/get-driver-license"
					},
					{
						"name":"US Passport",
						"image":"sample_passport.jpg",
						"link":"https://www.usps.com/shop/apply-for-a-passport.htm"
					}
				]

			},
			'RESIDENCE':{
				header:"Take a picture of 1 of these documents to confirm where you live.",
				sample_image:"sample_address.png",
				valid_docs : [
					{
						"name":"Lease",
						"image":"sample_lease.jpg",
						"link":"http://www.ehow.com/how_6147098_request-copy-apartment-lease-mail.html"
					},
					{
						"name":"Statement from landlord or primary tenant",
						"image":"sample_addressstatement.jpg",
						"link":"http://www.wikihow.com/Write-a-Letter-Showing-Proof-of-Residence-for-a-Tenant"
					},
					{
						"name":"Mortgage record",
						"image":"sample_mortgagerecord.jpg",
						"link":"http://a836-acris.nyc.gov/CP/"
					}
				]
			},
			'HOUSING_EXPENSE':{
				header:"Take a picture of 1 of these documents to confirm how much you pay for housing.",
				sample_image:"sample_housingexpense.png",
				valid_docs : [
					{
						"name":"Lease, if you do not split the rent",
						"image":"sample_lease.jpg",
						"link":"http://www.ehow.com/how_6147098_request-copy-apartment-lease-mail.html"
					},
					{
						"name":"Rent receipt, if you do not split the rent",
						"image":"sample_rentreceipt.jpg",
						"link":"http://www.masslegalhelp.org/housing/private-housing/ch3/security-deposit-landlords-responsiblities"
					},
					{
						"name":"Statement from roommates, if you split the rent",
						"image":"sample_housingstatement.jpg",
						"link":"http://www.lawdepot.com/contracts/roommate-agreement/"
					}
				]
			},
			'HOUSEHOLD_COMPOSITION':{
				header:"Take a picture of 1 of these documents to prove who lives with you.",
				sample_image:"sample_household.png",
				valid_docs : [
					{
						"name":"Statement from your landlord",
						"image":"sample_addressstatement.jpg",
						"link":"http://www.wikihow.com/Write-a-Letter-Showing-Proof-of-Residence-for-a-Tenant"
					},
					{
						"name":"School records",
						"image":"sample_schoolrecord.jpg",
						"link":"http://www1.nyc.gov/nyc-resources/service/2557/student-record-request"
					}
				]
			},

			'UTILITIES':{
				header:"Take a picture of 1 of these documents to confirm utilities you pay for separate from rent.",
				sample_image:"sample_utilities.png",
				valid_docs : [
					{
						"name":"Utility bill",
						"image":"sample_utility.jpg"

					},
					{
						"name":"Telephone bill",
						"image":"sample_phonebill.jpg"
					}
				]
			},
			'SSN':{
				header:"Take a picture of 1 of these documents to confirm your Social Security Number.",
				sample_image:"sample_ssn.png",
				valid_docs : [
					{
						"name":"Social Security Card",
						"image":"sample_ssn.jpg",
						"link":"http://www.nyc.gov/html/id/html/how/social_security_card.shtml"
					},
					{
						"name":"Official mail from the SSA",
						"image":"sample_ssamail.jpg"
					}
				]
			},
			'CITIZENSHIP':{
				header:"Take a picture of one of these documents to confirm your citizenship status.",
				sample_image:"sample_citizen.png",
				valid_docs : [
					{
						"name":"US Passport",
						"image":"sample_passport.jpg",
						"link":"https://www.usps.com/shop/apply-for-a-passport.htm"
					},
					{
						"name":"US Birth Certificate",
						"image":"sample_birth_cert.jpg",
						"link":"http://www.nyc.gov/html/id/html/how/birth_certificate.shtml"
					},
					{
						"name":"US Military service record",
						"image":"sample_military.jpg",
						"link":"http://themilitarywallet.com/how-to-get-a-military-id-card/"
					},
					{
						"name":"Naturalization Certificate",
						"image":"sample_naturalization.jpg",
						"link":"http://www.uscis.gov/tools/how-do-i-customer-guides/how-do-i-guides-us-citizens/how-do-i-obtain-certified-true-copies-certificate-naturalization"
					}
				]
			},
			'EARNED_INCOME':{
				header:"Take a picture of 1 of these documents to confirm income that you've earned.",
				sample_image:"sample_income.png",
				valid_docs : [
					{
						"name":"Pay stub",
						"image":"sample_paystub.jpg",
						"link":"http://www.ehow.com/how_8353804_copy-pay-stubs.html"
					},
					{
						"name":"Tax return",
						"image":"sample_taxreturn.jpg",
						"link":"http://www.irs.gov/Individuals/Get-Transcript"
					},
					{
						"name":"Statement from employer",
						"image":"sample_incomestatement.jpg",
						"link":"hhttp://www.wikihow.com/Write-a-Letter-for-Proof-of-Income"
					},
					{
						"name":"Invoice, if you are self-employed",
						"image":"sample_invoice.jpg"
					}
				]
			},
			'ALT_INCOME':{
				header:"Take a picture of 1 of these documents to confirm alternate sources of income.",
				sample_image:"sample_altincome.png",
				valid_docs : [
					{
						"name":"Current unemployment award certificate",
						"image":"sample_unemploymentcert.jpg",
						"link":"http://www.ehow.com/how_8421455_do-proof-unemployment.html"
					},
					{
						"name":"Current Social Security benefit check",
						"image":"sample_sscheck.jpg",
						"link":"http://www.ssa.gov/pubs/EN-05-10552.pdf"
					},
					{
						"name":"Statement from person paying child support",
						"image":"empty.jpg",
						"link":"http://info.legalzoom.com/evidence-child-support-payments-23480.html"
					},
					{
						"name":"Check stubs from child support",
						"image":"empty.jpg",
						"link":"http://info.legalzoom.com/evidence-child-support-payments-23480.html"
					},
					{
						"name":"Current veteran's benefit check",
						"image":"empty.jpg",
					},
					{
						"name":"Current worker's compensation certificate",
						"image":"sample_workerscompcert.jpg"
					}

				]
			}
		};

		$scope.goBack = function() {
			window.history.back();
		};

	});