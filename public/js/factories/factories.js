/**
 * Created by airswoop1 on 6/25/14.
 */


angular.module('formApp.DocumentUploader',[]).factory('documentUpload', ["$http", "$upload", "$q", function($http, $upload, $q) {

    function resizeDocument(file, doc_type, renderFn, callback) {

        var reader = new FileReader();
        reader.readAsDataURL(file);


        reader.onloadend = function(evt) {
            var tempImg = new Image();
            tempImg.src = reader.result;


            tempImg.onload = function () {

                var MAX_WIDTH = 800,
                    MAX_HEIGHT = 600,
                    tempW = tempImg.width,
                    tempH = tempImg.height;


                //  is it landscape? if so...
                if (tempW > tempH) {
                    if (tempW > MAX_WIDTH) {
                        tempH *= MAX_WIDTH / tempW;
                        tempW = MAX_WIDTH;
                    }
                } else {
                    if (tempH > MAX_HEIGHT) {
                        tempW *= MAX_HEIGHT / tempH;
                        tempH = MAX_HEIGHT;
                    }
                }

                var canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;


                var ctx = canvas.getContext("2d");
                ctx.drawImage(this,0, 0, tempW, tempH);


                var dataURL = canvas.toDataURL(file.type);

	            renderFn(doc_type ,dataURL);

                callback(dataURL);
            }
        }
    }



    return {
        onFileSelect : function($files, $scope, type, user_id) {
            var deferred = $q.defer(),
                file = $files[0],
                data = {
                    'user_id':user_id,
                    'document_type':type,
                    'file_name': file.name,
                    'file_type':file.type
                };



            if(/(iPad|iPhone|iPod)/g.test( navigator.userAgent )){

                data['platform'] = 'ios';
	            if (window.FileReader) {
					var fileReader = new FileReader();
		            fileReader.readAsDataURL(file);
		            fileReader.onloadend = function(evt){
			            $scope.renderImg(type, evt.target.result);
		            }

	            }
                $scope.upload = $upload.upload(
                    {
                        'url': '/upload_docs',
                        'data': data,
                        'file' : file
                    }
                )
                .progress(function(evt) {
                    return deferred.promise;
                })
                .success(function(d, status, headers, config) {
                    // file is uploaded successfully

                    return deferred.resolve(d);
                })
                .error(function(err, data){
                    return deferred.reject(err);
                });


            }
            else{
                resizeDocument(file, type, $scope.renderImg, function(file_url){

                    data['file_base64'] = file_url;
                    data['platform'] = 'other';

                    $scope.upload = $upload
                        .upload({
                            'url': '/upload_docs',
                            'data': data
                        })
                        .progress(function(evt) {


                        })
                        .success(function(d, status, headers, config) {
		                    d["data"] = data;

                            // file is uploaded successfully
                            return deferred.resolve(d);
                        })
                        .error(function(err){
                            return deferred.reject(err);
                        });


                });

            }

            return deferred.promise;
        }
    }
}])
/**
 * Created by airswoop1 on 7/11/14.
 */
angular.module('formApp.apiFactory',[]).factory('API', ["$http", function($http) {
    return {
        uploadFeedback : function(formData, callback) {
            $http.post('/submit_feedback', JSON.stringify(formData))
                .success(function(data, status) {

                    if(status === 201){
                        callback(true);
                    }
                    else {
                        callback(null);
                    }
                })
                .error(function(data) {
                    console.log(data);
                    callback(null)

                });
        },

        uploadBasicInfo : function(formData, callback) {

            $http.post('/upload_user_info', JSON.stringify(formData))
                .success(function(data, status) {

                    if(status === 201){
                        callback(true, data.user_id);
                    }
                    else {
                        callback(null);
                    }
                })
                .error(function(data) {
                    console.log(data);

                    callback(null)

                });
        },

        getDocumentStatus : function(user_id, callback) {
          $http.post('/get_doc_status',JSON.stringify({"user_id":user_id}))
              .success(function(data, status){
                  callback(data);
              })
              .error(function(data){
                  callback(null);
              });
        },

	    uploadPartialInterviewInfo : function(formData, callback) {
		    $http.post('/update_user_info', JSON.stringify(formData))
			    .success(function(data, status) {

				    if(status === 201){
					    callback(true);
				    }
				    else {
					    callback(null);
				    }
			    })
			    .error(function(data) {
				    console.log(data);

				    callback(null)

			    });


	    }


    }
}])
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