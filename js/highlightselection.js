$(window).on('load', function() {
    var pathName = location.pathname;
    var pathParts = pathName.split("/");
    var lastPart = pathParts[pathParts.length-1];
    $("li.active").removeClass("active");
    var li = $('a[href="' + lastPart + '"]').parent();
    li.addClass("active");

    var dropdowns = li.parents('.dropdown-menu');
    dropdowns.each(function(dd) {
        dd.prev().dropdown('toggle');
    });
    
    $('#leftnav').animate({
       scrollTop: li.offset().top
    });
    
});

