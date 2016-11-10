var now = new Date();
var today = now.getDay();
var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var selectedRow;
var rows = document.querySelectorAll(".row");

for(var i = 0; i < rows.length; i++) {
  var row = rows[i];

  // Make rows expandable
  row.querySelector('.collapsed-content').addEventListener('click', function(){
    'use strict';
    var thisRow = this.parentNode.parentNode;
    var allRows = document.querySelectorAll('.row')
    // Close expanded row
    var j, aRow;
    if (selectedRow && (thisRow.getAttribute('id') == selectedRow.getAttribute('id'))) {
      thisRow.classList.remove('row_expanded');
      for(j = 0; j < allRows.length; j++) {
        aRow = allRows[j];
        aRow.classList.remove('row_dimmed');
      }
      document.location.href = '#-'+selectedRow.getAttribute('id');
      selectedRow = null;
    // Expand row
    } else {
      var isSwitchingRows = (selectedRow);
      if (isSwitchingRows) {
        selectedRow.classList.remove('row_expanded');
        selectedRow.classList.add('row_dimmed');
        thisRow.classList.remove('row_dimmed');
        thisRow.classList.add('row_expanded');
        selectedRow = thisRow;
      } else {
        thisRow.classList.add('row_expanded');
        selectedRow = thisRow;
        for(j = 0; j < allRows.length; j++) {
          aRow = allRows[j];
          if (aRow.getAttribute('id') != selectedRow.getAttribute('id')) {
            aRow.classList.add('row_dimmed');
          }
        }
      }
      document.location.href = '#'+selectedRow.getAttribute('id');
    }
  });

  // Set dates for comparison
  var previewDate = new Date(row.getAttribute('preview'));
  var openingDate = new Date(row.getAttribute('opening'));
  var twoWeeks = 12096e5 // two weeks in milliseconds

  // Highlight new shows
  if (now < previewDate) {
    row.classList.add('row_upcoming');
  }

  // Highlight shows closing in the next two weeks
  var closing = row.getAttribute('closing');
  if (closing != undefined) {
    var closingDate = new Date(closing);
    if (now > closingDate) {
      console.log(row.getAttribute('id')+' show expired');
      row.classList.add('row_expired');
    } else if (now > new Date(closingDate - twoWeeks)) {
      row.classList.add('row_closing');
    }
  }

  /********** Callout *******/
  var calloutDiv = row.querySelector('header').querySelector('.callout')
  // Before Previews
  if (now < new Date(previewDate)) {
    calloutDiv.innerHTML = 'PREVIEWS BEGIN ' + moment(previewDate).fromNow();
  // In Previews
  } else if (now >= new Date(previewDate) && now < new Date(openingDate)) {
    calloutDiv.innerHTML = 'IN PREVIEWS NOW';
  // Is Closing
  } else if (closing) {
    calloutDiv.innerHTML = 'LAST PERFORMANCE ' + moment(closingDate).fromNow();
  // Is Showing
  } else {
    var accoladesDiv = row.querySelector('.accolades')
    if (accoladesDiv) {
      calloutDiv.innerHTML = accoladesDiv.innerHTML;
      accoladesDiv.classList.add('accolades_none')
    } else {
      calloutDiv.innerHTML = ""
    }
  }

  // Today's times
  var timetable = row.querySelector('.timetable')
  var todayDiv = row.querySelector('.todays-performance')
  if (timetable) {
    var days = row.querySelectorAll('.day');
    todayDiv.innerHTML = days[today].querySelector('.day__time').innerHTML;
  } else {
    todayDiv.classList.add('todays-performance_none')
    if (now >= new Date(previewDate)) {
      console.log('previews started but have no timetable for ' + row.querySelector('.row-title').innerText )
    }
  }

  // Toggle cost description
  var ticketTitleDivs = row.querySelectorAll('.ticket-title');
  for(var j = 0; j < ticketTitleDivs.length; j++) {
    var ticketTitleDiv = ticketTitleDivs[j];
    ticketTitleDiv.addEventListener('click', function(){
      'use strict';
      if (this.parentNode.classList.contains('expanded')) {
        this.parentNode.classList.remove('expanded');
      } else {
        this.parentNode.classList.add('expanded');
      }
      event.preventDefault();
    });
  }

  // Close row button
  row.querySelector('.close-row').addEventListener('click', function(){
    this.parentNode.parentNode.querySelector('header').click();
  })

}

