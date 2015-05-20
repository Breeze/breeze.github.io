$(window).on('load', function() {
    $li = selectHrefLi();
    
    if (!$li.length) return;
    
    // force any parents that are dropdowns to drop down.
    var $dropdowns = $li.parents('.dropdown-menu');
    $dropdowns.each(function(ix, dd) {
        $(dd).prev().dropdown('toggle');
    });
    
    // scroll the current li to the top if not visible.
    var $leftnav = $('#leftnav');
    var offset = $li.offset().top;
    // 30 is approx height of top menu
    if(offset > ($leftnav.innerHeight() - $('#header').height())) {
       $leftnav.scrollTop(offset);
    }
    
});

$(window).on('hashchange', function() {
    selectHrefLi();
    
});

function goPrev() {
    var $li = getCurrentLi();
    var isChild = $li.parents('.dropdown').length;
    var $prevLi = $li.prev('li');
    if (!$prevLi.length) {
        // will occur when hitting prev on the first child    
        $prevLi = $li.parents('li').first();
    } else  if ((!isChild) && $prevLi.hasClass("dropdown")) {
        // will happen when hitting prev that moves to a dropdown parent
        // $prevLi is a parent with children - so go to last child
        $prevLi = $prevLi.find('li').last();
    }
       
    var href = $prevLi.find('a').attr("href");
    if (href.length) {
        window.location.href = href;
    }
}

function goNext() {
    var $li = getCurrentLi();
    var $nextLi;
    if ($li.hasClass("dropdown")) {
        $nextLi = $li.find('li');
    } else {
        $nextLi = $li.next('li');  
        if (!$nextLi.length) {
            // go up to parent li and then next li 
            $nextLi = $li.parents('li').first().next('li');
        }  
    }
    
    var href = $nextLi.find('a').attr("href");
    if (href.length) {
        window.location.href = href;
    }
}

function getCurrentLi() {
    var pathName = location.pathname;
    var hash = location.hash;
    
    var pathParts = pathName.split("/");
    var lastPart = pathParts[pathParts.length-1];
    var hrefVal =  (hash != "") ? lastPart+hash : lastPart;
    var $anchor =  $('a[href="' + hrefVal + '"]');
    // fallback to just the html page name if we can't find the page with hash ref.
    if (!$anchor.length) {
        $anchor =  $('a[href="' + lastPart + '"]');
    } 
    var $li = $anchor.closest('li');
    return $li;
}

function selectHrefLi() {
     // select the current li
    var pathName = location.pathname;
    var hash = location.hash;
    
    var pathParts = pathName.split("/");
    var lastPart = pathParts[pathParts.length-1];
    var hrefVal =  (hash != "") ? lastPart+hash : lastPart;
    var $anchor =  $('a[href="' + hrefVal + '"]');
    // fallback to just the html page name if we can't find the page with hash ref.
    if (!$anchor.length) {
        $anchor =  $('a[href="' + lastPart + '"]');
    } 
    var $li = $anchor.parent();
    $("li.active").removeClass("active");
    $li.addClass("active");
    
    // hack to accomodate header + padding (50 + 20)
    if (hash) {
        setTimeout(function() { window.scrollBy(0, -70) }); 
        // scrollBy(0, -70) ; 
    }
    
    var $menu = $('#menuname');
    var $selectedMenu = $('#selected-menu');
    if ($menu.length && $selectedMenu.length) {
        $selectedMenu.html($menu.text() + '      <span class="caret"></span>');
    }
    
    return $li;
}
