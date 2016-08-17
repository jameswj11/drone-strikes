// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

function renderStrikes(strike){

  let $card       = $('<ul>')
  let $location   = $('<li>')
  let $names      = $('<li>').text('People killed: Unknown')
  let $summary    = $('<li>').text(strike.narrative)
  let $deaths     = $('<li>').text(strike.deaths + ' Deaths')
  let $civilians  = $('<li>').text(strike.civilians + ' civilians killed')
  let $link       = $('<p>').append($('<a target="_BLANK">')
                            .attr('href', strike.bij_link)
                            .text(strike.bij_link))
  let $date       = strike.date.replace('T00:00:00.000Z', '')
  let $saveButton = $('<button>').addClass('save').text('SAVE')

  // conditionals for rendering below
  // check to see if there's a town included in location data
  if (strike.town !== ''){
    $location.text(
      strike.town +
      ', ' + strike.location +
      ', ' + strike.country
    )
  } else {
    $location.text(strike.location + ', ' + strike.country)
  }

  // check if there are names of victims provided
  if (strike.names[0] !== ''){
    $names.text('Names: ' + strike.names[0])
  }

  // check to see if civilians were killed
  if (strike.civilians === '' || strike.civilians === '0'){
    $civilians.text('No civilians killed')
  } else if (strike.civlians !== '0' || strike.civilians !== '') {
    $civilians.css('color', 'red')
  }

  $($card).append($('<h3>').append($date)).append($location, $summary, $deaths, $civilians, $names, $link, $saveButton)

  $('#results').append($card)
  $saveButton.click(addStrike)
}


function getData(){
  $.get('/strikes').done((data)=> {
    // filter through data for search
    filtered = data.filter((strike)=> {
      let $h3 = $('<h3>')

      if($('#country').val() !== ''){
        $('.resultHeader').text('Search Results')
        return strike.country == $('#country').val()
      } else if ($('#location').val() !== ''){
        $('.resultHeader').text('Search Results')
        return strike.location == $('#location').val()
      } else if ($('#date').val() !== ''){
        $('.resultHeader').text('Search Results')
        return strike.date.replace('T00:00:00.000Z', '') == $('#date').val()
      } else {
        $('.resultHeader').text('Showing All Reports')
        return strike
      }
    })

    // for each filtered result, send to render function
    if(filtered.length === 0){
      $('#results').append('<h4>').text('NO RESULTS')
    } else {
      filtered.forEach((filtered)=> {
        renderStrikes(filtered)
      })
    }
  })
}


function addStrike(){
  let $siblings = $(this).siblings()

  let data = {
    date: $siblings.eq(0).text(),
    location: $siblings.eq(1).text(),
    narrative: $siblings.eq(2).text(),
    deaths: $siblings.eq(3).text(),
    civilians: $siblings.eq(4).text(),
    names: $siblings.eq(5).text(),
    report: $siblings.eq(6).text()
  }

  $.post('/save', data).done((response)=> {
  })
}


function getSavedStrikes(){
  $('#saved').empty()
             .append($('<h4>').text('Saved Reports'))

  $.get('/save').done((data)=> {

    data.forEach((strike)=> {
      let $date      = $('<h3>').append(strike.date).val(strike.id)
      let $location  = $('<li>').text(strike.location)
      let $narrative = $('<li>').text(strike.narrative)
      let $deaths    = $('<li>').text(strike.deaths)
      let $civilians = $('<li>').text(strike.civilians)
      let $names     = $('<li>').text(strike.names)
      let $report    = $('<p>').append($('<a target="_BLANK">')
                                .attr('href', strike.report)
                                .text(strike.report))
      let $delete    = $('<button>').addClass('delete').text('DELETE')

      // check to see if civilians were killed
      if (strike.civilians === '' || strike.civilians === '0'){
        $civilians.text('No civilians killed')
      } else if (strike.civlians !== '0' || strike.civilians !== '') {
        $civilians.css('color', 'red')
      }

      let $oneResult = $('<ul>').append($date, $location, $narrative, $deaths, $civilians, $names, $report, $delete)

      $('#saved').append($oneResult)

      $delete.click(deleteStrike)
    })
  })
}


function deleteStrike(){
  let $currentList = $(this).parent()
  let id           = Number.parseInt($(this).siblings().eq(0).val())

  $.ajax({
    url: '/save/' + id,
    method: 'delete'
  }).done(()=> {
    $currentList.empty()
  })
}



// $(document).on('turbolinks:load', function() {
  // clear search results for each click, get data
  $(()=> {
    $('#submit').click(()=> {
      $('#results').empty()
                   .append($('<h4>')
                   .addClass('resultHeader'))

      getData()
    })

    $('#savedSearches').click(()=> {
      getSavedStrikes()
    })
  })
// });
