// Популярный патерн Фасад. На этом патерне реализована библиотека jQuery
// Стандартный класс жалоб
class Complains {
    constructor() {
        this.complains = [];
    }
    reply(complaint) {}
    add(complaint) {
        this.complains.push(complaint);
        return this.reply(complaint);
    }
}
// Класс жалоб на продукт
class ProductComplains extends Complains {
    reply({id, customer, detail}) {
        return `Product ${id}: ${customer} (${detail})`;
    }
}
// Класс жалоб на сервис
class ServiceComplains extends Complains {
    reply({id, customer, detail}){
        return `Service ${id}: ${customer} (${detail})`;
    }
}
// Фасад
class ComplaintRegistry {
    register(customer, detail, type) {
        const id = Date.now();
        let complaint;
        if(type === 'service') {
            complaint = new ServiceComplains();
        } else {
            complaint = new ProductComplains();
        }
        return complaint.add({id, customer, detail});
    }
}

// Реализация патерна
const registry = new ComplaintRegistry();
console.log(registry.register('Ваня', 'Не включается питание', 'product'))
console.log(registry.register('Ира', 'Уже пол часа жду', 'service'))
console.log(registry.register('Петя', 'На корпусе трещина', 'product'))
console.log(registry.register('Петя', 'На корпусе трещина', 'product'))