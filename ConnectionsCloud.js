<<<<<<< HEAD
'use strict';
var querystring = require('querystring');
const util = require('util'); // Not really needed, part of cleanup should be to remove this
var stream = require('stream');

var fs = require("fs");
var request = require('request');
var async = require('async');

var tmp = require('tmp');

request.debug = false;

// set up logging
const log = require('loglevel').getLogger("connections-cloud");
//log.setLevel("DEBUG");
//log.setLevel("INFO");
//log.setLevel(process.env.connections_cloudLevel === undefined ? 'error' : process.env.connections_cloudLevel);

class ConnectionsCloud {
  constructor(server, username, password, appid, isAppPassword) {
    this.url = `https://${server}`;

    // standard authentication information
    this.username = username;
    this.password = password;
		this.appid = appid;

    // formatter used to convert ATOM to ...
    //this.formatter = require('@ics-demo/cnx2js');

    this.isAppPassword = isAppPassword; // special handling for app passwords

    // cookie jar; uses specific jar for this client rather than global
    this.jar = request.jar();

    // container for intervals. Should be cleared when object is destroyed
    this.intervals 
  }

  login(callback) {
    // create login URL based on type of user account - either user or shared
    var path = this.isAppPassword ? '/eai/auth/basicMobile' : '/pkmslogin.form';

    // depending on the login method, headers or form data will be required
    var data = this.isAppPassword ?
      // user and app password requires "app id" header for successful login
      {
        'IBM-APP-ID': this.appid
      } :
      // form data
      {
        'login-form-type': 'pwd',
        'error-code': '',
        'username': this.username,
        'password': this.password,
        'show_login': 'showLoginAgain',
      };

    var url = this.url + path;

    log.info(`Logging in to ${url}`);
    log.info(`user ${this.username}`);
    log.info(`using ${this.password.replace(/./g, '*')}`);
=======
'use strict'

const request = require('request')
const async = require('async')

// set up logging
const logger = require('winston')

class ConnectionsCloud {
  constructor (server, username, password, isAppPassword) {
    this.url = `https://${server}`

    // standard authentication information
    this.username = username
    this.password = password

    // formatter used to convert ATOM to ...
    this.formatter = require('cnx2js')

    this.isAppPassword = isAppPassword // special handling for app passwords

    // cookie jar uses specific jar for this client rather than global
    this.jar = request.jar()
  }

  login (callback) {
    // create login URL based on type of user account - either user or shared
    const path = this.isAppPassword ? '/eai/auth/basicMobile' : '/pkmslogin.form'

    // depending on the login method, headers or form data will be required
    const data = this.isAppPassword ?
    // user and app password requires "app id" header for successful login
    {
      'IBM-APP-ID': process.env.APP_ID  // this is an IBM whitelist; consult IBM for details
    } :
    // form data
    {
      'login-form-type': 'pwd',
      'error-code': '',
      'username': this.username,
      'password': this.password,
      'show_login': 'showLoginAgain'
    }

    const url = this.url + path

    logger.info(`Logging in to ${url}`)
    logger.info(`user ${this.username}`)
    logger.info(`using ${this.password.replace(/./g, '*')}`)

>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
    if (this.isAppPassword) {
      request({
        uri: url,
        jar: this.jar,
        headers: data
      }, (err, res, content) => {
<<<<<<< HEAD
        this._loginDone(err, res, content, callback);
      }).auth(this.username, this.password, true);
=======
        this._loginDone(err, res, content, callback)
      }).auth(this.username, this.password, true)
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
    } else {
      request.post({
        uri: url,
        jar: this.jar
      }, (err, res, content) => {
<<<<<<< HEAD
        this._loginDone(err, res, content, callback);
      }).form(data);
    }
  }

  _loginDone(err, res, content, callback) {
    // 302 occurs on login to pkmslogin.form
//    console.log(res.statusCode)
    if (res.statusCode === 200 || res.statusCode === 302) {
      log.info(`Successfully logged in ${this.username}`);
      log.debug(`received ${this.jar.getCookies(this.url)} cookies`);

      this.intervals = setInterval(this.login, 1000 * 3600 * 12); // re-login in 12 hours

      callback(null);
    } else {
      log.error(`Failed to login ${res.statusCode} ${res.statusMessage}`);
      callback(content);
    }
  }

