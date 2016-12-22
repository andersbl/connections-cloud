describe("Connections Cloud", function() {
  require('dotenv').config()

  var connections = require('../ConnectionsCloud');

  var client;

  const communityId = '63df90b3-0567-4efb-b9ad-8b4f12b7c8c2';

  // create a user-specific client
  it(`${process.env.PRIVATE_USER} client`, function(done) {
    client = new connections('apps.na.collabserv.com',
     process.env.PRIVATE_USER, process.env.APP_PASSWORD, true);

    client.login((err) => {
      expect(err).toBeNull();
      done();
    });
  });

  // create a shared-ID client
  /*
  it(`${process.env.SHARED_USER} client`, function(done) {
    var client = new connections('apps.na.collabserv.com',
     process.env.SHARED_USER, process.env.SHARED_PASSWORD);

    client.login((err) => {
      expect(err).toBeNull();
      clients.push(client);
      done();
    });
  });
  */

  var wiki;

  // figure out the apps added into a community
  it('Community Apps', function(done) {
    client.communityApps(communityId,
        (err, json) => {
          expect(err).toBeNull();

          if(!err) {
            // there are expected to be some apps
            expect(json.items.length).toBeGreaterThan(0);

            // depending on the app, save the ID for usage
            for(var i in json.items) {
              console.log(JSON.stringify(json.items[i]));
              switch(json.items[i].content) {
                case 'Wiki':
                  wiki = json.items[i].id;
                break;
              }
            }
          }

          done();
        });
  });

  it('Blog Entries', function(done) {
    client.blogEntries(communityId,
  			(err, json) => {
          expect(err).toBeNull();

          if(!err) {
            expect(json.items.length).toBeGreaterThan(0);
          }

          done();
        });
  });

  it('Wiki Pages (Skip Content Download)', function(done) {
    client.wikiPages(wiki,
  			(err, json) => {
          expect(err).toBeNull();

          if(!err) {
            expect(json.items.length).toBeGreaterThan(0);

            for(var i in json.items) {
              expect(json.items[i].content).toMatch('');
            }
          }

          done();
        });
  });

  it('Wiki Pages (Content Download)', function(done) {
    client.wikiPages(wiki,
  			(err, json) => {
          expect(err).toBeNull();

          if(!err) {
            expect(json.items.length).toBeGreaterThan(0);

            for(var i in json.items) {
              expect(json.items[i].content.length).toBeGreaterThan(0);
            }
          }

          done();
        }, true);
  });
});
