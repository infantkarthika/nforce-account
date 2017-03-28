var express = require("express");
var bodyParser = require("body-parser");
var nforce = require("nforce");


var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//nforce setup
var org = nforce.createConnection({
  clientId: "3MVG9ZL0ppGP5UrCvlpA7pSJQqe.ckUL1Z9BQ_AVn2dB7g47yuCEVAdPZVTHG0RiJ44FK3J.jQJta4tkWJN0B",
  clientSecret: "4865988659076049669",
  redirectUri: "https://seanstack.herokuapp.com/oauth/_callback",
  apiVersion: "v37.0",
  environment: "production",
  mode: "single"
});

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// ACCOUNT API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/Account"
 *    GET: finds all Account
 *    POST: creates a new Account
 */

app.get("/account", function(req, res) {
  org.authenticate({ username: 'infu@mst.com', password: 'arial14.bcqiMKAjphJ6suAT8w4Cd8l7u'}, function(err, oauth){
    if(err) {
      console.log('Error: ' + err.message);
    } else {
      console.log('Access Token: ' + oauth.access_token);
      org.query({query:"select id, name, phone_num__c, website, createddate, lastmodifieddate from account order by createddate desc"}, function (err, resp) {
        if(err) throw err;
        if(resp.records && resp.records.length){
          res.send(resp.records);
        }
      });
    }
  });
});

app.post("/account", function(req, res) {
  var newAccount = req.body;

  if (!(req.body.name)) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  console.log('Attempting to insert Account');
  var act = nforce.createSObject('Account', newAccount);
  org.insert({ sobject: act }, function(err, resp) {
    if(err) {
      console.error('--> unable to insert Account');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> Account inserted');
      res.send(resp);
    }
  });

});

/*  "/Account/:id"
 *    GET: find Account by id
 *    PUT: update Account by id
 *    DELETE: deletes Account by id
 */

app.get("/account/:id", function(req, res) {
  console.log('attempting to get the Account');
  org.getRecord({ type: 'account', id: req.params.id }, function(err, act) {
    if(err) {
      console.error('--> unable to retrieve lead');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> Account retrieved');
      res.status(201).send(act);
    }
  });
});

app.put("/account/:id", function(req, res) {
  var account = req.body;

  if (!(req.body.name)) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  console.log('Attempting to update Account');
  var act = nforce.createSObject('Account', {
    id : req.params.id,
    name : account.name,
    phone : account.phone,
    billingstreet : account.billingstreet
  });
  org.update({ sobject: act }, function(err, resp) {
    if(err) {
      console.error('--> unable to update Account');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> Account updated');
      res.status(204).end();
    }
  });
});

app.delete("/account/:id", function(req, res) {
  var accountId = req.params.id;
  console.log('this is' + req.params.id);
  var act = nforce.createSObject('account', {
    id : accountId
  });
  org.delete({sobject : act}, function(err, act) {
    if(err) {
      console.error('--> unable to retrieve account');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> Account deleted');
      res.status(204).end();
    }
  });
});