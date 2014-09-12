/**
 * Created by airswoop1 on 6/17/14.
 */
var Index = require('./Index.js'),
    UploadUserInfo = require('./UploadUserInfo.js'),
	UpdateUserInfo = require('./UpdateUserInfo.js'),
    DocumentationUpload = require('./DocumentationUpload.js'),
    SubmitFeedback = require('./SubmitFeedback.js'),
    DocumentStatus = require('./DocumentStatus.js');


var api = (function(){

    function set_routes(app){
        app.get('/', Index.execute);
        app.post('/upload_user_info', UploadUserInfo.execute);
        app.get('/upload_user_info', UploadUserInfo.execute);
	    app.post('/update_user_info', UpdateUserInfo.execute);
        app.post('/upload_docs', DocumentationUpload.execute);
        app.post('/submit_feedback', SubmitFeedback.execute);
        app.post('/get_doc_status', DocumentStatus.execute);
    }

    return {
        "set_routes":set_routes
    }

}());

module.exports = api;