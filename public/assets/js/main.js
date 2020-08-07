/**
* Template Name: Bootslander - v2.2.0
* Template URL: https://bootstrapmade.com/bootslander-free-bootstrap-landing-page-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // Preloader
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 21;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first, .mobile-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the venobox plugin
  $(window).on('load', function() {
    $('.venobox').venobox();
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Initiate venobox lightbox
  $(document).ready(function() {
    $('.venobox').venobox();
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }
  $(window).on('load', function() {
    aos_init();
  });

})(jQuery);

let map;


initMap() 

function initMap() {
  
  var iconBase ='https://developers.google.com/maps/documentation/javascript/examples/full/images/';
  var icons = {
    restaurant: {
      icon: iconBase + './img/favicon.png'
    }
  };



  const mapOptions={
    zoom:11.5,
    center: { lat: 4.7, lng: -74.08175}
    
  }
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var features = [
    {

      position: new google.maps.LatLng(4.7892948, -74.0532604),
      type: 'restaurant',
      name:'Sheriff Burgers',
      link: '<div id="content">'+
      '<h5>Sheriff Burgers</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=sheriffburgers">Ver Menú</a>'
      +'</div>'
    }, 
    {

      position: new google.maps.LatLng(4.7892096, -74.0520554),
      type: 'restaurant',
      name:'El Mesón de la villa',
      link: '<div id="content">'+
      '<h5>El Mesón de la villa</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=mesondelavilla">Ver Menú</a>'
      +'</div>'
    },

    {

      position: new google.maps.LatLng(4.6128671, -74.1449886),
      type: 'restaurant',
      name:'Delicias del pacífico',
      link: '<div id="content">'+
      '<h5>Delicias del pacífico</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=mesondelavilla">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6115241, -74.1467656),
      type: 'restaurant',
      name:'Genius Pizza',
      link: '<div id="content">'+
      '<h5>Genius Pizza</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=Geniuspizza">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6115566, -74.1467496),
      type: 'restaurant',
      name:'Donde el Gordo Antonio',
      link: '<div id="content">'+
      '<h5>Donde el Gordo Antonio</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=Dondeelgordoantonio">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6049465, -74.1451151),
      type: 'restaurant',
      name:'El Barrio Burguer JS ',
      link: '<div id="content">'+
      '<h5>El Barrio Burguer JS </h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=mibarrioburgerjs">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6143132, -74.1500766),
      type: 'restaurant',
      name:'Gaia Restaurante & Pizzeria ',
      link: '<div id="content">'+
      '<h5>Gaia Restaurante & Pizzeria </h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=gaiarestauranteypizzeria">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6686304,-74.12139),
      type: 'restaurant',
      name:'María Patacón ',
      link: '<div id="content">'+
      '<h5>María Patacón </h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=mariapatacon">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6145886, -74.1455946),
      type: 'restaurant',
      name:'Restaurante y cafetería Julis',
      link: '<div id="content">'+
      '<h5>Restaurante y cafetería Julis</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=restaranteycafeteriajulis">Ver Menú</a>'
      +'</div>'
    },

    {
      position: new google.maps.LatLng(4.6992268, -74.046111),
      type: 'restaurant',
      name:'Restaurante Mamá Vieja',
      link: '<div id="content">'+
      '<h5>Restaurante Mamá Vieja</h5>'+
      '<a href="https://almuerza.co/menu/menu.html?restaurante=restaurantemamavieja">Ver Menú</a>'
      +'</div>'
    },

  ];

  features.forEach(function(element){

    var contentString=element.link
    
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    })

    var marker = new google.maps.Marker({
      position: element.position,
      icon:'assets/img/logoicon.png',
      map: map
    });

     marker.addListener('click', function() {
   
         infoWindow.setContent(element.link);
         infoWindow.open(map, marker);
    })
      

  })


              //infoWindow.setContent(features[i].link);
              //infoWindow.open(map, marker);
    
  
  }

  // function getLocation() {
  //   if (navigator.geolocation) {
     
  //    cordenadas= navigator.geolocation.getCurrentPosition(showPosition)
     
      
  //   } else { 
  //     console.log("La geolocalizacion no esta permitida en este buscador")
  //   }
  // }

  // function showPosition(position) {
  // console.log(current_lat=position.coords.latitude)
  // console.log(current_lon=position.coords.longitude)
  // $('.user-lat').append(current_lat=position.coords.latitude)
  // $('.user-lon').append(current_lon=position.coords.longitude)
  
  // }




