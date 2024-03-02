const express = require('express');
const Tour = require('../models/tour');
const createPath = require('../helpers/create-path');

const router = express.Router();

router.get('/tours/:id', (req, res) => {
    const title = 'Tour';
    Tour
      .findById(req.params.id)
      .then((tour) => res.render(createPath('tour'), { tour, title }))
      .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
      })
  });
  
  router.delete('/tours/:id', (req, res) => {
    Tour
      .findByIdAndDelete(req.params.id)
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error' });
      });
  });
  
  router.get('/edit/:id', (req, res) => {
    const title = 'Edit Tour';
    Tour
      .findById(req.params.id)
      .then(tour => res.render(createPath('edit-tour'), { tour, title }))
      .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
      })
  });
  
  router.post('/edit/:id', (req, res) => {
    const title = 'Edit Tour';
    const {name, cost, destination, dates, adults, children} = req.body;
    Tour
      .findByIdAndUpdate(req.params.id, {name, cost, destination, dates, adults, children})
      .then(result => res.redirect(`/tours/${req.params.id}`))
      .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
      })
  });
  
  router.get('/tours', (req, res) => {
    const title = 'Tours';
    Tour
      .find()
      .sort({createdAt: -1})
      .then((tours) => res.render(createPath('tours'), { tours, title }))
      .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
      })
  });
  
  router.post('/add-tour', (req, res) => {
    const title = 'Add Tour';
    const {name, cost, destination, dates, adults, children} = req.body;
    const tour = new Tour({name, cost, destination,  dates, adults, children});
    tour
      .save()
      .then((result) => res.redirect('/tours'))
      .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
      })
  });
  
  router.get('/add-tour', (req, res) => {
    const title = 'Add Tour';
    res.render(createPath('add-tour'), { title });
  });

  module.exports = router;