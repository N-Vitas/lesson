// Позволяет оборацивая класс изменять поведение класса
class Server {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    get url() {
        return `http://${this.host}:${this.port}`
    }
}
// Декоратор AWS
const aws = function(server) {
    server.isAWS = true;
    server.awsInfo = function(){
        return server.url;
    }
    return server;
}
// Декоратор Azur
const azur = function(server) {
    server.isAzur = true;
    server.port += 1000;
    server.azurInfo = function(){
        return server.url;
    }
    return server;
}
// Реализация патерна
const awsServer = aws(new Server('localhost', 3000));
const azurServer = azur(new Server('localhost', 3000));

console.log('awsServer', awsServer.isAWS)
console.log('awsInfo', awsServer.url)
console.log('azurServer', azurServer.isAzur)
console.log('azurInfo', azurServer.url)