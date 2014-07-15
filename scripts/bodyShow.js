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
    "addEvent": function (obj, evType, fn, useCapture) {        if (obj.addEventListener){            obj.addEventListener(evType, fn, useCapture);            return true;        } else if (obj.attachEvent){            var r = obj.attachEvent("on"+evType, fn);            return r;        } else {            alert("Handler could not be attached");        }    },
    
    /** Remove an event in a cross browser way. */
    "removeEvent": function (obj, evType, fn, useCapture){        if (obj.removeEventListener){            obj.removeEventListener(evType, fn, useCapture);            return true;        } else if (obj.detachEvent){            var r = obj.detachEvent("on"+evType, fn);            return r;        } else {            alert("Handler could not be removed");        }    }
}

BodyShow.addEvent(window, 'load', BodyShow.show);
