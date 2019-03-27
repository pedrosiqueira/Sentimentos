function carregar_sentimentos() {
    abrir('sentimentos').then(function () {
        carregar_sentimentos_lista();
    });
}

function carregar_sentimentos_lista() {
    carregar_conteudo('sentimentos_lista', 'sentimentos_conteudo', {sentimentos: [], paginacao: 0}).then(function () {
        carregar_mais_sentimentos();
    });
}

function carregar_sentimentos_calendario() {
    carregar_conteudo('sentimentos_calendario', 'sentimentos_conteudo').then(function () {
        initCalendar();
    });
}

function preencher_calendario_sentimentos(sentimentos) {
    for (var i = 0; i < sentimentos.length; i++) {
        var dia = parseInt(sentimentos[i].quando.substr(8, 2));
        $("#dia" + dia).css("background-color", getColor(sentimentos[i].humorometro));
        $("#dia" + dia).click({id: sentimentos[i].rowid}, function (e) {
            carregar_sentimento(e.data.id);
        });
    }
}
