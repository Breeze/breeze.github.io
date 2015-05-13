$(window).on('load', function() {
    // select the current li
    var pathName = location.pathname;
    var pathParts = pathName.split("/");
    var lastPart = pathParts[pathParts.length-1];
    $("li.active").removeClass("active");
    var $li = $('a[href="' + lastPart + '"]').parent();
    $li.addClass("active");
    
    // force any parents that are dropdowns to drop down.
    var $dropdowns = $li.parents('.dropdown-menu');
    $dropdowns.each(function(ix, dd) {
        $(dd).prev().dropdown('toggle');
    });
    
    // scroll the current li to the top if not visible.
    var $leftnav = $('#leftnav');
    var offset = $li.offset().top;
    if(offset > $leftnav.innerHeight()) {
       $leftnav.scrollTop(offset);
    }
    
});