window.lazySizesConfig = {
  addClasses: true
};

// lazy loading for background images
document.addEventListener('lazybeforeunveil', function(e){
  'use strict';
  var bg = e.target.getAttribute('data-bg');
  if(bg){
      e.target.style.backgroundImage = 'url(' + bg + ')';
  }
});

// Reveal header when scrolling
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var siteHeader = document.querySelector('.header');
var headerHeight = siteHeader.offsetHeight;
window.onscroll = function() {
  'use strict';
  didScroll = true;
};
function hasScrolled() {
  'use strict';
  var start = window.pageYOffset;
  console.log("start: "+start+" lastScrollTop: "+lastScrollTop);
  if(Math.abs(lastScrollTop - start) <= delta) {
    return;
  }
  if( (lastScrollTop < headerHeight) || (lastScrollTop <= 0) ) {
    siteHeader.classList.remove('header_is-down');
    siteHeader.classList.remove('header_is-up');
  } else if( (start > lastScrollTop && start > headerHeight) || (start < delta) ) {
    siteHeader.classList.remove('header_is-down');
    siteHeader.classList.add('header_is-up');
  } else {
    var body = document.body;
    var html = document.documentElement;
    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight,
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
    if (start + window.innerHeight < documentHeight) {
      siteHeader.classList.remove('header_is-up');
      siteHeader.classList.add('header_is-down');
    }
  }
  lastScrollTop = start;
}
setInterval(function() {
  'use strict';
  if(didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

// Nav
var navButtons = document.querySelectorAll('.nav__btn');
for(var i = 0; i < navButtons.length; i++) {
  var navButton = navButtons[i];
  navButton.addEventListener('click', function(){
    'use strict';
    for(var j = 0; j < navButtons.length; j++) {
      var aButton = navButtons[j];
      aButton.classList.remove('nav__btn_active');
    }
    this.classList.add('nav__btn_active');
    var rows = document.querySelector('.expandable-rows');
    rows.classList.remove('expandable-rows_upcoming')
    rows.classList.remove('expandable-rows_current')
    rows.classList.remove('expandable-rows_all')
    if(this.classList.contains('nav__current')) {
      setCookie('selectedNav', 'nav__current', 365)
      rows.classList.add('expandable-rows_current')
    } else if(this.classList.contains('nav__upcoming')) {
      setCookie('selectedNav', 'nav__upcoming', 365)
      rows.classList.add('expandable-rows_upcoming')
    } else {
      setCookie('selectedNav', 'nav__all', 365)
      rows.classList.add('expandable-rows_all')
    }
    event.preventDefault();
  });
}
var savedSelectedNav = getCookie('selectedNav')
if (!savedSelectedNav) {
  savedSelectedNav = 'nav__current'
}
document.querySelector('.'+savedSelectedNav).click()

// Scroll to top
function scrollTo(element, to, duration) {
  'use strict';
  if (duration < 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;
  setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollTo(element, to, duration - 10);
  }, 10);
}
document.querySelector(".header__title").addEventListener('click', function(e){
  'use strict';
  e.preventDefault();
  scrollTo(document.body, 0, 300);
});

// Add date to title
document.querySelector(".header__title").innerHTML = moment(now).format('ddd MMM Do')

// JS Player
var jsplayerlinks = document.querySelectorAll(".js-player-link");
for(var i = 0; i < jsplayerlinks.length; i++) {
  var jsplayerlink = jsplayerlinks[i];
  jsplayerlink.addEventListener('click', function(e){
    'use strict';
    var hasTouch = 'ontouchstart' in window;
    e.preventDefault();
    var videoID = this.getAttribute('href').split('v=')[1];
    var width = 560, height = 315;//min: 560x315
    var autoplay = (hasTouch) ? '' : '&autoplay=1';
    var iframe = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + videoID + '?showinfo=0&modestbranding=0&color=white'+autoplay+'" frameborder="0" allowfullscreen></iframe>';
    document.querySelector(".js-player-wrapper").classList.add('is-open');
    document.querySelector(".js-player").innerHTML = iframe;
  })
}

document.querySelector('.js-player-close').addEventListener('click', function(){
  'use strict';
  document.querySelector(".js-player").innerHTML = '';
  document.querySelector(".js-player-wrapper").classList.remove('is-open');
});

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
