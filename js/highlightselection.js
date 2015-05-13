$(window).on('load', function() {
    var pathName = location.pathname;
    var pathParts = pathName.split("/");
    var lastPart = pathParts[pathParts.length-1];
    $("li.active").removeClass("active");
    var li = $('a[href="' + lastPart + '"]').parent();
    li.addClass("active");
    // $(".dropdown-toggle").dropdown('toggle');
    
    // var dropdowns = li.parents('ul[class="' + "dropdown-menu" + '"]');
    var dropdowns = li.parents('.dropdown-menu');
    if (dropdowns.length > 0) {
        dropdowns.first().prev().dropdown('toggle');
    }
    
    $('html, body').animate({
       scrollTop: li.offset().top
    });
    
});

