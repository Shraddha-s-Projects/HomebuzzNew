var MINOVATE = MINOVATE || {};

// popup
var popupFunctionObject = (function () {
  return {
    showPopUp: function (id) {
      $('#' + id).fadeIn(250);
      $('.popup-box').removeClass('transform-out').addClass('transform-in');
    },
    closePopUp: function () {
      $('.popup-wrap').fadeOut(500);
      $('.popup-box').removeClass('transform-in').addClass('transform-out');
    },
    showLoader: function () {
      $('#LoaderInner').show();
    },
    hideLoader: function () {
      $('#LoaderInner').hide();
    },
    hideToaster: function () {

      setTimeout(function () {
        $('#toast-container').addClass("hidden");
      }, 8000);

    }
  }
})(popupFunctionObject || {})


// popup
var ImageGallary = (function () {
  return {
    init: function () {
      var slideIndex = 1;
    },
    openModal: function () {
      document.getElementById('imageGallery').style.display = "block";
    },
    closeModal: function () {
      document.getElementById('imageGallery').style.display = "none";
    },
    plusSlides: function (n) {
      showSlides(slideIndex += n);
    },
    currentSlide: function (n) {
      showSlides(slideIndex = n);
    },
    showSlides: function (n, slideIndex) {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("demo");
      var captionText = document.getElementById("caption");
      // if (n > slides.length) {slideIndex = 1}
      // if (n < 1) {slideIndex = slides.length}
      // for (i = 0; i < slides.length; i++) {
      //     slides[i].style.display = "none";
      // }
      // for (i = 0; i < dots.length; i++) {
      //     dots[i].className = dots[i].className.replace(" active", "");
      // }
      // slides[slideIndex-1].style.display = "block";
      // dots[slideIndex-1].className += " active";
      // captionText ? captionText.innerHTML = dots[slideIndex-1].alt : false;
    }
  }
})(ImageGallary || {})

