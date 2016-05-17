$(function initializeMap (){

  var graceHopperAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: graceHopperAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  function drawMarker (type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }



  var dayTemplate = `
          <section class="day">
            <div>
              <h4>My Hotel</h4>
              <ul class="list-group trip-day-hotels">
              </ul>
            </div>
            <div>
              <h4>My Restaurants</h4>
              <ul class="list-group trip-day-restaurants">
              </ul>
            </div>
            <div>
              <h4>My Activities</h4>
              <ul class="list-group trip-day-activities">
              </ul>
            </div>
          </section>
    `
  $('#day-add').click(function addDay() {
    // Find the index of the last day section
    var lastIndex = $('section.day').last().data('index')
    console.log(lastIndex) // Are you an array?

    var ourIndex = lastIndex + 1

    // 1. Create a new day section based off dayTemplate
    var day = $(dayTemplate)

    // Set the index on the section we're adding
    day[0].dataset.index = ourIndex
    var self = $(this);
    ///make the ajax call
    $.post(`/api/days/day/${ourIndex}`, function (data) {

      // 2. Append it to the #itinerary
      $('#itinerary').append(day)

      // 3. Unselect all days
      $('.day').removeClass('selected')

      // 3a. select the one we just appended.
      $('#itinerary > .day').last().addClass('selected')

      // Create a button with the right number
      var button = $(`<button class="btn btn-circle day-btn current-day" data-day=${ourIndex}>${ourIndex}</button>`)
      self.before(button)

      // 5. Deselect all day buttons
      $('.day-buttons > button').removeClass('current-day')

      // 6. Select the one we just added
      button.addClass('current-day')
      console.log(ourIndex);
      $('#day-title-index').text(ourIndex)  ;


    })

    //switch days
    $('.day-buttons').on('click', 'button[data-day]', function(event) {
      // Deselect all buttons
      $('.day-buttons > button').removeClass('current-day')

      // Select the button that was clicked
      $(this).addClass('current-day')

      // Deselect all days
      $('.day')
        .removeClass('selected')
        .find('li').each(function(i, li) {
          li.marker.setMap(null)
        })
    })





    // Select the day for the button that was clicked
    $(`.day[data-index="${this.dataset.day}"]`)
      .addClass('selected')
      .find('li')
      .each(function(i, li) {
        li.marker.setMap(currentMap)
      })

    // Update the index display
    $('#day-title-index').text(this.dataset.day)
  })

//adding items to the itinerary
  $(document.body).on('click', 'button[data-action="addSelectionToTrip"]', function(event) {
    // console.log("are we in here")
    console.log(this, event)
    var dst = $(this.dataset.destinationList)

    console.log($(this.dataset.sourceSelect))

    var dayNumber = $('#day-title-index').text();

    var selectedOption = $(this.dataset.sourceSelect)
    Array.from(
      // Get all selected options (usually just one, but why not support many?)
      $(this.dataset.sourceSelect)[0].selectedOptions)
      .forEach(function(option) {
        // /days/dayNumber/
        var attractionType = option.attraction.place.type
        var attractionId = option.attraction.id
        var url = `api/days/${dayNumber}/${attractionType}/${attractionId}`
        console.log('posting to ',url);

        $.post(url, function (data) {
          console.log("are we in here?")
          // Create a new list item with a delete button
          var li = $(`<li class=itinerary-item>
                       ${option.textContent}
                       <button data-action="deleteFromTrip" class="btn btn-xs btn-danger remove btn-circle">x</button>
                     </li>`)[0]
          dst.append(li)
          option.getAttribute('place-latitude')

          // // Draw a marker on the map
          li.marker = drawMarker(option.attraction.place.type,
                                 option.attraction.place.location)
        })

    });
  });

  $.get('/api/days/', function(days){
    // console.log("what's up", days[0])
    var hotel = days[0].hotel;
    addItinerary(hotel, $(".day.selected .trip-day-hotels"));



  })

  function addItinerary(attraction, dst){

    var li = $(`<li class=itinerary-item>
      ${attraction.name}
      <button data-action="deleteFromTrip" class="btn btn-xs btn-danger remove btn-circle">x</button>
      </li>`)[0]
      dst.append(li)
      console.log("attractionnnn", attraction)
      // // Draw a marker on the map
      li.marker = drawMarker(attraction.type,
        attraction.myPlace.location)
  }



//removing from itinerary
  $(document.body).on('click', 'button[data-action="deleteFromTrip"]', function(event) {
    // jQuery's closest function ascends the DOM tree to find the nearest ancestor matching
    // the selector.
    $(this).closest('li.itinerary-item').remove()
  })
});
