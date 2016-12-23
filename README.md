# connections-cloud

A Connections Cloud Javascript client.

# usage
To create a server-based application with a shared ID use the
following.

```javascript
var connections = require('@ics-demo/connections-cloud');
var client = new connections('apps.na.collabserv.com', 'functional_id@us.ibm.com',
  'password');

client.login((err) => {
  if(!err) {
    client.forumTopics('658dcc36-6d2d-4508-9dc8-87332fbbab19', (err, json) => {
      if(!err) {
    		console.log(json);
    	}
    });
  }
});
```

To create a user-based application use the following. This will use application passwords.  You will need to create one prior to using.
See [Generating Application Passwords](https://www.ibm.com/support/knowledgecenter/SSL3JX/welcome/t_use_application_passwords.html).
```javascript
var connections = require('@ics-demo/connections-cloud');
var client = new connections('apps.na.collabserv.com', 'your_id@us.ibm.com',
  'aswe frew gtrs tsew', true);

client.login((err) => {
  if(!err) {
    client.forumTopics('658dcc36-6d2d-4508-9dc8-87332fbbab19', (err, json) => {
      if(!err) {
    		console.log(json);
    	}
    });
  }
});
```

Creates an object with the items in the respective Connections Cloud app.

```
{
  "items": [
    {
      "id": "eba13222-c22a-4529-bb43-badc700c11c3",
      "source": "forum",
      "title": "How will Internet of Things affect collaboration?",
      "parent": "658dcc36-6d2d-4508-9dc8-87332fbbab19",
      "api": "https://apps.na.collabserv.com/communities/service/atom/community/instance?communityUuid=658dcc36-6d2d-4508-9dc8-87332fbbab19",
      "url": "https://apps.na.collabserv.com/forums/html/topic?id=eba13222-c22a-4529-bb43-badc700c11c3",
      "content": "\n    <p dir=\"ltr\">\n      Will devices be able to monitor and react to social collaboration like status updates and posts?\n    </p>\n  "
    },
    ...
    ]
  }
```
# options
Connections Cloud query parameters are supported using the ```options``` argument.
If omitted, Connections Cloud defaults are used per IBM documentation.

```javascript
var options = {
  ps : '25'
}
...
client.login((err) => {
  if(!err) {
    client.forumTopics('658dcc36-6d2d-4508-9dc8-87332fbbab19', (err, json) => {
      if(!err) {
    		console.log(json);
    	}
    }, options);
  }
});
```


# supports
* Blog Entries
* Forum Topics
* Comments
* Profile Tags
* Wiki Pages
