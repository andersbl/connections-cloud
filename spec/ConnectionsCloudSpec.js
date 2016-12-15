describe("Connections Cloud", function() {
  require('dotenv').config()

  var connections = require('../ConnectionsCloud');
  var client = new connections('apps.na.collabserv.com',
    process.env.NA_USER, process.env.NA_PASSWORD);

  it('Blog Entries', function(done) {
    client.blogEntries('658dcc36-6d2d-4508-9dc8-87332fbbab19',
  			(err, json) => {
          expect(err).toBeNull();

          if(!err) {
            expect(json.items.length).toBeGreaterThan(0);
          }

          done();
        });
  });

  it('Wiki Pages (Skip Content Download)', function(done) {
    client.wikiPages('b3fc070c-ff0c-405d-9dd9-f2e545594c61',
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
    client.wikiPages('b3fc070c-ff0c-405d-9dd9-f2e545594c61',
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
