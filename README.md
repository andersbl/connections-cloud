# connections-cloud

A basic Connections Cloud JS client.

# usage
```javascript
var connections = require('@ics-demo/ConnectionsCloud');
var client = new connections('apps.na.collabserv.com', process.env.NA_USER,
  process.env.NA_PASSWORD);
client.forumTopics('658dcc36-6d2d-4508-9dc8-87332fbbab19', (err, json) => {
  if(!err) {
		console.log(json);
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
# supports
* Blog Entries
* Forum Topics
* Comments
* Profile Tags
* Wiki Pages
