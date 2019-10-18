// Патерн для передачи данных различными типами обьектов.
class Car {
    constructor(model, price) {
        this.model = model;
        this.price = price;
    }
}
class CarFactory {
    constructor() {
        this.cars = [];
    }
    create(model, price) {
        const candidate = this.getCar(model);
        if (candidate) {
            return candidate;
        }
        this.cars.push(new Car(model, price));
        return this.cars[this.cars.length -1];
    }
    getCar(model) {
        return this.cars.find(car => car.model === model);
    }
}

// Реализация патерна
const factory = new CarFactory();
console.log(factory.create('BMW', 1500));
console.log(factory.create('Mersedes', 2000));
console.log(factory.create('BMW', 2500));