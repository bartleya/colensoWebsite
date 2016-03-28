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
	//client.execute(tei_path + "for $n in .//[. contains text " + queries.mysearch + "] return db:path($n)",
	client.execute(tei_path + "for $n in //text where matches($n, '" + queries.mysearch + "', 'i') = true() return db:path($n)",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('search', { title: 'Colenso search results', query_results: result.result.split('\n'), query_term: queries.mysearch });
		}
	}
	);
});

/* GET advanced search page. */
router.get("/XquerySearch", function(req,res) {
	var queries = req.query;
	client.execute(tei_path + "for $n in (" + queries.mysearch + ") return db:path($n)",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('XquerySearch', { title: 'Colenso search results', place: result.result.split('\n'), query_term: queries.mysearch });
		}
	}
	);
});

/* GET browse page. (Load all XML paths) */
router.get("/Browse", function(req,res) {
	var queries = req.query;
	client.execute(tei_path + "for $n in //text where matches($n, '" + " " + "', 'i') = true() return db:path($n)",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('index', { title: 'Colenso search results', place: result.result.split('\n') });
		}
	}
	);
});

/* GET database XML files. */
router.get("/Colenso/*", function(req,res) {
	var url = req.params[0];
	client.execute("XQUERY " + "doc('Colenso/" + url + "')",
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('viewXML', { title: url, xml: result.result });
		}
	}
	);
});

module.exports = router;