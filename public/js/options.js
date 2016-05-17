$(document).ready(function(){
  //populates the hotel options
  $.get('/api/attractions/hotels', function (hotels) {
    makeOptions('hotel', hotels)
  })
  //populate the restaurants
  $.get('/api/attractions/restaurants', function (restaurants) {
    makeOptions('restaurant', restaurants)
  })
  //populate the activities
  $.get('/api/attractions/activities', function (activities) {
    makeOptions('activity', activities)
  })

})


function makeOptions(attractionType, attractionArray) {
  var select = $(`#${attractionType}-choices`)

  attractionArray.forEach(function(attraction) {
    var option = $(`<option value="${attraction.id}">${attraction.name}</option>`)[0]
    option.attraction = attraction
    option.attraction.place.type = attractionType
    select.append(option)
  })
}


