// Пример подписки пользователей на журналы
// Простая подписка
class SimpleMemberShip {
    constructor(name) {
        this.name = name;
        this.cost = 25;
    }
}
// Стандартная подписка
class StandardMemberShip {
    constructor(name) {
        this.name = name;
        this.cost = 100;
    }
}
// Премиум подписка
class PremiumMemberShip {
    constructor(name) {
        this.name = name;
        this.cost = 150;
    }
}

// Класс поиска подписки
class MemberFactory {
    static get list() {
        return {
            simple: SimpleMemberShip,
            standard: StandardMemberShip,
            premium: PremiumMemberShip
        };
    }

    create(name, type = 'simple') {
        const Membership = MemberFactory.list[type] || MemberFactory.list.simple;
        const member = new Membership(name);
        member.type = type;
        member.define = function(){
            console.log(`${this.name} (${this.type}): ${this.cost}`)
        }
        return member;
    }
}

// Реализация патерна
const factory = new MemberFactory();
// Массив подписок
const members = [
    factory.create('Василий', 'simple'),
    factory.create('Николай', 'premium'),
    factory.create('Елена', 'standard'),
    factory.create('Генадий'),
];
// Выводим в консоль
members.forEach(function(m) { m.define() });