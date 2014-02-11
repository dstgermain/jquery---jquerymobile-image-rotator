$.fn.imageRotator = (function () {
  //settings
  var that = this;
  var timer = parseFloat(that.attr("data-timer"));
  var navigation = that.data("data-navigation");
  var $navigation = that.find("[data-nav]");
  var simpleNav = that.data("data-simple-navigation");
  var $simpleBtns = that.find("[data-slide-direction]");
  var $sideContainer = that.find(".rotator-inner");
  var $lastSlide = that.find(".item:last-of-type");
  var lastSlideNum = parseFloat($lastSlide.attr("data-img-num"));
  var $firstSlide = that.find(".item:first-of-type");
  var firstSlideNum = parseFloat($firstSlide.attr("data-img-num"));
  var $activeinit = that.find(".active");
  var pos;

  if (navigation && $navigation.length == 0) {
    navigation = false;
  }

  if (simpleNav && $simpleBtns.length == 0) {
    navigation = false;
  }

  if (timer == undefined) {
    timer = 8000; 
  }

  if ($activeinit.length > 0) {
    pos = parseFloat($activeinit.attr("data-img-num"));
    $activeinit.show();
  } else {
    pos = parseFloat($firstSlide.attr("data-img-num"));
    $firstSlide.show().addClass("active");
  }

  //rotator
  function rotate(dir, position) {
    disableButtons();
    disableDotButtons();
    unbindSwipeEvent();
    var currentnum = "div[data-img-num='" + pos + "']";
    var $current = that.find(currentnum);
    var nextnum, $next;
    if (position == "false") {
      if (dir == "left") {
        pos++;
        if (pos > lastSlideNum) {
          pos = firstSlideNum;
        }
      } else {
        pos--;
        if (pos < firstSlideNum) {
          pos = lastSlideNum;
        }
      }
      nextnum = "div[data-img-num='" + pos + "']";
      $next = that.find(nextnum);
    } else {
      $next = that.find(position);
      pos = that.find(position).attr("data-img-num");
    }

    var slideHide, slideShow;

    if (dir == "right") {
      slideHide = "right";
      slideShow = "left";
    } else {
      slideHide = "left";
      slideShow = "right";
    }

    $current
      .removeClass("active")
      .hide("slide", { direction: slideHide, ease: "easeInOutCubic" }, 1000);
    $next
      .addClass("active")
      .show("slide", { direction: slideShow, ease: "easeInOutCubic" }, 1000, function () {
        enableButtons();
        enableDotButtons();
        swipeEvent();
      });
    if (navigation) {
      var currentimage = $next.attr("data-img-num");
      var dotnavcurrent = "li[data-img-num='" + currentimage + "']";
      $navigation
        .find(".current")
        .removeClass("current");
      $navigation
        .find(dotnavcurrent)
        .addClass("current");
    }
  }

  var autoRotator;

  function autoRotate(run) {
    if (run) {
      autoRotator = setInterval(function() { rotate("left", "false"); }, timer);
    } else {
      clearInterval(autoRotator);
    }
  }
  autoRotate(true);

  //hover stop
  $sideContainer.hover(
    function () {
      autoRotate(false);
    }, function () {
      autoRotate(true);
    });

  //navigation
  function enableButtons() {
    if (simpleNav) {
      $simpleBtns.bind("click", function () {
        var direction = $(this).attr("data-slide-direction");
        autoRotate(false);
        rotate(direction, "false");
        return false;
      });
    }
  }
  enableButtons();

  function enableDotButtons() {
    if (navigation) {
      that.find("[data-slide-to-img]").bind("click", function () {
        autoRotate(false);
        var direction = "left";
        var clicked = parseFloat($(this).attr("data-img-num"));
        var current = parseFloat(that.find("li.current").attr("data-img-num"));
        var clickeditem = "div[data-img-num='" + clicked + "']";
        if (clicked < current) {
          direction = "right";
        }
        if (clicked != current) {
          rotate(direction, clickeditem);
        }
      });
    }
  }
  enableDotButtons();

  function disableDotButtons() {
    if (navigation) {
      that.find("[data-slide-to-img]").unbind("click");
    }
  }
  function disableButtons() {
    if (simpleNav) {
      that.find("[data-slide-direction]").unbind("click");
    }
  }
  function swipeEvent() {
    that.find(".rotator-inner div").bind("swipeleft", function () { autoRotate(false); rotate("left", "false"); });
    that.find(".rotator-inner div").bind("swiperight", function () { autoRotate(false);  rotate("right", "false"); });
  }
  function unbindSwipeEvent() {
    that.find(".rotator-inner div").unbind("swipeleft");
    that.find(".rotator-inner div").unbind("swiperight");
  }
  swipeEvent();
});