  //	(( callback takes three arguments: (err, httpResponse, body)))
  _execute(path, callback, raw, requestOptions ={}) {
    log.info(`executing ${this.url}${path}`);
    log.debug(`sending ${this.jar.getCookies(this.url)} cookies`);

    return request( Object.assign({
      uri: this.url + path,
      followRedirects: true,
      jar: this.jar
    },requestOptions), (err, res, content) => {
      if (err) {
        log.error(`${path} responded with ${err}`);
=======
        this._loginDone(err, res, content, callback)
      }).form(data)
    }
  }

  _loginDone (err, res, content, callback) {
        // 302 occurs on login to pkmslogin.form
    if (res.statusCode === 200 || res.statusCode === 302) {
      logger.info(`Successfully logged in ${this.username}`)
      logger.debug(`received ${this.jar.getCookies(this.url)} cookies`)

      setInterval(this.login, 1000 * 3600 * 12) // re-login in 12 hours

      callback(null)
    } else {
      logger.error(`Failed to login ${res.statusCode} ${res.statusMessage}`)
      callback(content)
    }
  }

  _execute (path, callback, raw) {
    logger.info(`executing ${this.url}${path}`)
    logger.debug(`sending ${this.jar.getCookies(this.url)} cookies`)

    request({
      uri: this.url + path,
      followRedirects: true,
      jar: this.jar
    }, (err, res, content) => {
      if (err) {
        logger.error(`${path} responded with ${err}`)
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
        // handle the error returned from the server
        return callback({
          items: [],
          code: err.statusCode,
          error: err
<<<<<<< HEAD
        });
      } else {
        log.debug(`${path} responded with ${res.statusCode} ${res.statusMessage}`);
        log.debug(`${path} responded with content body ${content}`);
=======
        })
      } else {
        logger.debug(`${path} responded with ${res.statusCode} ${res.statusMessage}`)
        logger.debug(`${path} responded with content body ${content}`)
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603

        switch (res.statusCode) {
          case 401: // the user lacks access to the app
          case 404: // the app is likely not installed or user error
            return callback({
              items: [],
              code: res.statusCode,
              error: res.statusMessage
<<<<<<< HEAD
            });
          default:
            if (raw) {
              // don't format and return raw content
              callback(null, res, content);
            } else {
              callback(null, res, content.toString());
              //this.formatter.format(content, 'items', callback);
            }
            break;
        }
      }
    });
  }

  _executePost(path, queryData, formData, callback , headers = {}) {

    this.getNonce((err, resp, raw) => {
      var postoptions = {
        method: "POST",
        formData: formData,
        headers: Object.assign({
          'X-Update-Nonce': raw
        },headers)
      };
      this._execute(path + queryData, callback, null, postoptions);
    });

  }
  _executeCMIS(path, queryData, formData, callback , headers = {}) {

    this.getNonce((err, resp, raw) => {
      var postoptions = {
        method: "POST",
        body: formData,
        headers: Object.assign({
          'X-Update-Nonce': raw
        },headers)
      };
      this._execute(path + queryData, callback, null, postoptions);
    });

  }


  _createQuery(options) {
    var query = '';
=======
            })
          default:
            if (raw) {
              // don't format and return raw content
              callback(null, content)
            } else {
              this.formatter.format(content, 'items', callback)
            }
            break
        }
      }
    })
  }

  _createQuery (options) {
    let query = ''
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603

    /*
     * do not omit the lang parameter or else you will get no response
     */

    if (options !== undefined) {
      if (options.lang === undefined) {
<<<<<<< HEAD
        options.lang = 'en_us';
      }

      for (var opt in options) {
        query = query + `${opt}=${options[opt]}&`;
      }
    } else {
      query = 'lang=en_us';
    }

    //		console.log("createQuery: "+query);
    return query;
  }

  communityApps(handle, callback) {
    this._execute(`/communities/service/atom/community/remoteApplications?communityUuid=${handle}`, callback);
  }

  blogEntries(handle, callback, options) {
    this._execute(`/blogs/${handle}/feed/entries/atom?${this._createQuery(options)}`, callback);
  }

  blogComments(handle, callback, options) {
    this._execute(`/blogs/${handle}/feed/comments/atom?${this._createQuery(options)}`, callback);
  }

  blogEntry(handle, entry, callback, options) {
    this._execute(`/blogs/${handle}/api/entries/${entry}?${this._createQuery(options)}`, callback);
  }

  blogEntryComments(handle, entry, callback, options) {
    this._execute(`/blogs/${handle}/api/entrycomments/${entry}?${this._createQuery(options)}`, callback);
  }

  forumTopics(handle, callback, options) {
    this._execute(`/forums/atom/topics?communityUuid=${handle}&${this._createQuery(options)}`, callback);
  }

  forumTopic(handle, callback, includeReplies, options) {
    if (includeReplies) {
      this._execute(`/forums/atom/replies?topicUuid=${handle}&${this._createQuery(options)}`, callback);
    } else {
      this._execute(`/forums/atom/topic?topicUuid=${handle}&${this._createQuery(options)}`, callback);
    }
  }

  profileTags(userid, callback) {
=======
        options.lang = 'en_us'
      }

      for (let opt in options) {
        query = query + `${opt}=${options[opt]}&`
      }
    } else {
      query = 'lang=en_us'
    }

    return query
  }

  communityApps (handle, callback) {
    this._execute(`/communities/service/atom/community/remoteApplications?communityUuid=${handle}`, callback)
  }

  blogEntries (handle, callback, options) {
    this._execute(`/blogs/${handle}/feed/entries/atom?${this._createQuery(options)}`, callback)
  }

  blogComments (handle, callback, options) {
    this._execute(`/blogs/${handle}/feed/comments/atom?${this._createQuery(options)}`, callback)
  }

  blogEntry (handle, entry, callback, options) {
    this._execute(`/blogs/${handle}/api/entries/${entry}?${this._createQuery(options)}`, callback)
  }

  blogEntryComments (handle, entry, callback, options) {
    this._execute(`/blogs/${handle}/api/entrycomments/${entry}?${this._createQuery(options)}`, callback)
  }

  forumTopics (handle, callback, options) {
    this._execute(`/forums/atom/topics?forumUuid=${handle}&${this._createQuery(options)}`, callback)
  }

  forumTopic (handle, callback, includeReplies, options) {
    if (includeReplies) {
      this._execute(`/forums/atom/replies?topicUuid=${handle}&${this._createQuery(options)}`, callback)
    } else {
      this._execute(`/forums/atom/topic?topicUuid=${handle}&${this._createQuery(options)}`, callback)
    }
  }

  profileTags (userid, callback) {
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
    // first get the userid - usually in the form 20008888
    this._execute(`/profiles/atom/profile.do?userid=${userid}`,
      (err, json) => {
        if (!err) {
<<<<<<< HEAD
          // then use the actual GUID to make the request to the profile
          this._execute(`/profiles/atom/profileTags.do?targetKey=${json.items[0].id}`,
            callback);
        } else {
          callback(err);
        }
      });
  }

  wikiPages(handle, callback, downloadContent, options) {
    this._execute(`/wikis/basic/api/wiki/${handle}/feed?${this._createQuery(options)}`, (err, json) => {
      if (!err) {
        if (downloadContent) {
          // process every page and download
          async.each(json.items, (item, cb) => {
            this._wikiPageDownloader(handle, item, (err, html) => {
              if (!err) {
                item.content = html;
              } else {
                log.error(`Failed to get content for ${item.id}`);
              }
              cb(null, item); // tell the async library we're done
            });
          }, (err) => {
            // all async ops are now done; return the full json
            callback(null, json);
          });
        } else {
          // bypassing downoad of content
          // manually set the content to empty
          for (var i in json.items) {
            json.items[i].content = '';
          }
          callback(null, json);
        }
      } else {
        callback(err);
      }
    });
  }

  wikiPage(handle, page, callback, options) {
=======
              // then use the actual GUID to make the request to the profile
          this._execute(`/profiles/atom/profileTags.do?targetKey=${json.items[0].id}`,
                  callback)
        } else {
          callback(err)
        }
      })
  }

  wikiPages (handle, callback, downloadContent, options) {
    this._execute(`/wikis/basic/api/wiki/${handle}/feed?${this._createQuery(options)}`, (err, json) => {
      if (!err) {
        if (downloadContent) {
                    // process every page and download
          async.each(json.items, (item, cb) => {
            this._wikiPageDownloader(handle, item, (err, html) => {
              if (!err) {
                item.content = html
              } else {
                logger.error(`Failed to get content for ${item.id}`)
              }
              cb(null, item) // tell the async library we're done
            })
          }, (err) => {
                        // all async ops are now done return the full json
            callback(null, json)
          })
        } else {
          // bypassing download of content
          // manually set the content to empty
          for (let i in json.items) {
            json.items[i].content = ''
          }
          callback(null, json)
        }
      } else {
        callback(err)
      }
    })
  }

  wikiPage (handle, page, callback, options) {
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
    this._execute(`/wikis/basic/api/wiki/${handle}/page/${page}/entry?${this._createQuery(options)}`, (err, json) => {
      // wiki pags don't include content in the ATOM feed - need to download,
      // <content type="text/html"
      // src="/wikis/basic/api/wiki/b3fc070c-ff0c-405d-9dd9-f2e545594c61/page/07553add-f34d-43a8-964e-2c31a90046ad/media?convertTo=html">
      // </content>
      if (!err) {
        this._wikiPageDownloader(handle, json.items[0], (err2, html) => {
<<<<<<< HEAD
          // overwrite original "content" with downloaded html
          if (!err2) {
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
=======
                    // overwrite original "content" with downloaded html
          if (!err2) {
            json.items[0].content = html
            callback(null, json)
          } else {
            callback(err2)
          }
        })
      } else {
        callback(err)
      }
    })
  }

  _wikiPageDownloader (handle, item, callback) {
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
    // the behavior for Cloud is a 302 redirect to the actual download source
    // /wikis/basic/api/wiki/b3fc070c-ff0c-405d-9dd9-f2e545594c61
    // /page/901762cf-e9a7-43a6-91bd-4df0b297a088
    // /version/dc826979-b272-447d-9b3b-02bac2ca6069/media
<<<<<<< HEAD
    var url = `/wikis/basic/api/wiki/${handle}/page/${item.id}/version/${item.version}/media`;

    log.debug(`dowloading wiki html from ${url}`);

    this._execute(url, (err, html) => {
      if (!err) {
        log.debug(`downloaded HTML of size ${html.length}`)
        callback(null, html);
      } else {
        callback(err);
      }
    }, true); // make sure to specify true to get the raw content
  }

  wikiPageComments(handle, page, callback, options) {
    this._execute(`/wikis/basic/api/wiki/${handle}/page/${page}/feed?${this._createQuery(options)}`, callback);
  }

  getNonce(callback) {
    this._execute('/files/basic/api/nonce', callback, false);
  }

  createFile(communityUuid,options,callback){

    var path = "/files/basic/api/communitylibrary/"+communityUuid+"/feed?";
    
    var queryData = this._createQuery(options)

    this._executePost(path, queryData, null, callback)

  }

  // Callback 1 arg(error) // if no error assume it exsists 
  remoteFileExists(communityUuid,documentUuid,callback){
    this._execute("/files/basic/api/communitylibrary/"+communityUuid+"/document/"+documentUuid+"/entry",
      function(err, httpResponse, body){
        if(err){
          callback(err); 
        }
        else{
          var checkErrorCode = body.match("<td:errorCode>(.*?)</td:errorCode>")
          if(checkErrorCode !== null){

            if(checkErrorCode.includes("ItemNotFound")){
              callback("Item Not Found")
            }else{
              console.log(checkErrorCode);
              callback(checkErrorCode);
             }
          }
          else{
            callback(null);
          }
        }
      })
  }

  downloadFile(libraryUuid,DocUuid, callback) {
    //	(( callback takes three arguments: (err, httpResponse, body)))
    // The intend is to:
    //   Download file into a buffer only, no local files shoudl be needed.
    //   The callback will get the files content....
    // Example URL: https://apps.na.collabserv.com/files/form/api/library/32fd36ed-5153-4431-81b4-5e913ca6330d/document/54d717b8-6bc2-45b5-9220-3236a98dd9e3/media/EVRY-xxx-yyy-AD-nnn-AI%20-%20Architectural%20Decision%20%28ART.%200513%29%20template.doc
    // Decode: https://apps.na.collabserv.com/files/form/api/library/32fd36ed-5153-4431-81b4-5e913ca6330d
    //             /document/54d717b8-6bc2-45b5-9220-3236a98dd9e3
    //             /media/EVRY-xxx-yyy-AD-nnn-AI%20-%20Architectural%20Decision%20%28ART.%200513%29%20template.doc

//    var filename = filePath.split(/(\\|\/)/g).pop()
//    console.log("name of file to download: " + filename)
    //	console.log("name of filepath to download: "+ filePath)

    var path = "/files/basic/api/library/"+libraryUuid+"/document/"+DocUuid+"/media"
    this._execute(path, callback, true,{encoding: null});
  }

  getFileLink(communityUuid,DocUuid){
    
    return this.url + "/files/form/api/communitylibrary/"+communityUuid+"/document/"+DocUuid+"/media"
  }
  getFileData(docdata){
    var tmpfilename = tmp.tmpNameSync() + ".docx";
    fs.writeFileSync(tmpfilename, docdata);
    log.info('Created temporary filename: ', tmpfilename);
    log.info("Filesize: " + docdata.length);

    return  fs.createReadStream(tmpfilename)
  }

  uploadFile(communityUuid, filename, docdata, callback){
    log.debug("communityUuid: " + communityUuid);
    log.debug("name of file: " + filename);

    // link: https://www-10.lotus.com/ldd/lcwiki.nsf/xpAPIViewer.xsp?lookupName=IBM+Connections+5.5+API+Documentation#action=openDocument&res_title=Adding_a_file_or_set_of_files_to_a_folder_ic55&content=apicontent
    // this.url +'/files/basic/api/collection/??/feed?
    //  /files/form/api/communitylibrary/8ef59342-c9c0-483b-8081-0274f90e516c/feed?format=html&encrypt=false&opId=upload%2COUTPUT.docx%2C1522359837642
    // request.debug = true;
    var path = this.url + "/files/basic/api/communitylibrary/"+communityUuid+"/feed?";

    /*
    // @jebn: Looks like pipes and streams is not doing as I expected so using the file on OS instead
      var sourceStream = new stream.PassThrough();
      sourceStream.end(docdata);
      var destStream = new stream.PassThrough();
      sourceStream.pipe(destStream);
    //  destStream.pipe(process.stdout);
    */

    var formData = {
      // Pass data via Streams
      file: this.getFileData(docdata)
      //  file: destStream
    };

    var queryData = this._createQuery({
          title: filename,
          label: filename,
          visibility: 'private'
        })

    this._executePost(path, queryData, formData, callback);
  }


  updateFile(communityUuid ,documentUuid ,docdata, callback){

    var path = "/files/basic/api/communitylibrary/"+communityUuid+"/document/"+documentUuid+"/entry?";

    var formData = {
    // Pass data via Streams
    file: this.getFileData(docdata)
    //  file: destStream
    };

    this.getNonce((err, resp, raw) => {


    // %2C == "." when it's url encoded.  
    var queryData = this._createQuery({
          createVersion: "true",
          opId: "replace"+"%2C"+documentUuid+"%2C"+Date.now(),
          visibility: 'private',
          nonce: raw,
          'X-Method-Override': "PUT",
          'If-Match': documentUuid
    })

    this._executePost(path, queryData, formData, callback);
  })
  }


  deleteFile(communityUuid, documentUuid ,callback){
    var path  = "/files/basic/api/library/"+communityUuid+"/document/"+documentUuid+"/entry";

    var headers = {
      'X-Method-Override': 'DELETE',
      'X-Requested-With': 'XMLHttpRequest'

    }

    this._executePost(path, '', null, callback, headers);
  }

  moveToFolder(communitylibrary, collectionid, documentUuid , callback){

    var path  = "/files/basic/api/communitylibrary/"+communitylibrary+"/document/"+documentUuid+"/feed";

    var CMIS = '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><category term="collection" label="collection" scheme="tag:ibm.com,2006:td/type"/><itemId xmlns="urn:ibm.com/td">'+collectionid+'</itemId></entry></feed>'

    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Content-Type':'application/atom+xml;charset="UTF-8"'

    }

    this._executeCMIS(path, '', CMIS, callback, headers);

  }


  createComment(documentID, commentContent, callback){

    var path = '/files/basic/api/document/'+documentID+'/feed'

    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Content-Type':'application/atom+xml;charset="UTF-8"'

    }

    var CMIS = '<entry xmlns="http://www.w3.org/2005/Atom"><category term="comment" label="comment" scheme="tag:ibm.com,2006:td/type"/><content type="html">'+commentContent+'</content></entry>'
    
    this._executeCMIS(path, '', CMIS, callback, headers);
  }

  getFilesInFolder(collectionId, options, callback){
  
    this._execute(`/files/form/api/collection/${collectionId}/feed?${this._createQuery(options)}`, callback);
  }
}




module.exports = ConnectionsCloud;
=======
    const url = `/wikis/basic/api/wiki/${handle}/page/${item.id}/version/${item.version}/media`

    logger.debug(`dowloading wiki html from ${url}`)

    this._execute(url, (err, html) => {
      if (!err) {
        logger.debug(`downloaded HTML of size ${html.length}`)
        callback(null, html)
      } else {
        callback(err)
      }
    }, true) // make sure to specify true to get the raw content
  }

  wikiPageComments (handle, page, callback, options) {
    this._execute(`/wikis/basic/api/wiki/${handle}/page/${page}/feed?${this._createQuery(options)}`, callback)
  }
}

module.exports = ConnectionsCloud
>>>>>>> 1dc077cbcef6473702432a90062f552b93ad2603
