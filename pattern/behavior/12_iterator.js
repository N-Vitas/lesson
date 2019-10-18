// Патерн для доступа к данным
class MyIterator {
    constructor(data) {
        this.index = 0;
        this.data = data;
    }
    [Symbol.iterator]() {
        return {
            next: () => {
                if(this.index < this.data.length){
                    return {
                        value: this.data[this.index++],
                        done: false
                    }
                }
                this.index = 0;
                return {
                    value: void 0,
                    done: true
                }
            }
        }
    }
}

function* generator(collections) {
    let index = 0;
    while(index < collections.length) {
        yield collections[index++];
    }
}
// Реализация патерна
const iterator = new MyIterator(['This', 'is', 'iterator']);
const gen = generator(['This', 'is', 'iterator']);
for (const val of iterator) {
    console.log('iterator value', val);
}
console.log('gen next value', gen.next().value);
console.log('gen next value', gen.next().value);
console.log('gen next value', gen.next().value);
for (const val of gen) {
    console.log('gen value', val);
}
