var myVue = {};

var percentColors = [
    {pct: 0.0, color: {r: 0xff, g: 0x00, b: 0}},
    {pct: 0.5, color: {r: 0xff, g: 0xff, b: 0}},
    {pct: 1.0, color: {r: 0x00, g: 0xff, b: 0}}
];

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
    return new Promise(function (resolve, reject) {
        $("#conteudo").load(pg + ".html", function () {
            initVue(params);
            if (typeof window["init_" + pg] === "function") {//se existir uma funcao pra inicializar a pagina, execute-a
                window["init_" + pg]();
            }
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

function novo_registro() {
    abrir('novo_registro', {pontuacao: $('#myRange').val(), quando: formatDate()});
}

function formatDate(date) {
    var d = (date ? new Date(date) : new Date()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

function randomDate(date1, date2) {
    return new Date(getRandomIntInclusive(Date.parse(date1), Date.parse(date2)));
}

function getRandomIntInclusive(min, max) {
    if (min > max) {
        var aux = min;
        min = max;
        max = aux;
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMes(date) {
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return meses[date.substr(5, 2) - 1];
}

function dateToString(date) {
    return date.substr(8, 2) + " de " + getMes(date);
}

function getColorForPercentage(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}

function descartar_alteracao() {
    myVue.sentimento.sentimento = myVue.original.sentimento;
    myVue.sentimento.acontecido = myVue.original.acontecido;
    myVue.sentimento.pensamento = myVue.original.pensamento;
    myVue.sentimento.atitude = myVue.original.atitude;
    myVue.sentimento.quando = myVue.original.quando;
    myVue.sentimento.pontuacao = myVue.original.pontuacao;
    myVue.editando = false;
}
