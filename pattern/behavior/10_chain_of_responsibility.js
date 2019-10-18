// Патерн для последовательного вызова методов
class MySum {
    constructor(initialvalue = 42) {
        this.sum = initialvalue;
    }
    add(value) {
        this.sum += value;
        // суть патерна в том что медод возвращает контекст
        return this;
    }
}
// Реализация патерна
const sum1 = new MySum();
console.log(sum1.add(8).add(1).add(10).add(2))