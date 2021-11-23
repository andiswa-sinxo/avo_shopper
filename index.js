const express = require('express');
const exphbs  = require('express-handlebars');

const pg = require("pg");
let AvoShopper = require("./avo-shopper");
const Pool = pg.Pool;
require('dotenv').config()

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/avo_shopper';

const pool = new Pool({
    connectionString
});

const avo = AvoShopper(pool)

const app = express();
const PORT =  process.env.PORT || 3019;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.get('/', async function(req, res) {
	const avos = await avo.topFiveDeals()
	res.render('index', {
		avos
	});
});

app.get('/list', async function(req, res){
	const list = await avo.listShops()
	res.render('avos/shop',{
		list
	});
});
app.get('/list/add', async function(req,res){
	res.render('avos/add');
})


app.post('/list/add', async function(req,res){
	console.log(req.body.shop_name)
	 await avo.createShop(req.body.shop_name)

	res.render('avos/add');
})

// app.post('/deal',  async function (req, res){

// 	await avo.createDeal()

// 	res.re

// });

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});