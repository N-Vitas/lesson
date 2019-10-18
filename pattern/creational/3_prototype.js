// Создание обьекта на основе скелета
const car = {
    wheels: 4,
    init() {
        console.log(`У меня ${this.wheels} колес, мой владелец ${this.owner}`);
    }
};

// Реализация патерна
const carWhisOwner = Object.create(car, {
    owner: {
        value: 'Дмитрий'
    }
});

console.log('Сравнение прототипа', carWhisOwner.__proto__ === car);

carWhisOwner.init();