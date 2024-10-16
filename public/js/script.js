$(document).ready(function () {
  // new WOW().init();
  alert("pl");
  var HeadH = $("#header").outerHeight();
  // $('body').css('padding-top', HeadH);

  var scrollWindow = function () {
    $(window).on("load scroll", function () {
      var navbar = $("#header");

      // if ($(this).scrollTop() > HeadH) {
      if ($(this).scrollTop() > 50) {
        if (!navbar.hasClass("is-sticky")) {
          navbar.addClass("is-sticky");
          // $('body').css('padding-top', HeadH);
        }
      }
      // if ($(this).scrollTop() < HeadH) {
      if ($(this).scrollTop() < 50) {
        if (navbar.hasClass("is-sticky")) {
          navbar.removeClass("is-sticky");
          $("body").css("padding-top", 0);
        }
      }
      // if ($(this).scrollTop() > HeadH*2) {
      if ($(this).scrollTop() > 40 * 2) {
        if (!navbar.hasClass("awake")) {
          navbar.addClass("awake");
        }
      }
      // if ($(this).scrollTop() < HeadH*2) {
      if ($(this).scrollTop() < 40 * 2) {
        if (navbar.hasClass("awake")) {
          navbar.removeClass("awake");
        }
      }
      // if ($(this).scrollTop() >= 400) {
      //     $('.back_top').addClass('active');
      // }
      // else {
      //     $('.back_top').removeClass('active');
      // }
    });
  };
  scrollWindow();

  var btn = $("#top-button");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });

  btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
  });

  // $('.back_top').click(function(){
  //     $('html, body').animate({scrollTop:0}, 500);
  // });

  // $('.back_top').click(function () {
  //     $('html, body').animate({ scrollTop: 0 }, 500);
  // });

  // $(window).scroll(function () {
  //     if ($(this).scrollTop() > 100) {
  //         $('.back_top').fadeIn();
  //     } else {
  //         $('.back_top').fadeOut();
  //     }
  // });

  $(".navbar-toggler").click(function () {
    $(this).toggleClass("menu-opened");
    $("#header .collapse:not(.show)").toggleClass("menu-show");
    $("body").toggleClass("scroll-off");
    $(".overlay").fadeToggle();
  });

  $(".overlay").click(function () {
    $(this).fadeToggle();
    $("#header .collapse:not(.show)").toggleClass("menu-show");
    $("body").toggleClass("scroll-off");
    $(".navbar-toggler").toggleClass("menu-opened");
  });

  // $(window).on("resize", function (e) {
  //   checkScreenSize();
  // });
  var logo = $(".navbar-brand img").attr("src");

  // checkScreenSize();
  // function checkScreenSize() {
  //   var newWindowWidth = $(window).width();
  //   if (newWindowWidth <= 991) {
  //     $("#header .collapse:not(.show)").find(".mobile_logo").remove();
  //     $("#header .collapse:not(.show)").append(
  //       "<div class='mobile_logo'>" +
  //         "<img src='/img/logo.svg' alt=''>" +
  //         "</div>"
  //     );
  //   }
  // }

  //Dashboard Menu
  $(function () {
    var $nav = $("nav.greedy");
    var $btn = $("nav.greedy button");
    var $vlinks = $("nav.greedy .links");
    var $hlinks = $("nav.greedy .hidden-links");

    var numOfItems = 0;
    var totalSpace = 0;
    var breakWidths = [];

    // Get initial state
    $vlinks.children().outerWidth(function (i, w) {
      totalSpace += w;
      numOfItems += 1;
      breakWidths.push(totalSpace);
    });

    var availableSpace, numOfVisibleItems, requiredSpace;

    function check() {
      // Get instant state
      availableSpace = $vlinks.width() - 10;
      numOfVisibleItems = $vlinks.children().length;
      requiredSpace = breakWidths[numOfVisibleItems - 1];

      // There is not enought space
      if (requiredSpace > availableSpace) {
        $vlinks.children().last().prependTo($hlinks);
        numOfVisibleItems -= 1;
        check();
        // There is more than enough space
      } else if (availableSpace > breakWidths[numOfVisibleItems]) {
        $hlinks.children().first().appendTo($vlinks);
        numOfVisibleItems += 1;
      }
      // Update the button accordingly
      $btn.attr("count", numOfItems - numOfVisibleItems);
      if (numOfVisibleItems === numOfItems) {
        $btn.addClass("hidden");
      } else $btn.removeClass("hidden");
    }

    // Window listeners
    $(window).resize(function () {
      check();
    });

    $btn.on("click", function () {
      $hlinks.toggleClass("hidden");
    });

    check();
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css(
          "background-image",
          "url(" + e.target.result + ")"
        );
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  //   $("#imageUpload").change(function () {
  //       readURL(this);
  //   });

  $("#foldBtn , .dashBoard_overLay").click(function () {
    $(".app").toggleClass("is-folded");
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css(
          "background-image",
          "url(" + e.target.result + ")"
        );
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  //   $("#imageUpload").change(function () {
  //       readURL(this);
  //   });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview2").css(
          "background-image",
          "url(" + e.target.result + ")"
        );
        $("#imagePreview2").hide();
        $("#imagePreview2").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  //   $("#imageUpload2").change(function () {
  //       readURL(this);
  //   });

  // $('.box-loader').fadeOut('slow');

  // var Wheight = $(window).height();
  // var Hheight = $('#header').outerHeight();
  // var Fheight = $('.footer_wrapper').outerHeight();

  // var Innheight = Wheight - (Fheight + Hheight);

  // $('.cms_section').css('min-height', Innheight);

  window.oncontextmenu = function (event) {
    let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ("orientation" in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
    if (hasTouchScreen) {
      alert("in");
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  };
});


// document.querySelectorAll('.score_title').forEach(function(element) {
//   element.addEventListener('click', function() {
//     document.querySelectorAll('.score_show_row').forEach(function(row) {
//       row.classList.toggle('show_score');
//     });
//   });
// });

// function readURL(input) {
//   if (input.files && input.files[0]) {
//       var reader = new FileReader();
//       reader.onload = function (e) {
//           $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
//           $('#imagePreview').hide();
//           $('#imagePreview').fadeIn(650);
//       }
//       reader.readAsDataURL(input.files[0]);
//   }
// }
// $("#imageUpload").change(function () {
//   readURL(this);
// });
