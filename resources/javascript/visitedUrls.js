if ( typeof (visitPage) == typeof (undefined)) {
	visitPage = {};
}

visitPage.buildVisitedSiteList = function () {
	chrome.tabs.query({
		active : true,
		lastFocusedWindow : true
	}, function(tabs) {
		var tab = tabs[0];
		/*
		 	tab info : 
		 	
		 	active: true
			favIconUrl: "http://www.naver.com/favicon.ico?1"
			height: 779
			highlighted: true
			id: 661
			incognito: false
			index: 0
			pinned: false
			selected: true
			status: "complete"
			title: "NAVER"
			url: "http://www.naver.com/"
			width: 720
			windowId: 653
			*
		 */
		
		var url = tab.url, 
			title = tab.title,
			visitedPageInfo = JSON.parse(window.localStorage.getItem(url));
			
		if (visitedPageInfo != null) {
			visitedPageInfo.visitedCnt += 1;
		} else {
			visitedPageInfo = {};
			visitedPageInfo.url = url;
			visitedPageInfo.title = title;
			visitedPageInfo.date = new Date();
			visitedPageInfo.visitedCnt = 1;
		}
		
		window.localStorage.setItem(visitedPageInfo.url, JSON.stringify(visitedPageInfo));
		visitPage.buildPopupDom();
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
			var a = $('<a>').attr('href', visitPageInfoList[i].url).text('TITLE : ' + visitPageInfoList[i].title + ', URL : ' + visitPageInfoList[i].url + ', VisitCnt : ' + visitPageInfoList[i].visitedCnt);
			a.bind('click', this.onAnchorClick);

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

$(document).bind('DOMContentLoaded', function() {
	visitPage.buildVisitedSiteList();
});