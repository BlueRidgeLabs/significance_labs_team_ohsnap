/**
 * Created by airswoop1 on 7/23/14.
 */

var DocumentStatus = (function() {

    var execute = function(req, res){
     /*
     * check if user ID is valid
     * query db for doc_status array
     * send back
     * */

        var status = {
            'IDENTITY':0,
            'RESIDENCE':0,
            'HOUSEHOLD_COMPOSITION':0,
            'AGE':0,
            'SSN':0,
            'CITIZENSHIP':0,
            'ALIEN_STATUS':0,
            'EARNED_INCOME':0,
            'UNEARNED_INCOME':0,
            'RESOURCES':0
        };
        res.send(200, {"status":status})

    };

    return {
        "execute":execute
    }
}());

module.exports = DocumentStatus;