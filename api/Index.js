/**
 * Created by airswoop1 on 6/17/14.
 */


var Index = (function(){

    var execute = function(req,res){
        res.redirect('/index.html');
    }

    return {
        "execute": execute
    }
}());

module.exports = Index;