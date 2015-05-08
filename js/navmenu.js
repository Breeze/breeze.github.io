
$(window).on('hashchange', function() {
    var url = location.hash.substring(1);
    $("li.active").removeClass("active");
    var li = $('a[href="' + url + '"]').parent();
    li.addClass("active");

    // load the page content
    $("#docpage").load(url);
});


$("a:not('.dropdown-toggle')").click(function(event) {
    var url = event.target.pathname;
    if (url == location.pathname) return false;

    // if ends with '/', don't add the hash, let browser handle normally
    if (url.substr(url.length - 1) == '/') return true;

    if (url && !url.indexOf("#") == 0) {
        url = "#" + url;
    }
    if (url && url != location.hash) {
        location.hash = url;
    }
    return false;
});