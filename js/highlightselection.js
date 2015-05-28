(function() {

    // member vars for this IIFE
    var _$leftnav;
    var _$currentLi;

    $(window).on('load', function () {

        $("#goPrev").click(goPrev);
        $("#goNext").click(goNext);
        _$leftnav = $("#leftnav");
        _$currentLi = _$leftnav.find("li.active").first();
        scrollLeftNavTo(_$currentLi);
    });

    $('.dropdown.keep-open').on({
        "shown.bs.dropdown": function () {
            this.closable = false;
        },
        "click": function (e) {
            if (($(e.target).is('button')) && ($.contains(this, e.target))) {
                // only allow collapse if hitting the parent button
                this.closable = true;
            } else {
                this.closable = false;
            }
        },
        "hide.bs.dropdown": function () {
            return !!this.closable;
        }
    });

    function scrollLeftNavTo($li) {
        if (!$li.length) return;
        //// scroll the current li to the top if not visible.
        var offset = $li.offset().top;
        if (offset > _$leftnav.innerHeight()) {
            _$leftnav.scrollTop(offset);
        }
    }

    function goPrev() {
        var href;
        var $li = getCurrentLi();
        var isChild = $li.parents('.dropdown').length;
        var $prevLi = $li.prev('li');
        if (!$prevLi.length) {
            // will occur when hitting prev on the first child
            $prevLi = $li.parents('li').first();
        } else if ((!isChild) && $prevLi.hasClass("dropdown")) {
            // will happen when hitting prev that moves to a dropdown parent
            // $prevLi is a parent with children - so go to last child
            $prevLi = $prevLi.find('li').last();
        }

        if (!$prevLi.length) {
            // at beginning ( no prev li) so goto top
            href = $('#menu-header').attr('href');
        } else {
            href = $prevLi.find('a').attr("href");
        }

        if (href && href.length) {
            window.location.href = href;
        }
    }

    function goNext() {
        var href, $nextLi;
        var $li = getCurrentLi();
        if (!$li.length) {
            // at top ( no li avail)
            $nextLi = $('#menu-top').find('li').first();
        } else if ($li.hasClass("dropdown")) {
            $nextLi = $li.find('li');
        } else {
            $nextLi = $li.next('li');
            if (!$nextLi.length) {
                // go up to parent li and then next li
                $nextLi = $li.parents('li').first().next('li');
            }
        }

        if (!$nextLi.length) {
            return;
        }

        href = $nextLi.find('a').attr("href");
        if (href && href.length) {
            window.location.href = href;
        }
    }

    function getCurrentLi() {
        return _$currentLi;
    }


    //$(window).on('hashchange', function () {
    //    // selectHrefLi();
    //
    //});

    // No longer needed.
    //function selectHrefLi() {
    //    var $li = getCurrentLi();
    //    $("li.active").removeClass("active");
    //    $li.addClass("active");
    //
    //    // hack to accomodate header + padding (50 + 20)
    //    if (location.hash) {
    //        setTimeout(function() { window.scrollBy(0, -70) });
    //        // scrollBy(0, -70) ;
    //    }
    //
    //    return $li;
    //}

    //function getCurrentLi() {
    //    var pathName = location.pathname;
    //    var hash = location.hash;
    //
    //    var pathParts = pathName.split("/");
    //    var lastPart = pathParts[pathParts.length-1];
    //    var hrefVal =  (hash != "") ? lastPart+hash : lastPart;
    //    var $anchor =  $('a[href="' + hrefVal + '"]');
    //    // fallback to just the html page name if we can't find the page with hash ref.
    //    if (!$anchor.length) {
    //        $anchor =  $('a[href="' + lastPart + '"]');
    //    }
    //    var $li = $anchor.closest('li');
    //    return $li;
    //}

})();