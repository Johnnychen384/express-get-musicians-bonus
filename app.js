const express = require('express');
const app = express();

const {Musician, Band} = require("./index");
const {sequelize} = require('./db');
const musicRouter = require("./router/Musicians")

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const port = 8080;

async function seed(){
	await sequelize.sync({ force: true });

	let wutang = await Band.create({name : 'Wu-Tang Clan', genre : 'Hip Hop'})
	let raekwon = await Musician.create({name : 'Raekwon'})
	let methodMan = await Musician.create({name : 'Method Man'})

	let bigBang = await Band.create({ name : 'BIGBANG', genre : 'KPOP'})
	let GD = await Musician.create({ name : 'G-Dragon', instrument : 'Voice'})
	let Top = await Musician.create({ name : 'TOP', instrument : 'Voice'})

	await wutang.addMusician(raekwon);
	await wutang.addMusician(methodMan);

	await bigBang.addMusician(GD);
	await bigBang.addMusician(Top);

}
app.use("/musicians", musicRouter)

app.get('/', async (req, res) => {
	res.send('<h1>Hello!</h1>')
})




//TODO: Make a GET Request to the Band model. 
// The Band Model has an association with many musicians
// 1. Respond with the Bands including the Musicians in that band.
app.get("/bands", async (req, res) => {
	try{
		const allBands = await Band.findAll({
			include: Musician
		})

		if(allBands) {
			res.status(200).json(allBands)
		}
	} catch(error) {
		console.log(error)
		res.status(400).send("Unsuccessful")
	}

	
})


//TODO: Make a GET Request to the Band Model at a particular ID
// The Band Model has an association with many musicians 
// 1. Respond with the paricular band including the musician in that particular band
app.get("/bands/:id", async (req, res) => {
	try{
		const band = await Band.findByPk(req.params.id, {
			include: Musician
		})

		if(band) {
			res.status(200).json(band)
		}

	} catch(error) {
		console.log(error)
		res.status(400).send("Unsuccessful")
	}

	
})


app.listen(port, async () => {
	await seed()
    console.log(`Server listening at http://localhost:${port}`)
})
