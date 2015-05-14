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
    
    return $li;
}
