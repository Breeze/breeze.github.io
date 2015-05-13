$(window).on('load', function() {
    var pathName = location.pathname;
    var pathParts = pathName.split("/");
    var lastPart = pathParts[pathParts.length-1];
    $("li.active").removeClass("active");
    var li = $('a[href="' + lastPart + '"]').parent();
    li.addClass("active");
    
});

$("a:not('.dropdown-toggle')").click(function(event) {
    return false;
    // var url = event.target.pathname;
    // if (url == location.pathname) return false;

    // if ends with '/', don't add the hash, let browser handle normally
    // if (url.substr(url.length - 1) == '/') return true;

    // if (url && !url.indexOf("#") == 0) {
        // url = "#" + url;
    // }
    // if (url && url != location.hash) {
        // location.hash = url;
    // }
    // return false;
});