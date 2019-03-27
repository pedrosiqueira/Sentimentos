var db;
function carregarBanco() {
    if (window.cordova.platformId === 'browser') { //o app esta rodando no browser?
        db = window.openDatabase('Sentimentos', '1.0', 'Sentimentos', 2 * 1024 * 1024); //se sim, abre o banco de dados do browser
        console.log('abrindo banco pelo browser');
    } else {
        db = window.sqlitePlugin.openDatabase({name: 'Sentimentos.db', location: 'default'});//senao, abre o banco de dados do android
        console.log('abrindo banco pelo celular');
    }
    //qualquer comando SQL tem que estar dentro de uma transação
    db.transaction(function (tx) {//abrindo uma transação tx
        tx.executeSql("CREATE TABLE IF NOT EXISTS Sentimento ( sentimento TEXT, acontecido TEXT, pensamento TEXT, atitude TEXT, humorometro INTEGER, quando TEXT);");
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log("banco carregado!");
        popularTabelas();
        abrir("home");
    });


}

function popularTabelas() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT count(*) AS qtd FROM Sentimento', [], function (tx, rs) {
            if (rs.rows.item(0).qtd === 0) {
                for (var i = 0; i < 10; i++) {
                    tx.executeSql('INSERT INTO Sentimento (sentimento, acontecido, pensamento, atitude, humorometro, quando) VALUES (?,?,?,?,?,?)', ['sentimento ' + i, 'acontecido ' + i, 'pensamento ' + i, 'atitude ' + i, getRandomIntInclusive(-100, 100), randomDate('2018-10-01', '2019-03-31').toISOString().substr(0, 10)]);
                }
                console.log('tabelas populadas!');
            }
        });
    });
}

function salvar_sentimento() {
    var sentimento = [$('#sentimento').val(), $('#acontecido').val(), $('#pensamento').val(), $('#atitude').val(), $('#humorometro').val(), $('#quando').val()];
    db.transaction(function (transaction) {
        transaction.executeSql('INSERT INTO Sentimento (sentimento, acontecido, pensamento, atitude, humorometro, quando) VALUES (?,?,?,?,?,?)', sentimento);
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('inserido ' + sentimento + ' no banco!');
        carregar_sentimentos();
    });
}

function carregar_mais_sentimentos() {
    db.transaction(function (tx) {
        var limite = 5;
        var offset = myVue.paginacao ? myVue.paginacao : 0;

        tx.executeSql("SELECT acontecido, humorometro, quando, rowid FROM Sentimento ORDER BY quando DESC LIMIT ? OFFSET ?;", [limite, offset], function (tx, resultSet) {
            if (resultSet.rows.length <= 0)
                return;
            for (var i = 0; i < resultSet.rows.length; i++) {
                myVue.sentimentos.push(resultSet.rows.item(i));
            }
            myVue.paginacao += limite;
        });
    });
}

function carregar_sentimento(id) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT rowid, * FROM Sentimento WHERE rowid = ?;", [id], function (tx, resultSet) {
            if (resultSet.rows.length) {
                var s = resultSet.rows.item(0);
                var o = {sentimento: s.sentimento, acontecido: s.acontecido, pensamento: s.pensamento, atitude: s.atitude, humorometro: s.humorometro, quando: s.quando};//criada uma copia do sentimento
                abrir('sentimento', {sentimento: s, editando: false, original: o});
            }
        });
    });
}

function salvar_alteracao() {
    db.transaction(function (tx) {
        tx.executeSql("UPDATE Sentimento SET sentimento = ? , acontecido = ? , pensamento = ? , atitude = ? , humorometro = ? , quando = ? WHERE rowid = ?;", [myVue.sentimento.sentimento, myVue.sentimento.acontecido, myVue.sentimento.pensamento, myVue.sentimento.atitude, myVue.sentimento.humorometro, myVue.sentimento.quando, myVue.sentimento.rowid], function (tx, res) {
            carregar_sentimentos();
        });
    });
}

function apagar_sentimento() {
    //a funcao modal('hide') é asincrono e serve para fechar o modal
    //a funcao on('hidden.bs.modal', callback) chama a funcao callback quando o modal terminar de fechar
    $('#modalApagar').modal('hide').on('hidden.bs.modal', function (e) {
        //toda vez que apagamos um sentimento, registramos um evento. portanto desregistramos o evento logo apos ele ocorrer, para nao ser disparado multiplas vezes
        $(this).off('hidden.bs.modal');//gambiarra hidden.bs.modal firing multiple times
        db.transaction(function (tx) {
            tx.executeSql("DELETE FROM Sentimento WHERE rowid = ?;", [myVue.sentimento.rowid], function (tx, res) {
                carregar_sentimentos();
            });
        });
    });
}

function carregar_sentimentos_mes(date) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT rowid, quando, humorometro FROM Sentimento WHERE quando >= ? AND quando <= ?;", [date + "-01", date + "-31"], function (tx, resultSet) {
            var sentimentos = [];
            for (var i = 0; i < resultSet.rows.length; i++) {
                sentimentos.push(resultSet.rows.item(i));
            }
            preencher_calendario_sentimentos(sentimentos);
        });
    });
}