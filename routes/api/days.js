var router = require('express').Router();
var Promise = require('bluebird');
var models = require('../../models')
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Place = models.Place;
var Day = models.Day;

// router.param('/:number', function (req, res, next, number) {
// console.log("in param");
//   Day.find(number)
//     .then(function(day){
//       console.log("Day",day);
//       req.day = day;
//       next();
//   }).catch(next("failed to find day"));
// })



//get all days
router.get('/', function (req, res, next) {
  Day.findAll({
    include: [{
      model: Hotel

    },
      {model: Restaurant},
      {model:Activity}]
  })
    .then(function (days) {
      res.json(days);
    })
})

//get a single day
router.get('/day/:number', function (req, res, next){
  Day.findOne({
    include:[{
      model: Hotel},
      {model: Restaurant},
      {model:Activity}],
    where:{number : req.params.number}
  })
    .then(function(day){
      res.json(day);
    })
});



//create a day
router.post('/day/:number', function (req, res, next) {
    Day.create({number: req.params.number})
      .then(function (day) {
        res.json(day);
        console.log("Day",day);
      })
})

//add hotel to a day
router.post('/:number/:attraction/:id', function (req, res, next) {
  Day.findOne({
    where:{
      number:req.params.number}
    })
  .then(function(day){
    console.log(day,"dayyy")
    if(req.params.attraction === 'hotel'){
    return  day.setHotel(req.params.id) ;
    }
    if (req.params.attraction==="restaurant") {
    return  day.addRestaurant(req.params.id);
    }
    if (req.params.attraction==="activity") {
    return  day.addActivity(req.params.id);
    }
  }).then(function (day) {
    console.log(day, "Day!");
    res.json(day);
  }).catch(next)
});

// router.delete('/:number/:attraction/:id', function(req, res, next){
//   Day.
// })






module.exports=router;