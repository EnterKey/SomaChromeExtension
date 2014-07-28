// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function(e) {
	var srcElement 	= e.srcElement,
		url 		= document.URL;
		
	if(url.indexOf("https://www.facebook.com") != -1) { // 처음 방문한 페이지 인 경우
		// facebook 인 경우, facebook은 userContent
		if((url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1)) {
			var userContent = document.getElementsByClassName("userContent");
			userContent = userContent[0].innerText;
			console.log(userContent);
		} else {
			// var userContent = srcElement.innerText || 'fail';
			// console.log(userContent);
			var userContentWrapper = findUpTag(srcElement), 
				userContent = userContentWrapper.getElementsByClassName('userContent'),
				innerText = userContent[0].innerText;
			
			console.log(innerText);
		}
	} else {
		console.log(srcElement.innerText);
	}
	
	// Lets check if our underlying element is a DIV.
	if (srcElement.nodeName == 'DIV') {

		// For NPE checking, we check safely. We need to remove the class name
		// Since we will be styling the new one after.
		if (prevDOM != null) {
			prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
		}

		// Add a visited class name to the element. So we can style it.
		srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

		// The current element is now the previous. So we can remove the class
		// during the next iteration.
		prevDOM = srcElement;
	}
}, false);

function findUpTag(el) {
    while (el.parentNode) {
        el = el.parentNode;
        if (el.className === 'userContentWrapper _5pcr _3ccb')
            return el;
    }
    return null;
} 