// DocumentReady_1 Initialization
var DocumentReady_1 = (function () {
  return {
    init: function () {
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
        //$toggleRightbarEl = $('.toggle-right-sidebar'),
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


      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // global inicialization functions
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!       
      MINOVATE.global = {
        init: function () {
          MINOVATE.global.deviceSize();
          MINOVATE.global.layout();
          MINOVATE.global.animsition();
        },

        // device identification function
        deviceSize: function () {
          var jRes = jRespond([
            {
              label: 'smallest',
              enter: 0,
              exit: 479
            }, {
              label: 'handheld',
              enter: 480,
              exit: 767
            }, {
              label: 'tablet',
              enter: 768,
              exit: 991
            }, {
              label: 'laptop',
              enter: 992,
              exit: 1199
            }, {
              label: 'desktop',
              enter: 1200,
              exit: 10000
            }
          ]);
          jRes.addFunc([
            {
              breakpoint: 'desktop',
              enter: function () { $body.addClass('device-lg'); },
              exit: function () { $body.removeClass('device-lg'); }
            }, {
              breakpoint: 'laptop',
              enter: function () { $body.addClass('device-md'); },
              exit: function () { $body.removeClass('device-md'); }
            }, {
              breakpoint: 'tablet',
              enter: function () { $body.addClass('device-sm'); },
              exit: function () { $body.removeClass('device-sm'); }
            }, {
              breakpoint: 'handheld',
              enter: function () { $body.addClass('device-xs'); },
              exit: function () { $body.removeClass('device-xs'); }
            }, {
              breakpoint: 'smallest',
              enter: function () { $body.addClass('device-xxs'); },
              exit: function () { $body.removeClass('device-xxs'); }
            }
          ]);
        },

        layout: function () {
          var defaultHeaderScheme = 'scheme-default',
            defaultNavbarScheme = 'scheme-default',
            defaultBrandingScheme = 'scheme-default',
            defaultColorScheme = 'default-scheme-color',
            defaultHeaderPosition = 'header-fixed',
            defaultNavbarPosition = 'aside-fixed',
            defaultRightbarVisibility = 'rightbar-hidden',
            defaultAppClasses = 'scheme-default default-scheme-color header-fixed aside-fixed rightbar-hidden';

          $body.addClass(defaultAppClasses);
          $header.addClass(defaultHeaderScheme);
          $branding.addClass(defaultBrandingScheme);
          $sidebar.addClass(defaultNavbarScheme).addClass(defaultNavbarPosition);

          $headerSchemeEl.on('click', function ($event) {
            var scheme = $(this).data('scheme');

            $body.removeClass(defaultHeaderScheme).addClass(scheme);
            $header.removeClass(defaultHeaderScheme).addClass(scheme);
            defaultHeaderScheme = scheme;
            $event.stopPropagation();
          });

          $brandingSchemeEl.on('click', function ($event) {
            var scheme = $(this).data('scheme');

            $branding.removeClass(defaultBrandingScheme).addClass(scheme);
            defaultBrandingScheme = scheme;
            $event.stopPropagation();
          });

          $sidebarSchemeEl.on('click', function ($event) {
            var scheme = $(this).data('scheme');

            $body.removeClass(defaultNavbarScheme).addClass(scheme);
            $sidebar.removeClass(defaultNavbarScheme).addClass(scheme);
            defaultNavbarScheme = scheme;
            $event.stopPropagation();
          });

          $colorSchemeEl.on('click', function ($event) {
            var scheme = $(this).data('scheme');

            $body.removeClass(defaultColorScheme).addClass(scheme);
            defaultColorScheme = scheme;
            $event.stopPropagation();
          });

          $fixedHeaderEl.change(function () {
            if ($body.hasClass('header-fixed')) {
              $body.removeClass('header-fixed').addClass('header-static');
            } else {
              $body.removeClass('header-static').addClass('header-fixed');
            }
          });
          $fixedHeaderEl.parent().on('click', function ($event) {
            $event.stopPropagation();
          });

          $fixedAsideEl.change(function () {
            if ($body.hasClass('aside-fixed')) {
              $body.removeClass('aside-fixed').addClass('aside-static');
              $sidebar.removeClass('aside-fixed').addClass('aside-static');
            } else {
              $body.removeClass('aside-static').addClass('aside-fixed');
              $sidebar.removeClass('aside-static').addClass('aside-fixed');
            }
          });
          $fixedAsideEl.parent().on('click', function ($event) {
            $event.stopPropagation();
          });

          // $toggleRightbarEl.on('click', function() {
          //   if ($body.hasClass('rightbar-hidden')) {
          //     $body.removeClass('rightbar-hidden').addClass('rightbar-show');
          //     $("#rightbar").css('display','block');
          //   } else {
          //     $body.removeClass('rightbar-show').addClass('rightbar-hidden');
          //     $("#rightbar").css('display','none');
          //   }
          // });

          // if ($body.hasClass('rightbar-show')) {
          //   $body.removeClass('rightbar-show').addClass('rightbar-hidden');
          //   $("#rightbar").css('display','none');
          // } 

          if ($app.hasClass('boxed-layout')) {
            $app.parent().addClass('boxed-layout');
          }

          if ($app.hasClass('sidebar-offcanvas')) {
            $app.parent().addClass('sidebar-offcanvas');
          }

          if ($app.hasClass('hz-menu')) {
            $app.parent().addClass('hz-menu');
          }

          if ($app.hasClass('rtl')) {
            $app.parent().addClass('rtl');
          }

        },

        // initialize animsition
        animsition: function () {
          $wrap.animsition({
            inClass: 'fade-in',
            outClass: 'fade-out',
            inDuration: 1500,
            outDuration: 800,
            linkElement: '.animsition-link',
            // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
            loading: true,
            loadingParentElement: 'body', //animsition wrapper element
            loadingClass: 'animsition-loading',
            unSupportCss: ['animation-duration',
              '-webkit-animation-duration',
              '-o-animation-duration'
            ],
            //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
            //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".

            overlay: false,
            overlayClass: 'animsition-overlay-slide',
            overlayParentElement: 'body'
          });
        }

      };


      //!!!!!!!!!!!!!!!!!!!!!!!!!
      // header section functions
      //!!!!!!!!!!!!!!!!!!!!!!!!!
      MINOVATE.header = {

        init: function () {

        }
      };


      //!!!!!!!!!!!!!!!!!!!!!!!!!
      // navbar section functions
      //!!!!!!!!!!!!!!!!!!!!!!!!!
      MINOVATE.navbar = {

        init: function () {
          MINOVATE.navbar.menu();
          MINOVATE.navbar.ripple();
          MINOVATE.navbar.removeRipple();
          MINOVATE.navbar.collapse();
          MINOVATE.navbar.offcanvas();
        },

        menu: function () {
          if ($dropdowns.length > 0) {

            $dropdowns.addClass('dropdown');

            var $submenus = $dropdowns.find('ul >.dropdown');
            $submenus.addClass('submenu');

            $a.append('<i class="fa fa-plus"></i>');

            $a.on('click', function (event) {
              if ($app.hasClass('sidebar-sm') || $app.hasClass('sidebar-xs') || $app.hasClass('hz-menu')) {
                return false;
              }

              var $this = $(this),
                $parent = $this.parent('li'),
                $openSubmenu = $('.submenu.open');

              if (!$parent.hasClass('submenu')) {
                $dropdowns.not($parent).removeClass('open').find('ul').slideUp();
              }

              $openSubmenu.not($this.parents('.submenu')).removeClass('open').find('ul').slideUp();
              $parent.toggleClass('open').find('>ul').stop().slideToggle();
              event.preventDefault();
            });

            $dropdowns.on('mouseenter', function () {
              $sidebar.addClass('dropdown-open');
              $controls.addClass('dropdown-open');
            });

            $dropdowns.on('mouseleave', function () {
              $sidebar.removeClass('dropdown-open');
              $controls.removeClass('dropdown-open');
            });

            $notDropdownsLinks.on('click', function () {
              $dropdowns.removeClass('open').find('ul').slideUp();
            });

            var $activeDropdown = $('.dropdown>ul>.active').parent();

            $activeDropdown.css('display', 'block');
          }
        },

        ripple: function () {
          var parent, ink, d, x, y;

          $navigation.find('>li>a').click(function (e) {
            parent = $(this).parent();
            parent.parent().find("li").removeClass("active");
            parent.addClass('active');
            if (parent.find('.ink').length === 0) {
              parent.prepend('<span class="ink"></span>');
            }

            ink = parent.find('.ink');
            //incase of quick double clicks stop the previous animation
            ink.removeClass('animate');

            //set size of .ink
            if (!ink.height() && !ink.width()) {
              //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
              d = Math.max(parent.outerWidth(), parent.outerHeight());
              ink.css({ height: d, width: d });
            }

            //get click coordinates
            //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
            x = e.pageX - parent.offset().left - ink.width() / 2;
            y = e.pageY - parent.offset().top - ink.height() / 2;

            //set the position and add class .animate
            ink.css({ top: y + 'px', left: x + 'px' }).addClass('animate');

            setTimeout(function () {
              $('.ink').remove();
            }, 600);
          });
        },

        removeRipple: function () {
          $sidebar.find('.ink').remove();
        },

        collapse: function () {
          $collapseSidebarEl.on('click', function (e) {
            if ($app.hasClass('sidebar-sm')) {
              $app.removeClass('sidebar-sm').addClass('sidebar-xs');
            }
            else if ($app.hasClass('sidebar-xs')) {
              $app.removeClass('sidebar-xs');
            }
            else {
              $app.addClass('sidebar-sm');
            }

            $app.removeClass('sidebar-sm-forced sidebar-xs-forced');
            $app.parent().removeClass('sidebar-sm sidebar-xs');
            MINOVATE.navbar.removeRipple;
            //$window.trigger('resize');
            e.preventDefault();
          });
        },

        offcanvas: function () {
          $offcanvasToggleEl.on('click', function (e) {
            if ($app.hasClass('offcanvas-opened')) {
              $app.removeClass('offcanvas-opened');
            } else {
              $app.addClass('offcanvas-opened');
            }
            e.preventDefault();
          });
        }
      };

      //!!!!!!!!!!!!!!!!
      // tiles functions
      //!!!!!!!!!!!!!!!!
      MINOVATE.tiles = {

        init: function () {
          MINOVATE.tiles.toggle();
          MINOVATE.tiles.refresh();
          MINOVATE.tiles.fullscreen();
          MINOVATE.tiles.close();
        },

        toggle: function () {
          $tileToggleEl.on('click', function () {
            var element = $(this);
            var tile = element.parents('.tile');

            tile.toggleClass('collapsed');
            tile.children().not('.tile-header').slideToggle(150);
          });
        },

        refresh: function () {
          $tileRefreshEl.on('click', function () {
            var element = $(this);
            var tile = element.parents('.tile');
            var dropdown = element.parents('.dropdown');

            tile.addClass('refreshing');
            dropdown.trigger('click');

            var t = setTimeout(function () {
              tile.removeClass('refreshing');
            }, 3000);
          });
        },

        fullscreen: function () {
          $tileFullscreenEl.on('click', function () {
            var element = $(this);
            var tile = element.parents('.tile');
            var dropdown = element.parents('.dropdown');

            screenfull.toggle(tile[0]);
            dropdown.trigger('click');
          });

          if ($tileFullscreenEl.length > 0) {
            $(document).on(screenfull.raw.fullscreenchange, function () {
              var element = $(screenfull.element);
              if (screenfull.isFullscreen) {
                element.addClass('isInFullScreen');
              } else {
                $('.tile.isInFullScreen').removeClass('isInFullScreen');
              }
            });
          }
        },

        close: function () {
          $tileCloseEl.on('click', function () {
            var element = $(this);
            var tile = element.parents('.tile');

            tile.addClass('closed').fadeOut();
          });
        }

      };


      //!!!!!!!!!!!!!!!!
      // extra functions
      //!!!!!!!!!!!!!!!!
      MINOVATE.extra = {

        init: function () {
          MINOVATE.extra.sparklineChart();
          MINOVATE.extra.slimScroll();
          MINOVATE.extra.daterangePicker();
          MINOVATE.extra.easypiechart();
          MINOVATE.extra.chosen();
          MINOVATE.extra.toggleClass();
          MINOVATE.extra.colorpicker();
          MINOVATE.extra.touchspin();
          MINOVATE.extra.datepicker();
          MINOVATE.extra.animateProgress();
          MINOVATE.extra.counter();
          MINOVATE.extra.popover();
          MINOVATE.extra.tooltip();
          MINOVATE.extra.splash();
          MINOVATE.extra.lightbox();
        },

        //initialize sparkline chart on elements
        sparklineChart: function () {

          if ($sparklineEl.length > 0) {
            $sparklineEl.each(function () {
              var element = $(this);

              element.sparkline('html', { enableTagOptions: true });
            });
          }

        },

        //initialize slimscroll on elements
        slimScroll: function () {

          if ($slimScrollEl.length > 0) {
            $slimScrollEl.each(function () {
              var element = $(this);

              element.slimScroll({ height: '100%' });
            });
          }

        },

        //initialize date range picker on elements
        daterangePicker: function () {

          if ($pickDateEl.length > 0) {
            $pickDateEl.each(function () {
              var element = $(this);

              element.find('span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

              element.daterangepicker({
                format: 'MM/DD/YYYY',
                startDate: moment().subtract(29, 'days'),
                endDate: moment(),
                minDate: '01/01/2012',
                maxDate: '12/31/2015',
                dateLimit: { days: 60 },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                ranges: {
                  'Today': [moment(), moment()],
                  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                opens: 'left',
                drops: 'down',
                buttonClasses: ['btn', 'btn-sm'],
                applyClass: 'btn-success',
                cancelClass: 'btn-default',
                separator: ' to ',
                locale: {
                  applyLabel: 'Submit',
                  cancelLabel: 'Cancel',
                  fromLabel: 'From',
                  toLabel: 'To',
                  customRangeLabel: 'Custom',
                  daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                  firstDay: 1
                }
              }, function (start, end, label) {
                console.log(start.toISOString(), end.toISOString(), label);
                element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
              });

            });
          }

        },

        easypiechart: function () {
          if ($easypiechartEl.length > 0) {
            $easypiechartEl.each(function () {
              var element = $(this);
              element.easyPieChart({
                onStart: function (value) {
                  if (element.hasClass('animate')) {
                    $(this.el).find('span').countTo({ to: value });
                  }
                }
              });
            });
          }
        },

        chosen: function () {
          if ($chosenEl.length > 0) {
            $chosenEl.each(function () {
              var element = $(this);
              element.on('chosen:ready', function (e, chosen) {
                var width = element.css("width");
                element.next().find('.chosen-choices').addClass('form-control');
                element.next().css("width", width);
                element.next().find('.search-field input').css("width", "125px");
              }).chosen();
            });
          }
        },

        toggleClass: function () {
          $toggleClassEl.on('click', function () {
            var element = $(this),
              className = element.data('toggle'),
              type = element.data('type');

            if (type === 'radio') {
              element.parent().find('.' + className).removeClass(className);
            }

            if (element.hasClass(className)) {
              element.removeClass(className);
            } else {
              element.addClass(className);
            }
          });
        },

        colorpicker: function () {
          if ($colorPickerEl.length > 0) {
            $colorPickerEl.each(function () {
              var element = $(this);
              element.colorpicker();
            });
          }
        },

        touchspin: function () {
          if ($touchspinEl.length > 0) {
            $touchspinEl.each(function () {
              var element = $(this);
              element.TouchSpin();
            });
          }
        },

        datepicker: function () {
          if ($datepickerEl.length > 0) {
            $datepickerEl.each(function () {
              var element = $(this);
              var format = element.data('format')
              element.datetimepicker({
                format: format,
              });
            });
          }
        },

        animateProgress: function () {
          if ($animateProgressEl.length > 0) {
            $animateProgressEl.each(function () {
              var element = $(this);
              var progress = element.data('percentage');

              element.css('width', progress);
            });
          }
        },

        counter: function () {
          if ($counterEl.length > 0) {
            $counterEl.each(function () {
              var element = $(this);

              element.countTo();
            });
          }
        },

        popover: function () {
          $popoverEl = $('[data-toggle="popover"]');
          if ($popoverEl.length > 0) {
            $popoverEl.each(function () {
              var element = $(this);

              element.popover();
            });
          }
        },

        tooltip: function () {
          $tooltipEl = $('[data-toggle="tooltip"]');
          if ($tooltipEl.length > 0) {
            $tooltipEl.each(function () {
              var element = $(this);

              element.tooltip();
            });
          }
        },

        splash: function () {
          var options = "";
          var target = "";
          $splashEl.on('show.bs.modal', function (e) {
            options = e.relatedTarget.dataset.options;
            target = $(e.target);

            target.addClass(options);
            $body.addClass(options).addClass('splash');
          });
          $splashEl.on('hidden.bs.modal', function () {
            target.removeClass(options);
            $body.removeClass(options).removeClass('splash');
          });
        },

        //initialize magnificPopup lightbox
        lightbox: function () {
          var $lightboxImageEl = $('[data-lightbox="image"]'),
            $lightboxIframeEl = $('[data-lightbox="iframe"]'),
            $lightboxGalleryEl = $('[data-lightbox="gallery"]');

          if ($lightboxImageEl.length > 0) {
            $lightboxImageEl.magnificPopup({
              type: 'image',
              closeOnContentClick: true,
              closeBtnInside: false,
              fixedContentPos: true,
              image: {
                verticalFit: true
              }
            });
          }

          if ($lightboxIframeEl.length > 0) {
            $lightboxIframeEl.magnificPopup({
              disableOn: 600,
              type: 'iframe',
              removalDelay: 160,
              preloader: false,
              fixedContentPos: false
            });
          }

          if ($lightboxGalleryEl.length > 0) {
            $lightboxGalleryEl.each(function () {
              var element = $(this);

              if (element.find('a[data-lightbox="gallery-item"]').parent('.clone').hasClass('clone')) {
                element.find('a[data-lightbox="gallery-item"]').parent('.clone').find('a[data-lightbox="gallery-item"]').attr('data-lightbox', '');
              }

              element.magnificPopup({
                delegate: 'a[data-lightbox="gallery-item"]',
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                fixedContentPos: true,
                image: {
                  verticalFit: true
                },
                gallery: {
                  enabled: true,
                  navigateByImgClick: true,
                  preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                }
              });
            });
          }
        }

      };


      //!!!!!!!!!!!!!!!!!!!!
      // check mobile device
      //!!!!!!!!!!!!!!!!!!!!
      MINOVATE.isMobile = {
        Android: function () {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
          return (MINOVATE.isMobile.Android() || MINOVATE.isMobile.BlackBerry() || MINOVATE.isMobile.iOS() || MINOVATE.isMobile.Opera() || MINOVATE.isMobile.Windows());
        }
      };


      //!!!!!!!!!!!!!!!!!!!!!!!!!
      // initialize after resize
      //!!!!!!!!!!!!!!!!!!!!!!!!!
      MINOVATE.documentOnResize = {

        init: function () {

          var t = setTimeout(function () {

            MINOVATE.documentOnReady.setSidebar();
            MINOVATE.navbar.removeRipple();

          }, 500);

        }

      };


      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // initialize when document ready
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      MINOVATE.documentOnReady = {

        init: function () {
          MINOVATE.global.init();
          MINOVATE.header.init();
          MINOVATE.navbar.init();
          MINOVATE.documentOnReady.windowscroll();
          MINOVATE.tiles.init();
          MINOVATE.extra.init();
          MINOVATE.documentOnReady.setSidebar();
          MINOVATE.documentOnReady.filterDashes();
          MINOVATE.documentOnReady.searchDropdown();
          MINOVATE.documentOnReady.mainLoader();
          MINOVATE.documentOnReady.accordianInit();
          MINOVATE.documentOnReady.rating();
          MINOVATE.documentOnReady.tabInit();
          MINOVATE.documentOnReady.toggleDiv();
          MINOVATE.documentOnReady.general();
        },

        // run on window scrolling
        windowscroll: function () {
          $window.on('scroll', function () {
          });
        },

        setSidebar: function () {
          width = $window.width();

          if (width < 992) {
            $app.addClass('sidebar-sm');
          } else {
            $app.removeClass('sidebar-sm sidebar-xs');
          }

          if (width < 768) {
            $app.removeClass('sidebar-sm').addClass('sidebar-xs');
          } else if (width > 992) {
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
        },

        filterDashes: function () {
          $(".filter-button").click(function () {
            var value = $(this).attr('data-filter');
            if (value == "all") {
              $('.filter').show('1000');
            }
            else {
              $(".filter").not('.' + value).hide('3000');
              $('.filter').filter('.' + value).show('3000');
            }
          });

          if ($(".filter-button").removeClass("active")) {
            $(this).removeClass("active");
          }

          $(this).addClass("active");
        },

        searchDropdown: function () {
          $(".dropdown").click(
            function (e) {
              $(this).find('.dropdown-menu-click').click(function () { return false; });
              if ($(this).find('.dropdown-menu-click').hasClass("hidden")) {
                $(this).find('.dropdown-menu-click').removeClass("hidden");
                $('.dropdown-menu-click', this).fadeIn("fast");
              }
              else {
                $(this).find('.dropdown-menu-click').addClass("hidden");
                $('.dropdown-menu-click', this).fadeOut("fast");
              }
            });

          $(document).mouseup(function(e) 
          {
              var container = $(".dropdown-menu-click");
              var parentContainer = $(".dropdown");
              // if the target of the click isn't the container nor a descendant of the container
              if (!container.is(e.target) && container.has(e.target).length === 0 && parentContainer.has(e.target).length === 0){
                $(this).find('.dropdown-menu-click').addClass("hidden");
                $('.dropdown-menu-click', this).fadeOut("fast");
              }
          });
        },

        mainLoader: function () {
          setTimeout(function () {
            $('body').addClass('loaded');
          }, 10);

          (function ($, window, document, undefined) {

            var pluginName = "tabulous",
              defaults = {
                effect: 'scale'
              };

            // $('<style>body { background-color: red; color: white; }</style>').appendTo('head');

            function Plugin(element, options) {
              this.element = element;
              this.$elem = $(this.element);
              this.options = $.extend({}, defaults, options);
              this._defaults = defaults;
              this._name = pluginName;
              this.init();
            }

            Plugin.prototype = {

              init: function () {

                var links = this.$elem.find('a');
                var firstchild = this.$elem.find('li:first-child').find('a');
                var lastchild = this.$elem.find('li:last-child').after('<span class="tabulousclear"></span>');

                if (this.options.effect == 'scale') {
                  tab_content = this.$elem.find('div').not(':first').not(':nth-child(1)').addClass('hidescale');
                } else if (this.options.effect == 'slideLeft') {
                  tab_content = this.$elem.find('div').not(':first').not(':nth-child(1)').addClass('hideleft');
                } else if (this.options.effect == 'scaleUp') {
                  tab_content = this.$elem.find('div').not(':first').not(':nth-child(1)').addClass('hidescaleup');
                } else if (this.options.effect == 'flip') {
                  tab_content = this.$elem.find('div').not(':first').not(':nth-child(1)').addClass('hideflip');
                }

                var firstdiv = this.$elem.find('#tabs_container');
                var firstdivheight = firstdiv.find('div:first').height();

                var alldivs = this.$elem.find('div:first').find('div');

                alldivs.css({ 'position': 'absolute', 'top': '40px', 'width': '100%' });

                firstdiv.css('height', firstdivheight + 'px');

                firstchild.addClass('tabulous_active');

                links.bind('click', { myOptions: this.options }, function (e) {
                  e.preventDefault();

                  var $options = e.data.myOptions;
                  var effect = $options.effect;

                  var mythis = $(this);
                  var thisform = mythis.parent().parent().parent();
                  var thislink = mythis.attr('href');


                  firstdiv.addClass('transition');

                  links.removeClass('tabulous_active');
                  mythis.addClass('tabulous_active');
                  thisdivwidth = thisform.find('div' + thislink).height();

                  if (effect == 'scale') {
                    alldivs.removeClass('showscale').addClass('make_transist').addClass('hidescale');
                    thisform.find('div' + thislink).addClass('make_transist').addClass('showscale');
                  } else if (effect == 'slideLeft') {
                    alldivs.removeClass('showleft').addClass('make_transist').addClass('hideleft');
                    thisform.find('div' + thislink).addClass('make_transist').addClass('showleft');
                  }
                  firstdiv.css('height', thisdivwidth + 'px');
                });
              },

            };
            $.fn[pluginName] = function (options) {
              return this.each(function () {
                new Plugin(this, options);
              });
            };

          })(jQuery, window, document);


          $(document).ready(function ($) {

            $('#tabs2').tabulous({
              effect: 'slideLeft'
            });
          })

          // hide show start

          $(document).ready(function () {
            $(".filter_btn").click(function () {
              $(".filter_alphabate").toggle()
            });
          });

          // hide show end

          // For a full explanation of this code, please refer to the blogpost at http://www.bram.us/2014/01/05/css-animated-content-switching/
          jQuery(function ($) {

            var startAnimation = function ($panelContainer) {

              // Set .animating class (which triggers the CSS to start the animation)
              $panelContainer.addClass('animating');

            };

            var updatePanelNav = function ($panelNav, $panelContainer, $panelToSlideIn, numPanels) {

              // Find index of $panelToSlideIn in the $panelContainer
              var idx = $panelToSlideIn.index('#' + $panelContainer.attr('id') + ' > .panel');

              if (idx === 0) {
                $panelNav.find('a[href="#prev"]').addClass('inactive');
              } else {
                $panelNav.find('a[href="#prev"]').removeClass('inactive');
              }

              if (idx == numPanels - 1) {
                $panelNav.find('a[href="#next"]').addClass('inactive');
              } else {
                $panelNav.find('a[href="#next"]').removeClass('inactive');
              }

            };

            var stopAnimation = function ($panelContainer, $panels, $panelToSlideIn) {

              // Fix for browsers who fire this handler for both prefixed and unprefixed events (looking at you, Chrome): remove any listeners
              // $panelToSlideIn.off('transitionend webkitTransitionEnd	MSTransitionEnd');

              // An optional extra class (or set of classes) that might be set on the panels
              var extraClass = $panelContainer.data('extraclass') || '';

              // set slid in panel as the current one
              $panelToSlideIn.removeClass().addClass('panel current ' + extraClass);

              // reset all other panels
              $panels.filter(':not(#' + $panelToSlideIn.attr('id') + ')').removeClass().addClass('panel ' + extraClass);

              // Allow a new animation
              $panelContainer.removeClass('animating');

            };

            var setExitPanel = function ($panelToSlideOut, exitAnimation) {

              $panelToSlideOut
                .addClass('exit ' + exitAnimation)
                .removeClass('current');

            };

            var setEnterPanel = function ($panelContainer, $panels, $panelToSlideIn, enterAnimation) {

              $panelToSlideIn

                // Slide it into view
                .addClass('enter ' + enterAnimation)

                // When sliding in is done,
                // .one('transitionend webkitTransitionEnd MSTransitionEnd', function(e) {

                // moved to a setTimeout in the click handling logic itself because Firefox doesn't always fire this!!!
                // stopAnimation($panelContainer, $panels, $panelToSlideIn)

                // })
                ;

            };

            $('.panelNav').each(function (i) {
              var $panelNav = $(this),
                $panelNavItems = $panelNav.find('a'),
                $panelContainer = $('#' + $panelNav.data('panelwrapper')),
                $panels = $panelContainer.find('> .panel'),
                numPanels = $panels.length,
                animationDuration = ($panelContainer.data('sequential') == 'yes') ? 600 : 300;


              if (numPanels > 1) {
                $panelNav.find('a[href="#next"]').removeClass('inactive');
              }

              // When clicking on any of the panel navigation items
              $panelNavItems.on('click', function (e) {

                // Don't follow the link
                e.preventDefault();

                // Local vars
                var $panelToSlideIn, $panelToSlideOut, enterAnimation, exitAnimation;

                // Don't do anything if we are currently animating
                if ($panelContainer.is('.animating')) return false;

                // Define the panel to slideOut
                $panelToSlideOut = $panels.filter('.current');

                // Define the the panel to slide in
                if ($(this).attr('href') == '#next') {
                  $panelToSlideIn = $panels.filter('.current').next('.panel');
                } else if ($(this).attr('href') == '#prev') {
                  $panelToSlideIn = $panels.filter('.current').prev('.panel');
                } else {
                  $panelToSlideIn = /* $panels.filter('#' + */ $($(this).attr('href')) /* .attr('id')) */;
                }

                // Don't do anything if there is no new panel
                if (!$panelToSlideIn.size()) return;

                // Don't do anything if the new panel equals the current panel
                if ($panelToSlideOut.attr('id') == $panelToSlideIn.attr('id')) return;

                // Define animations to use
                enterAnimation = $panelToSlideIn.data('enter') || $panelContainer.data('enter');
                exitAnimation = $panelToSlideOut.data('exit') || $panelContainer.data('exit');

                // Set the exit panel
                setExitPanel($panelToSlideOut, exitAnimation);

                // Set the enter panel
                setEnterPanel($panelContainer, $panels, $panelToSlideIn, enterAnimation);

                // Start the animation (immediately)
                // @note: using a setTimeout because "it solves everything", dixit @rem
                setTimeout(function () {
                  startAnimation($panelContainer);
                }, 0);

                // Update next/prev buttons
                updatePanelNav($panelNav, $panelContainer, $panelToSlideIn, numPanels);

                // Stop the animation after a while
                setTimeout(function () {
                  stopAnimation($panelContainer, $panels, $panelToSlideIn);
                }, animationDuration);

              });
            });
          });
        },

        accordianInit: function () {
          $('.accordion').find('.accordion-toggle').click(function () {
            $(this).next().slideToggle('600');
            $(".accordion-content").not($(this).next()).slideUp('600');
          });
          $('.accordion-toggle').on('click', function () {
            var isActive = true;
            if ($(this).hasClass('active')) {
              isActive = false;
            }
            $('.accordion-toggle').removeClass('active');
            if (isActive) {
              $(this).addClass('active')
            }
          });
        },

        rating: function () {
          /* 1. Visualizing things on Hover - See next part for action on click */
          $('#stars li').on('mouseover', function () {
            var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

            // Now highlight all the stars that's not after the current hovered star
            $(this).parent().children('li.star').each(function (e) {
              if (e < onStar) {
                $(this).addClass('hover');
              }
              else {
                $(this).removeClass('hover');
              }
            });

          }).on('mouseout', function () {
            $(this).parent().children('li.star').each(function (e) {
              $(this).removeClass('hover');
            });
          });

          /* 2. Action to perform on click */
          $('#stars li').on('click', function () {
            var onStar = parseInt($(this).data('value'), 10); // The star currently selected
            var stars = $(this).parent().children('li.star');
            for (i = 0; i < stars.length; i++) {
              $(stars[i]).removeClass('selected');
            }
            for (i = 0; i < onStar; i++) {
              $(stars[i]).addClass('selected');
            }
            // JUST RESPONSE (Not needed)
            var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
            var msg = "";
            if (ratingValue > 1) {
              msg = "Thanks! You rated this " + ratingValue + " stars.";
            }
            else {
              msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
            }
            MINOVATE.documentOnReady.responseMessage(msg);
          });
        },
        tabInit: function () {
          $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab1 a"), $("#tab-content1")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

          $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab2 a"), $("#tab-content2")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

          $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab3 a"), $("#tab-content3")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

          $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab4 a"), $("#tab-content4")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

          $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab5 a"), $("#tab-content5")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

          (function () { var b = "fadeInLeft"; var c; var a; d($(".my-tab a"), $(".my-tab-content")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });
        },
        responseMessage: function (msg) {
          $('.success-box').fadeIn(200);
          $('.success-box div.text-message').html("<span>" + msg + "</span>");
        },

        toggleDiv: function () {
          $(".slide-toggle").click(function () {
            $(".box").slideToggle();
          });
        },

        general: function () {

        }
      };


      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // initialize when document load
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      MINOVATE.documentOnLoad = {
        init: function () {
          $(window).load(function () {
            $('#select-all').change(function () {
              if ($(this).is(":checked")) {
                $('#mails-list .mail-select input').prop('checked', true);
              } else {
                $('#mails-list .mail-select input').prop('checked', false);
              }
            });
          });
        }
      };

      //!!!!!!!!!!!!!
      // initializing
      //!!!!!!!!!!!!!
      MINOVATE.documentOnReady.init();
      $window.load(MINOVATE.documentOnLoad.init);
      $window.on('resize', MINOVATE.documentOnResize.init());
    },
    accordianInit: function () {
      $('.accordion').find('.accordion-toggle').click(function () {
        $(this).next().slideToggle('600');
        $(".accordion-content").not($(this).next()).slideUp('600');
      });
      $('.accordion-toggle').on('click', function () {
        var isActive = true;
        if ($(this).hasClass('active')) {
          isActive = false;
        }
        $('.accordion-toggle').removeClass('active');
        if (isActive) {
          $(this).addClass('active')
        }
      });
    },
    ChosenInit: function () {

    },
    RatingInit: function () {
      /* 1. Visualizing things on Hover - See next part for action on click */
      $('#stars li').on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

        // Now highlight all the stars that's not after the current hovered star
        $(this).parent().children('li.star').each(function (e) {
          if (e < onStar) {
            $(this).addClass('hover');
          }
          else {
            $(this).removeClass('hover');
          }
        });

      }).on('mouseout', function () {
        $(this).parent().children('li.star').each(function (e) {
          $(this).removeClass('hover');
        });
      });

      /* 2. Action to perform on click */
      $('#stars li').on('click', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
        var stars = $(this).parent().children('li.star');
        for (i = 0; i < stars.length; i++) {
          $(stars[i]).removeClass('selected');
        }
        for (i = 0; i < onStar; i++) {
          $(stars[i]).addClass('selected');
        }
        // JUST RESPONSE (Not needed)
        var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
        var msg = "";
        if (ratingValue > 1) {
          msg = "Thanks! You rated this " + ratingValue + " stars.";
        }
        else {
          msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
        }
        MINOVATE.documentOnReady.responseMessage(msg);
      });
    },
    TabInit: function () {
      $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab1 a"), $("#tab-content1")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

      $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab2 a"), $("#tab-content2")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

      $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab3 a"), $("#tab-content3")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

      $(function () { var b = "fadeInLeft"; var c; var a; d($("#myTab35 a"), $("#tab-content5")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

      $(function () { var b = "fadeInLeft"; var c; var a; d($("#Contacttab a"), $("#tab-contentcontact")); function d(e, f, g) { e.click(function (i) { i.preventDefault(); $(this).tab("show"); var h = $(this).data("easein"); if (c) { c.removeClass(a); } if (h) { f.find("div.active").addClass("animated " + h); a = h; } else { if (g) { f.find("div.active").addClass("animated " + g); a = g; } else { f.find("div.active").addClass("animated " + b); a = b; } } c = f.find("div.active"); }); } $("a[rel=popover]").popover().click(function (f) { f.preventDefault(); if ($(this).data("easein") != undefined) { $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein")); } else { $(this).next().addClass("animated " + b); } }); });

      $(function () {
        var b = "fadeInLeft";
        var c;
        var a;
        d($(".my-tab a"), $(".my-tab-content"));

        function d(e, f, g) {
          e.click(function (i) {
            i.preventDefault();
            $(this).tab("show");
            var h = $(this).data("easein");
            if (c) {
              c.removeClass(a);
            }
            if (h) {
              f.find("div.active").addClass("animated " + h);
              a = h;
            } else {
              if (g) {
                f.find("div.active").addClass("animated " + g);
                a = g;
              } else {
                f.find("div.active").addClass("animated " + b);
                a = b;
              }
            }
            c = f.find("div.active");
          });
        }
        $("a[rel=popover]").popover().click(function (f) {
          f.preventDefault();
          if ($(this).data("easein") != undefined) {
            $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein"));
          } else {
            $(this).next().addClass("animated " + b);
          }
        });
      });
    },

    MytabInit: function () {
      $(function () {
        var b = "fadeInLeft";
        var c;
        var a;
        d($(".my-tab a"), $(".my-tab-content"));

        function d(e, f, g) {
          e.click(function (i) {
            i.preventDefault();
            $(this).tab("show");
            var h = $(this).data("easein");
            if (c) {
              c.removeClass(a);
            }
            if (h) {
              f.find("div.active").addClass("animated " + h);
              a = h;
            } else {
              if (g) {
                f.find("div.active").addClass("animated " + g);
                a = g;
              } else {
                f.find("div.active").addClass("animated " + b);
                a = b;
              }
            }
            c = f.find("div.active");
          });
        }
        $("a[rel=popover]").popover().click(function (f) {
          f.preventDefault();
          if ($(this).data("easein") != undefined) {
            $(this).next().removeClass($(this).data("easein")).addClass("animated " + $(this).data("easein"));
          } else {
            $(this).next().addClass("animated " + b);
          }
        });
      });
    },
    
    SlickInit: function () {
      $('.slick_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        cssEase: 'linear',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    },

    ExpandCollapseInit: function () {
      $("#expandtoggle").click(function () {
        if ($(this).hasClass('expanded')) {
          $("#calendar-expand1").stop().show().animate({ width: '74.2%' });
          $("#activities-sidebar").stop().animate({ width: '25.8%' });
          $(this).removeClass('expanded');
        }
        else {
          $("#calendar-expand1").stop().animate({ width: '50%' }, function () {
            $(this).addClass('expanded');
          });
          $("#activities-sidebar").stop().animate({ width: '49%' });
          $(this).addClass('expanded');
        }
      });
    },

    HamburgerExpandCollapseInit: function () {
      $("#expandtoggle").click(function () {
        if ($(this).hasClass('expanded')) {
          $("#mailbox-expand").stop().show().animate({ width: '94%' });
          $("#left-sidebar").stop().animate({ width: '6%' });
          $(this).removeClass('expanded');
        }
        else {
          $("#mailbox-expand").stop().animate({ width: '80%' }, function () {
            $(this).addClass('expanded');
          });
          $("#left-sidebar").stop().animate({ width: '20%' });
          $(this).addClass('expanded');
        }
      });
    },

    NetworkExpandCollapseInit: function () {
      $("#expandtoggle").click(function () {
        if ($(this).hasClass('expanded')) {
          $("#calendar-expand").stop().show().animate({ width: '75%' });
          $("#network-sidebar").stop().animate({ width: '25%' });
          $(this).removeClass('expanded');
        }
        else {
          $("#calendar-expand").stop().animate({ width: '85%' }, function () {
            $(this).addClass('expanded');
          });
          $("#network-sidebar").stop().animate({ width: '15%' });
          $(this).addClass('expanded');
        }
      });

      // $('#expandtoggle').click(function () {
      //   if ($('i').hasClass('fa-chevron-right collapse-icon')) {
      //     $('#expandtoggle').html('<i class="fa fa-chevron-left collapse-icon"></i>');
      //   }
      //   else {
      //     $('#expandtoggle').html('<i class="fa fa-chevron-right collapse-icon"></i> ');
      //   }
      // });
    },

    HelpExpandCollapseInit: function () {
      // $("#expandtoggle").click(function () {
      //   if ($(this).hasClass('expanded')) {
      //     $(".st-panel").stop().show().animate({ width: '1000px', height: '500px' });
      //   }
      //   else {
      //     $(".st-panel").stop().animate({ width: '300px', height: 'auto' }, function () {
      //       $(this).addClass('expanded');
      //     });
      //   }
      // });
      var $slider = document.getElementById('slider');
      var $toggle = document.getElementById('toggle');
      
      $toggle.addEventListener('click', function() {
          var isOpen = $slider.classList.contains('slide-in');
      
          $slider.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
      });
    },

    FloatingActionInit: function() {
      $.fn.launchBtn = function (options) {
        var mainBtn, panel, clicks, settings, launchPanelAnim, closePanelAnim, openPanel, boxClick;
        
        mainBtn =  $(".st-button-main");
        panel = $(".st-panel");
        clicks = 0;
        
        //default settings
        settings = $.extend({
          openDuration: 600,
          closeDuration: 200,
          rotate: true
        }, options);
            
            //Open panel animation
        launchPanelAnim = function () {
          panel.animate({
            opacity: "toggle",
            height: "toggle"
          }, settings.openDuration);
        };

        //Close panel animation
        closePanelAnim = function () {
          panel.animate({
            opacity: "hide",
            height: "hide"
          }, settings.closeDuration);
        };
        
        //Open panel and rotate icon
        openPanel = function (e) {
          if (clicks === 0) {
            if (settings.rotate) {
              $(this).removeClass('rotateBackward').toggleClass('rotateForward');
            }

            launchPanelAnim();
            clicks++;
          } else {
            if (settings.rotate) {
              $(this).removeClass('rotateForward').toggleClass('rotateBackward');
            }

            closePanelAnim();
            clicks--;
          }
          e.preventDefault();
          return false;
        };
        
        //Allow clicking in panel
        boxClick = function (e) {
          e.stopPropagation();
        };
        
        //Main button click		
        mainBtn.on('click', openPanel);
        
        //Prevent closing panel when clicking inside
        panel.click(boxClick);
        
        //Click away closes panel when clicked in document
        $(document).click(function () {
          closePanelAnim();
          if ( clicks === 1 ) {
            mainBtn.removeClass('rotateForward').toggleClass('rotateBackward');
          }
          clicks = 0;
        });
      };

      $('.st-actionContainer').launchBtn( { openDuration: 500, closeDuration: 300 } );
    },
    
    showhideInit: function () {
      $(document).ready(function () {
        $(".icondown").click(function () {
          $(".ddlhide").toggle();
        });
        $(".icondown1").click(function () {
          $(".ddlhide1").toggle();
        });
      });
    },

    contactaccordianInit: function () {
      $('.panel-collapse').on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('active');
      });

      $('.panel-collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('active');
      });
    },

    MessageChatInit: function () {
      $('.chat[data-chat=person2]').addClass('active-chat');
      $('.person[data-chat=person2]').addClass('active');

      $('.left .person').mousedown(function () {
        if ($(this).hasClass('.active')) {
          return false;
        } else {
          var findChat = $(this).attr('data-chat');
          var personName = $(this).find('.name').text();
          $('.right .top .name').html(personName);
          $('.chat').removeClass('active-chat');
          $('.left .person').removeClass('active');
          $(this).addClass('active');
          $('.chat[data-chat = ' + findChat + ']').addClass('active-chat');
        }
      });
    },

    MessageTextareaInit: function () {
      $('#contact-form').on( 'change keydown keyup paste cut', 'textarea', function () {  
        $(this).height(0).height(this.scrollHeight+10);
        if ($(this).height() >= 150) {
          document.getElementById("message").style.overflow = "auto";
       
        }
        else {
         document.getElementById("message").style.overflow = "hidden";
        }
      }).find( 'textarea' ).change();
      
      
    },

     // fixed top header 
    FixTopHeaderInit: function () {
    $(window).scroll(function(){
      if ($(window).scrollTop() >= 0) {
          $('.position-fix').addClass('fixed-header');
      }
      else {
          $('.position-fix').removeClass('fixed-header');
      }
    });
    },

    headerddltoggleInit: function () {
      var $clickme = $('.clickme'),
      $showhideddl = $('.showhideddl');

      $showhideddl.hide();

      $clickme.click( function(e) {
          // $(this).html(($(this).html() === '<div class="calendar-header-icon"></div>' ? '<div class="calendar-header-icon"></div>' : '<div class="calendar-header-icon"></div>')).next('.showhideddl').slideToggle();
          $(this).next('.showhideddl').slideToggle();
          e.preventDefault();
      });

      var $clickme1 = $('.clickme1'),
      $showhideddl1 = $('.showhideddl1');

      $showhideddl1.hide();

      $clickme1.click( function(e) {
          // $(this).html(($(this).html() === '<div class="omnichannel-icon"></div>' ? '<div class="omnichannel-icon"></div>' : '<div class="omnichannel-icon"></div>')).next('.showhideddl1').slideToggle();
          $(this).next('.showhideddl1').slideToggle();
          e.preventDefault();
      });

      var $clickme2 = $('.clickme2'),
      $showhideddl2 = $('.showhideddl2');

      $showhideddl2.hide();

      $clickme2.click( function(e) {
          // $(this).html(($(this).html() === '<div class="notification-icon"></div>' ? '<div class="notification-icon"></div>' : '<div class="notification-icon"></div>')).next('.showhideddl2').slideToggle();
          $(this).next('.showhideddl2').slideToggle();;
          e.preventDefault();
      });

    },

    RightSidebarInit: function () {
      var $toggleRightbarEl = $('.toggle-right-sidebar'),
        $body = $('body');

      $toggleRightbarEl.on('click', function () {
        if ($body.hasClass('rightbar-hidden')) {
          $body.removeClass('rightbar-hidden').addClass('rightbar-show');
          $("#rightbar").css('display', 'block');
        } else {
          $body.removeClass('rightbar-show').addClass('rightbar-hidden');
          $("#rightbar").css('display', 'none');
        }
      });

      if ($body.hasClass('rightbar-show')) {
        $body.removeClass('rightbar-show').addClass('rightbar-hidden');
        $("#rightbar").css('display', 'none');
      }
    },

    getUnixTime: function() { return new Date().getTime() }

  }
})(DocumentReady_1 || {})
