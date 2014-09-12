/**
 * Created by airswoop1 on 7/11/14.
 */
angular.module('formApp.apiFactory',[]).factory('API', function($http) {
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
})