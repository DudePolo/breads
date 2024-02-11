const express = require('express')
const breads = express.Router()
const Bread = require('../models/bread.js')
//const breadSeedData = require('../models/bread_seed.js')
const Baker = require ('../models/baker.js')

// INDEX
breads.get('/', async (req, res) => {
  const foundBakers = await Baker.find().lean()
  const foundBreads = await Bread.find().limit(2).lean()
  res.render('index', {
    breads: foundBreads,
    bakers: foundBakers,
    title: 'Index Page'
    })
})

// NEW
breads.get('/new', (req, res) => {
  Baker.find()
    .then(foundBakers => {
      res.render('new', {
        bakers: foundBakers
    })
  })
})

// EDIT
breads.get('/:id/edit', (req, res) => {
  Baker.find()
    .then(foundBaker => {
      Bread.findById(req.params.id)
        .then(foundBread => {
          res.render('edit', {
            bread: foundBread,
            bakers: foundBakers
        })
      })
    })
})

// SHOW
breads.get('/:id', (req, res) => {
  Bread.findById(req.params.id)
    .populate('baker')
    .then(foundBread => {
      const bakedBy = foundBread.getBakedBy()
      console.log(bakedBy)
      res.render('show', {
        bread: foundBread
      })
    })
    .catch(err => {
      res.send('404')
    })
  // if (Bread[req.params.arrayIndex]) {
  //   res.render('Show', {
  //     bread:Bread[req.params.arrayIndex],
  //     index: req.params.arrayIndex
  //   })
  // } else {
  //   res.send('404')
  // }
})

// CREATE
breads.post('/', (req, res) => {
  //console.log(req.body)
  if (!req.body.image) {
    req.body.image = undefined
  }
  if(req.body.hasGluten === 'on') {
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.create(req.body)
  res.redirect('/breads')
})


// UPDATE
breads.put('/:id', (req, res) => {
  if(req.body.hasGluten === 'on'){
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.findByIdAndUpdate(req.params.id, req.body, { new: true})
    .then(updatedBread => {
      console.log(updatedBread)
      res.redirect(`/breads/${req.params.id}`)
    })
})

// DELETE
breads.delete('/:id', (req, res) => {
  Bread.findByIdAndDelete(req.params.id)
    .then(deletedBread => {
      res.status(303).redirect('/breads')
    })
})


// breads.get('/data/seed', (req, res) => {
//   Bread.insertMany(breadSeedData)
//     .then(createdBreads => {
//       res.redirect('/breads')
//     })
// })




module.exports = breads
