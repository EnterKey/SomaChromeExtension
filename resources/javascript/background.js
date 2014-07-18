if ( typeof (chromeExtension) == typeof (undefined)) {
	chromeExtension = {};
}

chromeExtension.getVisitPageInfos = function(userKey) {
	var requestUrl = "http://localhost:3000/getVisitPageInfos";
	var data = {
		userKey : null
	};
	
	data.userKey = userKey;

	console.log('test getVisitPageInfos');
	$.post(requestUrl, data, function(result) {
		if(result.status) {
			chromeExtension.getVisitPageInfosCallback(result.data);
		} else {
			console.log(result.errorMessage);
		}
	});
};

chromeExtension.getVisitPageInfosCallback = function(visitedPageInfos) {
	console.dir(visitedPageInfos);

	for (var i = 0; i < visitedPageInfos.length; i++) {
		var visitedPageInfo = JSON.parse(visitedPageInfos[i]);
		if (visitedPageInfo != null) {
			visitedPageInfo.visitedCnt += 1;
		} else {
			visitedPageInfo = {};
			visitedPageInfo.visitedCnt = 1;
			visitedPageInfo.url = url;
			visitedPageInfo.title = title;
			visitedPageInfo.date = new Date();
		}
		// chromeExtension.setVisitPageInfo(userKey, visitedPageInfo);
	}
};


chromeExtension.setVisitPageInfo = function(userKey, visitPageInfo) {
	var requestUrl = "http://localhost:3000/setVisitPageInfo";
	var data = {
		userKey : null,
		visitPageInfo : null
	};
	
	data.userkey = userKey;
	data.visitPageInfo = visitPageInfo;

	console.log('test setVisitPageInfo');
	$.post(requestUrl, data, function(result) {
		console.log(result);
	});
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (changeInfo.status === 'complete') {
		chrome.tabs.get(tabId, function(tab) {
			var url = tab.url, title = tab.title;
			var userKey = 'test@gmail.com'; 
			
			chromeExtension.getVisitPageInfos(userKey);
		});
	}
});

