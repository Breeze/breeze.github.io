$(document).ready(function() {

    // for html escaping
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    $("#searchform").submit(function(event) {

        var term = $("#searchterm").val();
        if (!term) return false;

        var url = "https://api.github.com/search/code?q=" + term + "+repo:breeze/breeze.github.io";

        $.ajax(url, {
            headers: {          
                "Accept" : "application/vnd.github.v3.text-match+json"        
                //"Content-Type": "application/json; charset=utf-8"   
            },
            error: function(xhr, status, error) { console.log("Search error: " + status); },
            success: successFn
        });
        return false;

        function successFn(data, status, xhr) {
            // data contains search results - see https://developer.github.com/v3/search/#search-code
            var count = data.total_count;
            if (!count) {
                $("#docpage").html("<h2>No results found</h2>");
                return false;
            }

            var html = "<h2>Search Results<h2>";
            data.items.forEach(function(item) {
                html += '<h3><a href="' + item.path + '">' + item.path + '</a></h3>\n';
                item.text_matches.forEach(function(match) {
                    html += '<p>' + escapeHtml(match.fragment) + '</p>\n';
                });
            });

            $("#docpage").html(html);
            return false;
        }

        function escapeHtml(string) {
            return String(string).replace(/[&<>"'\/]/g, function(s) {
                return entityMap[s];
            });
        }
    });

});