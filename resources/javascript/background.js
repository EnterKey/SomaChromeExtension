// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler(info, tab) {
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
	console.dir(info);
	console.dir(tab);
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
	"title" : "My Extension에 저장",
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : getClickHandler
}, null);

