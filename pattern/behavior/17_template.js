class Emplovee {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
    responcebilities() {}
    work() {
        return `${this.name} выполняет ${this.responcebilities()}`;
    }
    getPaid() {
        return `${this.name} получает ЗП ${this.salary}`;
    }
}

class Developer extends Emplovee {
    constructor(name, salary) {
        super(name, salary);
    }
    responcebilities() {
        return 'процесс разработки приложений';
    }
}
class Tester extends Emplovee {
    constructor(name, salary) {
        super(name, salary);
    }
    responcebilities() {
        return 'процесс тестирования приложений';
    }
}
// Реализация патерна
const dev = new Developer('Виталий', 100000);
const test = new Tester('Ирина', 90000);
console.log(dev.work());
console.log(test.work());
console.log(dev.getPaid());
console.log(test.getPaid());
