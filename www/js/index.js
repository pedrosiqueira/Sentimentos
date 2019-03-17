var myVue = {};

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", onBackKeyDown);
        carregarBanco();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    }
};

function onBackKeyDown() {
    console.log("implementar função back");
}

function abrir(pg, params) {
    if (!params)
        params = {};
    return new Promise((resolve, reject) => {
        $("#conteudo").load(pg + ".html", function () {
            initVue(params);
            resolve();
        });
    });
}

function initVue(d) {
    myVue = new Vue({
        el: '#conteudo',
        data: d
    });
    console.log("vue iniciado");
}
