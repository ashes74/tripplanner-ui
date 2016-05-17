var router = require('express').Router();
var Promise = require('bluebird');
var models = require('../../models')
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Place = models.Place;
var Day = models.Day;


  router.get('/hotels', function (req, res, next) {
    console.log("hello world from hotels");
    Hotel.findAll({include:Place})
      .then(function (hotels) {
        res.json(hotels);
      })
  })

  router.get('/restaurants', function (req, res, next) {
    console.log("hello world from restos");
    Restaurant.findAll({include:Place})
      .then(function (restaurants) {
        res.json(restaurants);
      })
  })

  router.get('/activities', function (req, res, next) {
    console.log("hello world from activities");
    Activity.findAll({include:Place})
      .then(function (activities) {
        res.json(activities);
      })
  })



module.exports = router;