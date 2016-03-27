var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var tei_path = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; "
client.execute("OPEN Colenso");

/* GET home page. */
router.get("/", function(req,res) {
	client.execute(tei_path + 
	"(//name[@type='place'])[1] ",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('index', { title: 'Colenso search results', place: result.result.split('\n') });
		}
	}
	);
});

/* GET search page. */
router.get("/Search", function(req,res) {
	var queries = req.query;
	client.execute(tei_path + 
	"for $n in (" + queries.mysearch + ") return db:path($n)",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('index', { title: 'Colenso search results', place: result.result.split('\n') });
		}
	}
	);
});

/* GET browse page. */
router.get("/Browse", function(req,res) {
	var queries = req.query;
	client.execute("LIST Colenso",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('index', { title: 'Colenso search results', place: result.result.split('\n') });
		}
	}
	);
});

/* GET home page. */
router.get("/Colenso/*", function(req,res) {
	var url = req.params[0];
	client.execute("XQUERY " + 
	"doc('Colenso/" + url + "')",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.set('Content-Type', 'text/xml');
			res.send(result.result);
		}
	}
	);
});

module.exports = router;