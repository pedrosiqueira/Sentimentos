var db;
function carregarBanco() {
    db = (window.cordova.platformId === 'browser') ? //o app esta rodando no browser?
            window.openDatabase('Sentimentos', '1.0', 'Sentimentos', 2 * 1024 * 1024) : //se sim, abre o banco de dados do browser
            window.sqlitePlugin.openDatabase({name: 'Sentimentos.db', location: 'default'});//senao, abre o banco de dados do android

    //qualquer comando SQL tem que estar dentro de uma transação
    db.transaction(function (tx) {//abrindo uma transação tx
        tx.executeSql("CREATE TABLE IF NOT EXISTS Sentimento ( sentimento TEXT, acontecido TEXT, pensamento TEXT, atitude TEXT, pontuacao INTEGER, quando TEXT);");
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log("banco carregado!");
        abrir("home");
    });
}

function salvar_registro() {
    let sentimento = [$('#sentimento').val(), $('#acontecido').val(), $('#pensamento').val(), $('#atitude').val(), $('#pontuacao').val(), $('#quando').val()];
    db.transaction(function (transaction) {
        transaction.executeSql('INSERT INTO Sentimento (sentimento, acontecido, pensamento, atitude, pontuacao, quando) VALUES (?,?,?,?,?,?)', sentimento);
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('inserido ' + sentimento + ' no banco!');
        abrir('home');
    });
}
