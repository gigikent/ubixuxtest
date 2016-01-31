var webpack = require('webpack');
var config = require('./webpack.config');

var express = require('express');
var app = express();
var port = 3000;

//var compiler = webpack(config);

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ubixuxtest');

var routes = express.Router();
var users = express.Router();
var todos = express.Router();
var notifications = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(bodyParser.json());

routes.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

users.get('/', (req, res) => {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, (e,docs) => res.json(docs));
});

todos.get('/', (req, res) => {
    var db = req.db;
    var collection = db.get('todos');
    collection.find({}, {}, (e,docs) => res.json(docs));
});

todos.get('/:todoId', (req, res) => {
    var db = req.db;
    var collection = db.get('todos');
    collection.find({'_id' : req.params.todoId}, {}, (e,doc) => res.json(doc));
});

users.post('/', (req, res) => {
    var db = req.db;
    var userName = req.body.name;
    var collection = db.get('usercollection');
    collection.insert({name : userName}, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    });
});

users.delete('/:userId', (req, res) => {
    console.log('delete ' + req.params.userId);
    var db = req.db;
    var collection = db.get('usercollection');
    collection.remove({'_id' : req.params.userId}, err => {
	res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

users.get('/:userId/todos', (req, res) => {
    var db = req.db;
    var collection = db.get('todos');
    collection.find({userId: req.params.userId}, {}, (e,docs) => res.json(docs));
});

users.post('/:userId/todos', (req, res) => {
    console.log('post ');
    console.log(req.params);
    var collection = req.db.get('todos');
    collection.insert({
	userId: req.params.userId,
	text: req.body.text
    }, (err, doc) => {
	if (err) console.log(err);
	else res.json(doc);
    });
});

users.get('/:targetId/suggestions', (req, res) => {
    var db = req.db;
    var collection = db.get('suggestions');
    collection.find({targetId: req.params.targetId}, {}, (e,docs) => res.json(docs));
});

users.post('/:targetId/suggestions', (req, res) => {
    var collection = req.db.get('suggestions');
    collection.insert({
	targetId: req.params.targetId,
	sourceId: req.body.sourceId,
	todo: req.body.todo
    }, (err, doc) => {
	if (err) console.log(err);
	else res.json(doc);
    });
});

users.get('/:targetId/notifications', (req, res) => {
    var db = req.db;
    var collection = db.get('notifications');
    collection.find({targetId: req.params.targetId}, {}, (e,docs) => res.json(docs));
});

users.post('/:targetId/notifications', (req, res) => {
    var collection = req.db.get('notifications');
    collection.insert({
	targetId: req.params.targetId,
	sourceId: req.body.sourceId,
	type: req.body.type,
	payload: req.body.payload
    }, (err, doc) => {
	if (err) console.log(err);
	else res.json(doc);
    });
});

notifications.delete('/:notificationId/', (req, res) => {
    console.log('delete notification ' + req.params.notificationId);
    var db = req.db;
    var collection = db.get('notifications');
    collection.remove({'_id' : req.params.notificationId}, err => {
	res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

todos.delete('/:todoId/', (req, res) => {
    console.log('delete todo ' + req.params.todoId);
    var db = req.db;
    var collection = db.get('todos');
    collection.remove({'_id' : req.params.todoId}, err => {
	res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

notifications.get('/byTarget/:userId', (req, res) => {
    
});

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/static', express.static('static'));

app.use('/', routes);
app.use('/users', users);
app.use('/todos', todos);
app.use('/notifications', notifications);

app.listen(port, function(error) {
    if (error) {
	console.error(error);
    } else {
	console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
    }
});
