var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var prevDOM = null;

document.addEventListener('mousemove', function(e) {
	var srcElement 	= e.srcElement,
		url 		= document.URL;
		
	if(url.indexOf("https://www.facebook.com") != -1) { // 처음 방문한 페이지 인 경우
		// facebook 인 경우, facebook은 userContent
		if((url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1)) {
			var userContent = document.getElementsByClassName("userContent");
			userContent 	= userContent[0].innerText;
			
			console.log(userContent);
		} else {
			var userContentWrapper = findUpTag(srcElement);
			
			if(userContentWrapper != null) {
				var userContent 		= userContentWrapper.getElementsByClassName('userContent'),
				 	userContentLink 	= userContentWrapper.getElementsByClassName('_5pcq'),
				 	href 				= userContentLink[0].href, 
					innerText 			= userContent[0].innerText;
					
				console.log(href);
				console.log(innerText);
			} 
		}
	} else {
		console.log(srcElement.innerText);
	}
	
	if (srcElement.nodeName == 'DIV') {
		if (prevDOM != null) {
			prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
		}

		srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
		prevDOM = srcElement;
	}
}, false);

function findUpTag(el) {
    while (el.parentNode) {
        el = el.parentNode;
        if (el.className.indexOf('userContentWrapper') != -1)
            return el;
    }
    return null;
} 


var showInfo = function () {
    console.log("Show Info is invoked");
};

var showAnotherInfo = function () {
    console.log("Show Another Info");
};

chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "addVisitInfo") {
        showInfo();
    }
    if (message.functiontoInvoke == "showAnotherInfo") {
        showAnotherInfo();
    }
});