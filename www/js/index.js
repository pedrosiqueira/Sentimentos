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
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
        carregar_pagina('home');
    }
};

function carregar_pagina(pg) {
    //document.getElementById("content").innerHTML='<object type="type/html" data="home.html" ></object>';
    //window.location = "home.html";
    $("#conteudo").load(pg + ".html", function () {
        console.log('pagina carregada: ' + pg);
    });
}