#!/bin/env node

var express = require('express');
var fs      = require('fs');
var mongodb = require('mongodb');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');

var App = function(){

  // Scope
  var self = this;

  // Setup
  self.dbServer = new mongodb.Server(process.env.OPENSHIFT_MONGODB_DB_HOST,parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT));
  self.db = new mongodb.Db('favloc', self.dbServer, {auto_reconnect: true});
  self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
  self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

  self.ipaddr  = process.env.OPENSHIFT_NODEJS_IP;
  self.port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
  if (typeof self.ipaddr === "undefined") {
    console.warn('No OPENSHIFT_NODEJS_IP environment variable');
  };


  // Web app logic
  self.routes = {};
  

  //returns all locations
  self.routes['/'] = function(req, res){
     console.log("get method");			  

     self.db.collection('location').find().toArray(function(err, names) {
        res.setHeader("Content-Type:","application/json");
        console.log("success get");
	    console.log(names);
		//res.send(names);
		res.send(JSON.stringify(names));   
    });
  };


  //adds a new location
  self.routes['addLocation'] = function(req, res){

     var id = req.body[0].id;
     var city = req.body[0].city;
     var latitude = req.body[0].latitude;
     var address = req.body[0].address;
     var longitude = req.body[0].longitude;
     var application = req.body[0].application;

     console.log(req.body);    
     
      self.db.collection('location').insert(req.body[0], function(result){
				console.log("post success");
			    res.send("post server success");
			   //  res.end('success');
		    });
  };
  
  //update's a location based on id
  self.routes['putLocation'] = function(req, res){

    var id=req.body[0].id;
 	var city=req.body[0].city;
 	var application=req.body[0].application;
 	var address=req.body[0].address;
 	var latitude=req.body[0].latitude;
 	var longitude=req.body[0].longitude;
 	console.log("put function");
    console.log(req.body[0]);
    console.log(id);
    
     self.db.collection('location').update({id:id}, {id:id,city: city, address: address,application:application,latitude:latitude,longitude:longitude}, function(err) {
		if(err)
		    throw err;
		else
		{
		    console.log('entry updated');
		     res.send((err === null) ? { msg: '' } : { msg: err });
		}
    });
  };
  
  //delete's a location based on id
  self.routes['deleteLocation'] = function(req, res){
		console.log("delete");
   		var locationDelete = req.body[0].id;
        console.log(req.body[0]);
	 
	    
	  self.db.collection('location').remove({id:locationDelete}, function(err) {
			if(err)
			    throw err;
			else
			{
			    console.log('delete done');
			     res.send((err === null) ? { msg: '' } : { msg: err });
			}
	    });
  };

  // Web app urls
  
  self.app  = express();

  //Commented configure,since its not used by express 4
  /*self.app.configure(function () {
        self.app.use(express.bodyParser());
        self.app.use(express.methodOverride());
        
        self.app.use(express.favicon());
        self.app.use(express.json());
        self.app.use(express.urlencoded());
        
        self.app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        self.app.use(express.static(__dirname));

  });*/
  
 
// Below code is used to replace the configure function.
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
		
	self.app.use(bodyParser()); 						
	self.app.use(methodOverride());  
    self.app.use(express.static(path.join(__dirname)));

}
 

  //define all the url mappings  
  self.app.get('/index', self.routes['/']);
  self.app.post('/', self.routes['addLocation']);
  self.app.put('/', self.routes['putLocation']);
  self.app.delete('/', self.routes['deleteLocation']);

  // Below code is to open a database connection. It is outside the app so it is available to all our functions inside.

  self.connectDb = function(callback){
    self.db.open(function(err, db){
      if(err){ throw err };
      self.db.authenticate(self.dbUser, self.dbPass, {authdb: "admin"}, function(err, res){
        if(err){ throw err };
        callback();
      });
    });
  };
  
  
  //starting the nodejs server with express
  self.startServer = function(){
    self.app.listen(self.port, self.ipaddr, function(){
      console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddr, self.port);
    });
  }

  // Destructors
  self.terminator = function(sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating Node server ...', Date(Date.now()), sig);
      process.exit(1);
    };
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };

  process.on('exit', function() { self.terminator(); });

  self.terminatorSetup = function(element, index, array) {
    process.on(element, function() { self.terminator(element); });
  };

  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'].forEach(self.terminatorSetup);

};

//make a new express app
var app = new App();

//call the connectDb function and pass in the start server command
app.connectDb(app.startServer);