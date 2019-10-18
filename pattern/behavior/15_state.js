class Light {
    constructor(light) {
        this.light = light;
    }
}
class RedLight extends Light {
    constructor() {
        super('red');
    }
    sing() {
        return 'Стоп';
    }
}
class YellowLight extends Light {
    constructor() {
        super('yellow');
    }
    sing() {
        return 'Готовься';
    }
}
class GreenLight extends Light {
    constructor() {
        super('green');
    }
    sing() {
        return 'Иди';
    }
}
class TrafficLight {
    constructor() {
        this.states = [
            new YellowLight(),
            new GreenLight(),
            new RedLight()
        ];
        this.current = this.states[0]; 
    }
    change() {
        const total = this.states.length;
        const index = this.states.findIndex(light => light === this.current)
        if(index +1 < total) {
            this.current = this.states[index + 1];
        } else {
            this.current = this.states[0];
        }
    }
    sing() {
        return this.current.sing();
    }
}

// Реализация патерна
const light = new TrafficLight();
setInterval(() => {
    console.log(light.sing());
    light.change();
}, 1000);