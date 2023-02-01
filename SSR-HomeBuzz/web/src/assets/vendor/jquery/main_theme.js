var MINOVATE = MINOVATE || {};

$(function() {
  //!!!!!!!!!!!!!!!!!!!!!!!!!
  // navbar section functions
  //!!!!!!!!!!!!!!!!!!!!!!!!!

  MINOVATE.navbar = {

    init: function() {
      
      MINOVATE.navbar.removeRipple();
    },

    removeRipple: function(){
      $sidebar.find('.ink').remove();
    }
  };
  





  //!!!!!!!!!!!!!!!!!!!!!!!!!
  // initialize after resize
  //!!!!!!!!!!!!!!!!!!!!!!!!!

  MINOVATE.documentOnResize = {

		init: function(){

      var t = setTimeout( function(){

        MINOVATE.documentOnReady.setSidebar();
        MINOVATE.navbar.removeRipple();

			}, 500 );

		}

	};






  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // initialize when document ready
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  MINOVATE.documentOnReady = {

	 init: function(){
		MINOVATE.documentOnReady.setSidebar();
	},

    // run on window scrolling
    setSidebar: function() {

      width = $window.width();

      if (width < 992) {
        $app.addClass('sidebar-sm');
      } else {
        $app.removeClass('sidebar-sm sidebar-xs');
      }

      if (width < 768) {
        $app.removeClass('sidebar-sm').addClass('sidebar-xs');
      } else if (width > 992){
        $app.removeClass('sidebar-sm sidebar-xs');
      } else {
        $app.removeClass('sidebar-xs').addClass('sidebar-sm');
      }

      if ($app.hasClass('sidebar-sm-forced')) {
        $app.addClass('sidebar-sm');
      }

      if ($app.hasClass('sidebar-xs-forced')) {
        $app.addClass('sidebar-xs');
      }

    }

	};




  //!!!!!!!!!!!!!!!!!!!!!!!!!
  // global variables
  //!!!!!!!!!!!!!!!!!!!!!!!!!

  var $window = $(window),
      $body = $('body'),
      $header = $('#header'),
      $branding = $('#header .branding'),
      $sidebar = $('#sidebar'),
      $controls = $('#controls'),
      $app = $('.appWrapper'),
      $navigation = $('#navigation'),
      $sparklineEl = $('.sparklineChart'),
      $slimScrollEl = $('.slim-scroll'),
      $collapseSidebarEl = $('.collapse-sidebar'),
      $wrap = $('#wrap'),
      $offcanvasToggleEl = $('.offcanvas-toggle'),

      //navigation elements
      $dropdowns = $navigation.find('ul').parent('li'),
      $a = $dropdowns.children('a'),
      $notDropdowns = $navigation.children('li').not($dropdowns),
      $notDropdownsLinks = $notDropdowns.children('a'),
      // end of navuigation elements

      $headerSchemeEl = $('.color-schemes .header-scheme'),
      $brandingSchemeEl = $('.color-schemes .branding-scheme'),
      $sidebarSchemeEl = $('.color-schemes .sidebar-scheme'),
      $colorSchemeEl = $('.color-schemes .color-scheme'),
      $fixedHeaderEl = $('#fixed-header'),
      $fixedAsideEl = $('#fixed-aside'),
      $toggleRightbarEl = $('.toggle-right-sidebar'),
      $pickDateEl = $('.pickDate'),

      $tileEl = $('.tile'),
      $tileToggleEl = $('.tile .tile-toggle'),
      $tileRefreshEl = $('.tile .tile-refresh'),
      $tileFullscreenEl = $('.tile .tile-fullscreen'),
      $tileCloseEl = $('.tile .tile-close'),

      $easypiechartEl = $('.easypiechart'),
      $chosenEl = $('.chosen-select'),
      $toggleClassEl = $('.toggle-class'),
      $colorPickerEl = $('.colorpicker'),
      $touchspinEl = $('.touchspin'),
      $datepickerEl = $('.datepicker'),
      $animateProgressEl = $('.animate-progress-bar'),
      $counterEl = $('.counter'),
      $splashEl = $('.splash');


  //!!!!!!!!!!!!!
  // initializing
  //!!!!!!!!!!!!!
  $(document).ready( MINOVATE.documentOnReady.init );
  $window.on( 'resize', MINOVATE.documentOnResize.init );

});
