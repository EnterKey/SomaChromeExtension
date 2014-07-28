if ( typeof (visitPage) == typeof (undefined)) {
	visitPage = {};
}

visitPage.buildVisitedSiteList = function () {
	chrome.tabs.query({
		active : true,
		lastFocusedWindow : true
	}, function(tabs) {
		var tab 			= tabs[0],
			url 			= tab.url, 
			title 			= tab.title,
			code 			= null,
			visitedPageInfo = JSON.parse(window.localStorage.getItem(url));
			
		
		if (visitedPageInfo == null) { // 기존에 방문 했던 페이지 인지 조사
			if(url.indexOf("https://www.facebook.com") != -1) { // 처음 방문한 페이지 인 경우
				// facebook 인 경우, facebook은 userContent
				if((url.indexOf('/posts/') != -1 || url.indexOf('/permalink/') != -1)) {
					code = 'var userContent = document.getElementsByClassName("userContent");' +
						   'userContent = userContent[0].innerHTML' + 
				           '({' +
				           '    title: document.title,' +
				           '    description: userContent || ""' +
				           '});';
				}
			} else { // facebook 이 아닌 경우	
				var meta = $('meta[name=description]').attr('content');
				code = 'var meta = document.querySelector("meta[name=\'description\']");' + 
			           'if (meta) meta = meta.getAttribute("content");' +
			           '({' +
			           '    title: document.title,' +
			           '    description: meta || ""' +
			           '});';
			}
			
			chrome.tabs.executeScript({
			    code: code
			}, function(results) {
			    if (!results) {
			        // An error occurred at executing the script. You've probably not got the permission to execute a content script for the current tab
			        return;
			    }
				console.dir(results);			    
			    var result 			= {};
			    result.title 		= results[0].title;
			    result.description 	= results[0].description;
			    // Now, do something with result.title and result.description
				
			    visitedPageInfo				= {};
				visitedPageInfo.url 		= url;
				visitedPageInfo.title 		= title;
				visitedPageInfo.date 		= new Date();
				visitedPageInfo.description = result.description;
				visitedPageInfo.visitedCnt	= 1;
				
				// 중복되는 부분이므로 함수로 따로 빼주자
				window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
				visitPage.buildPopupDom();
			});
			
		} else {	// 처음 방문한 페이지가 아닌 경우
			
			visitedPageInfo.visitedCnt += 1;
			window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
			visitPage.buildPopupDom();
		}
		
	});
	
};

visitPage.buildPopupDom = function () {
	var divName = 'visitedUrl_div', 
		popupDiv = $('#' + divName), 
		visitPageInfoList = new Array(), 
		key;
		
	if (window.localStorage.length > 0) {
		for (var i = 0, ie = window.localStorage.length ; i < ie; i++) {
			key = window.localStorage.key(i);
			visitPageInfoList.push(JSON.parse(window.localStorage.getItem(key)));
		}

		visitPageInfoList.sort(function(a, b) {
			return b.visitedCnt - a.visitedCnt;
		});

		var ul = $('<ul>');
		popupDiv.append(ul);

		for (var i = 0, ie = visitPageInfoList.length; i < ie; ++i) {
			var a = $('<a>').attr('href', visitPageInfoList[i].url).text('TITLE : ' + visitPageInfoList[i].title + ', Description : ' + visitPageInfoList[i].description + ', VisitCnt : ' + visitPageInfoList[i].visitedCnt);
			a.on('click', this.onAnchorClick);

			var li = $('<li>');
			li.append(a);
			ul.append(li);
		}
	}
};

visitPage.onAnchorClick = function (event) {
	chrome.tabs.create({
		selected : true,
		url : event.toElement.href
	});
	return false;
};

$(document).on('DOMContentLoaded', function() {
	visitPage.buildVisitedSiteList();
});