/**
 * Created by airswoop1 on 7/30/14.
 */
angular.module('formApp.userDataFactory',[]).factory('userDataFactory',
	function(){

		this.DOC_STATUS = {
			"UPLOADED": 2,
			"IN_PROGRESS":1,
			"NOT_UPLOADED":0
		};

		var userData = {
			'docs' : {
				'IDENTITY':this.DOC_STATUS.NOT_UPLOADED,
				'RESIDENCE':this.DOC_STATUS.NOT_UPLOADED,
				'HOUSEHOLD_COMPOSITION':this.DOC_STATUS.NOT_UPLOADED,
				'AGE':this.DOC_STATUS.NOT_UPLOADED,
				'SSN':this.DOC_STATUS.NOT_UPLOADED,
				'CITIZENSHIP':this.DOC_STATUS.NOT_UPLOADED,
				'ALIEN_STATUS':this.DOC_STATUS.NOT_UPLOADED,
				'EARNED_INCOME':this.DOC_STATUS.NOT_UPLOADED,
				'ALT_INCOME':this.DOC_STATUS.NOT_UPLOADED,
				'RESOURCES':this.DOC_STATUS.NOT_UPLOADED
			},
			docProgress : {
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
			},

			'interviewProgress': {
				"eligibility":false,
				"household":false,
				"income":false,
				"expenses":false
			},

			'user':{}
		};




		return {
			"userData":userData
		};

	});