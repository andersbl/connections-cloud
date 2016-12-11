'use strict';

var restify = require('restify'),
	async = require('async');

class ConnectionsCloud {
	constructor (server, username, password) {
		this.client = restify.createStringClient({
			url: 'https://' + server,
			// TODO likely needs Restify 5.x
			// followRedirects: true
		});

		this.client.basicAuth(username, password);
		this.formatter = require('@ics-demo/cnx2js');
		this.lang = 'en_us';
	}

	_execute(path, callback, raw) {
		console.log(`connecting to ${path} ...`);
		this.client.get(path, (err, req, res, content) => {
			console.log(`${path} responded with ${res.statusCode} ${res.statusMessage}`); // verbose

			// TODO Ugh need Restify to do this for us
			if(res.statusCode == 301 || res.statusCode == 302) {
				var redirectServer = res.headers.location.substring(
					0, res.headers.location.indexOf(".com")+4);
				var redirectPath = res.headers.location.substring(
					res.headers.location.indexOf(".com")+4);

				// TODO possibly need to handle formatting, but this is expected only
				// for media downloads
				restify.createStringClient({ url: redirectServer }).get(redirectPath,
					(err, req, res, content) => {
						console.warn(`following redirect to ${redirectServer}${redirectPath}`)
						if(!err) {
							callback(null, content);
						} else {
							callback({
								items : [],
								code : err.statusCode,
								error : err.body.trim()
							});
						}
				});

				// bailout since the callback is handled in redirect client
				return;
			}

			if(err) {
				console.error(`${path} responded with ${err.body.trim()}`);
				// handle the error returned from the server
				// err is restify HttpError
				return callback({
					items : [],
					code : err.statusCode,
					error : err.body.trim()
				});
			} else {
				if(raw) {
					// don't format and return raw content
					callback(null, content);
				} else {
					this.formatter.format(content, 'items', callback);
				}
			}
		});
	}

	communityApps(handle, callback) {
	 this._execute(`/communities/service/atom/community/remoteApplications?communityUuid=${handle}`, callback);
	}

	/*
	 * do not omit the lang parameter or else you will get no response
	 */

	blogEntries(handle, callback) {
		this._execute(`/blogs/${handle}/feed/entries/atom?lang=${this.lang}`, callback);
	}

	blogComments(handle, callback) {
		this._execute(`/blogs/${handle}/feed/comments/atom?lang=${this.lang}`, callback);
	}

	blogEntry(handle, entry, callback){
		this._execute(`/blogs/${handle}/api/entries/${entry}?lang=${this.lang}`, callback);
	}

	blogEntryComments(handle, entry, callback){
		this._execute(`/blogs/${handle}/api/entrycomments/${entry}?lang=${this.lang}`, callback);
	}

	forumTopics(handle, callback) {
		this._execute(`/forums/atom/topics?communityUuid=${handle}&lang=${this.lang}`, callback);
	}

	forumTopic(handle, callback) {
		this._execute(`/forums/atom/topic?topicUuid=${handle}&lang=${this.lang}`, callback);
	}

	forumTopicReplies(handle, callback) {
		this._execute(`/forums/atom/replies?topicUuid=${handle}&lang=${this.lang}`, callback);
	}

	profileTags(userid, callback) {
		// first get the userid - usually in the form 20008888
		this._execute(`/profiles/atom/profile.do?userid=${userid}`,
				(err, json) => {
					if(!err) {
						// then use the actual GUID to make the request to the profile
						this._execute(`/profiles/atom/profileTags.do?targetKey=${json.items[0].id}`,
								callback);
					} else {
						callback(err);
					}
				});
	}

	wikiPages(handle, callback, downloadContent) {
		this._execute(`/wikis/basic/api/wiki/${handle}/feed`, (err, json) => {
			if(!err) {
				if(downloadContent) {
					// process every page and download
					async.each(json.items, (item, cb) => {
						this._wikiPageDownloader(handle, item, (err, html) => {
							if(!err) {
								item.content = html;
							} else {
								console.error(`Failed to get content for ${item.id}`);
							}
							cb(null, item);	// tell the async library we're done
						});
					}, (err) =>{
						// all async ops are now done; return the full json
						callback(null, json);
					});
				} else {
					// bypassing downoad of content
					// the content property will content something like a link
					callback(null, json);
				}
			} else {
				callback(err);
			}
		});
	}

	wikiPage(handle, page, callback) {
		this._execute(`/wikis/basic/api/wiki/${handle}/page/${page}/entry`, (err, json) => {
			// wiki pags don't include content in the ATOM feed - need to download,
			// <content type="text/html"
			// src="/wikis/basic/api/wiki/b3fc070c-ff0c-405d-9dd9-f2e545594c61/page/07553add-f34d-43a8-964e-2c31a90046ad/media?convertTo=html">
			// </content>
			if(!err) {
				this._wikiPageDownloader(handle, json.items[0], (err2, html) => {
					// overwrite original "content" with downloaded html
					if(!err2){
						json.items[0].content = html;
						callback(null, json);
					} else {
						callback(err2);
					}
				});
			} else {
				callback(err);
			}
		});
	}

	_wikiPageDownloader(handle, item, callback) {
		// the behavior for Cloud is a 302 redirect to the actual download source
		// /wikis/basic/api/wiki/b3fc070c-ff0c-405d-9dd9-f2e545594c61
		// /page/901762cf-e9a7-43a6-91bd-4df0b297a088
		// /version/dc826979-b272-447d-9b3b-02bac2ca6069/media
		var url = `/wikis/basic/api/wiki/${handle}/page/${item.id}/version/${item.version}/media`;

		console.log(`dowloading wiki html from ${url}`);

		this._execute(url, (err, html) => {
			if(!err) {
				console.log(`downloaded HTML of size ${html.length}`)
				callback(null, html);
			} else {
				callback(err);
			}
		}, true); // make sure to specify true to get the raw content
	}

	wikiPageComments(handle, page, callback) {
		this._execute(`/wikis/basic/api/wiki/${handle}/page/${page}/feed`, callback);
	}
}

module.exports = ConnectionsCloud;
