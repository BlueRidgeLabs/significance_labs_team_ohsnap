/**
 * Created by kmiller on 7/2/14.
 */
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
    }
};

function detectDevice(){
    if(isMobile.Android()){
        return "Android";
    }
    else if(isMobile.iOS()){
        return "iOS";
    }
    else if(isMobile.Opera()){
        return "Opera"
    }
    else if(isMobile.Windows()){
        return "Windows"
    }
    else if(isMobile.BlackBerry()){
        return "Blackberry"
    }
    else{
        return "OTHER"
    }
}


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

var device_type = detectDevice();
if(window.location.host.split('.')[0] == 'easyfoodstamps'){
	ga('create', 'UA-52493533-1', 'auto');
	ga('require', 'displayfeatures');
	ga('set', 'dimension1', device_type);
}





