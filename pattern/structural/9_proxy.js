function networkFetch(url) {
    return `${url} - Ответ от сервера`;
}

const cache = new Set();
const proxedFetch = new Proxy(networkFetch, {
    apply(target, thisArg, args) {
        const url = args[0];
        if(cache.has(url)) {
            return `${url} - Ответ из кеша`;
        }
        cache.add(url);
        return Reflect.apply(target, thisArg, args);
    }
});

// Реализация патерна
console.log(proxedFetch('https://google.com/'));
console.log(proxedFetch('https://yandex.ru/'));
console.log(proxedFetch('https://google.com/'));