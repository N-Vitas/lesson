// Выстраивает комуникацию обьектов
class User {
    constructor(name) {
        this.name = name;
        this.room = null;
    }
    send(message, to) {
        this.room.send(message, this, to);
    }
    receive(message, from) {
        console.log(`${from.name} => ${this.name} ${message}`);
    }
}

class Room {
    constructor() {
        this.users = {};
    }
    register(user) {
        this.users[user.name] = user;
        user.room = this;
    }
    send(message, from, to) {
        if(to) {
            to.receive(message, from);
        } else {
            Object.keys(this.users).forEach(key => {
                if(this.users[key] !== from) {
                    this.users[key].receive(message, from);
                }
            })
        }
    }
}
// Реализация патерна
const vasya = new User('Вася');
const lisa = new User('Лиза');
const petya = new User('Петя');
const room = new Room();
room.register(vasya);
room.register(lisa);
room.register(petya);

vasya.send('Привет Лиза', lisa);
lisa.send('Привет Лиза', vasya);
petya.send('Привет');
vasya.send('Привет', petya);
lisa.send('Привет', petya);
