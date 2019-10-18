// Старый вариант создания обьекта
function OldServer(name, ip) {
    this.name = name;
    this.ip = ip;
}
// Его расширение получения ссылки
OldServer.prototype.getUrl = function() {
    return `http://${this.name}:${this.ip}`;
}
// Новый вариант создания обьекта
class Server {
    constructor(name, ip) {
        this.name = name;
        this.ip = ip;
    }
    getUrl() {
        return `http://${this.name}:${this.ip}`;
    }
}
// Реализация патерна
const aws1 = new OldServer('localhost', 8080);
const aws2 = new Server('127.0.0.1', 8080);
console.log('OldServer',aws1.getUrl());
console.log('Server',aws2.getUrl());