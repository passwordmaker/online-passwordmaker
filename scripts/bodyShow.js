// This is just a way to not show the page until it has fully loaded.
var BodyShow = {
    "show": function () {
        var bodies = document.getElementsByTagName("body");
        for (var i=0; i < bodies.length; i++) {
            var body = bodies[i];
            body.style.display = "";
        }
    },

    // From: http://www.scottandrew.com/weblog/articles/cbs-events    
    /** Add an event in a cross browser way. */
    "addEvent": function (obj, evType, fn, useCapture) {
    
    /** Remove an event in a cross browser way. */
    "removeEvent": function (obj, evType, fn, useCapture){
}

BodyShow.addEvent(window, 'load', BodyShow.show);