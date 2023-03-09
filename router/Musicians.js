const express = require("express")
const app = express()
const {Musician} = require("../index")
const {sequelize} = require("../db");
const router = express.Router()
const {check, validationResult} = require("express-validator")
app.use(express.json());
app.use(express.urlencoded({extended:true}));

router.get('/', async (req, res) => {
	let musicians = await Musician.findAll()
	res.json({musicians})
})

router.get('/:id', async (req, res) => {
	let musician = await Musician.findByPk(req.params.id)
	res.json({musician})
})

router.delete('/:id', async (req, res) => {
	await Musician.destroy({where: {id : req.params.id}})
	res.send("deleted!!")
})

router.post('/', async (req, res) => {
	let newMusician = await Musician.create(req.body)
	res.json(newMusician)
})

router.put('/:id', async (req, res) => {
	let updated = await Musician.update(req.body, {
		where: { id : req.params.id}
	})
	res.json({updated})
})



module.exports = router