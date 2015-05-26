$(document).ready(function() {

    $("#searchform").submit(function(event) {

        var term = $("#searchterm").val();
        if (!term) return false;

        var newUrl = window.location.protocol + "//" + window.location.host + "/doc-main/search-results.html?q=" + term;

        // var url = "http://doc-main/search-results.html?q=" + term;
        window.location.href = newUrl;
        return false;

        function escapeHtml(string) {
            return String(string).replace(/[&<>"'\/]/g, function(s) {
                return entityMap[s];
            });
        }
    });

});