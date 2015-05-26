(function() {
  var _techList = [];
  $(window).on('load', function() {

    $("#btn-server-all").click(function() {
      setClearCheckboxes("S", true);
    });
    $("#btn-server-none").click(function() {
      setClearCheckboxes("S", false);
    });
    $("#btn-client-all").click(function() {
      setClearCheckboxes("C", true);
    });
    $("#btn-client-none").click(function() {
      setClearCheckboxes("C", false);
    });
    
    $("#client-group input").change(function() {
        var isChecked = $(this).is(":checked");
        var tech = this.id;
        updateVisibility(tech, isChecked, "C");

    });
    $("#server-group input").change(function() {
        var isChecked = $(this).is(":checked");
        var tech = this.id;
        updateVisibility(tech, isChecked, "S");

    });
    
    setClearCheckboxes("S", true);
    setClearCheckboxes("C", true);
    
    var $techItems = $("#techlist ul li");
    
    $techItems.each(function(ix, li) {
      var $li = $(li);
      var techs = $li.attr("tech").split(",");
      _techList.push( { li: $li, techs: techs, serverTechs: [], clientTechs: [] });
    });

    $("#client-group input").each(function(ix, input) {
      var tech = input.id;
      updateVisibility(tech, true, "C");
    });
    
    $("#server-group input").each(function(ix, input) {
      var tech = input.id;
      updateVisibility(tech, true, "S");
    });
    
    
  });
  
  function updateVisibility(tech, enabled, serverOrClient) {
    var visibleList = [];
    _techList.forEach(function(item) {
      var found = item.techs.indexOf(tech) >= 0;
      if (found) {
        var list = serverOrClient == "S" ? item.serverTechs : item.clientTechs;
        if (enabled) {
          addTo(list, tech);
        } else {
          removeFrom(list, tech);
        }
        showHide(item);
      }
      
    });
    
  }
  
  function showHide(item) {
    var show = item.serverTechs.length && item.clientTechs.length;
    item.li.css("display", show ? "inline" : "none");
  }
  
  function addTo(items, item) {
    if (items.indexOf(item) >= 0) return;
    items.push(item);
  }
  
  function removeFrom(items, item) {
    var ix = items.indexOf(item);
    if (ix == -1) return;
    items.splice(ix, 1);
  }

  function setClearCheckboxes(serverOrClient, set) {
    var groupName = serverOrClient == "S" ? "server-group" : "client-group";
    $checkBoxes = $("#" + groupName + " input");
    $checkBoxes.each(function(ix, cb) {
      $(cb).prop("checked", set);
      updateVisibility(cb.id, set, serverOrClient);
    });
  }
})();