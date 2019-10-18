class Database {
    constructor(data) {
        if(Database.exists) {
            return Database.instance;
        }
        Database.instance = this;
        Database.exists = true;
        this.data = data;
    }
    getData() {
        return this.data;
    }
}

// Реализация патерна
const mongo = new Database('mongo'); // Создается обьект
const mysql = new Database('mysql'); // Возвращается обьект
console.log('Mongo =', mongo.getData());
console.log('MySql =', mysql.getData());