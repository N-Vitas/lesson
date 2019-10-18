class Subject {
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        console.log('unsubscribe observer:',observer);
        this.observers = this.observers.filter(item => item !== observer);
    }
    fire(change){
        this.observers.forEach(observer => {
            observer.update(change);
        });
    }
    timeout(change, time, callback) {
        const cx = function(){
            this.fire(change);
            callback();
        };
        setTimeout(cx.bind(this), time);
    }
}

class Observer {
    static get INCREMENT() { return 'INCREMENT'}
    static get DECREMENT() { return 'DECREMENT'}
    static get ADD() { return 'ADD'}
    constructor(state = 0) {
        this.state = state;
        this.initialState = state;
    }
    update(action) {
        switch(action.type) {
            case Observer.INCREMENT: 
                this.state = ++this.state;
                break;
            case Observer.DECREMENT: 
                this.state = --this.state;
                break;
            case Observer.ADD: 
                this.state += action.payload;
                break;
            default: 
                this.state = this.initialState;
        }
    }
}

// Реализация патерна
const stream = new Subject();
const obs1 = new Observer();
const obs2 = new Observer(42);

stream.subscribe(obs1);
stream.subscribe(obs2);

const log = function() {
    console.clear();
    console.log(obs1.state);
    console.log(obs2.state);
}

stream.timeout({ type: Observer.INCREMENT }, 1000, log);
stream.timeout({ type: Observer.INCREMENT }, 2000, log);
stream.timeout({ type: Observer.DECREMENT }, 3000, log);
stream.timeout({ type: Observer.ADD, payload: 12 }, 4000, function() {log();stream.unsubscribe(obs2)});
stream.timeout({ type: Observer.DECREMENT }, 5000, log);
stream.timeout({ type: Observer.ADD, payload: 22 }, 6000, log);
log();
stream.fire({ type: Observer.INCREMENT });
stream.fire({ type: Observer.INCREMENT });
log();