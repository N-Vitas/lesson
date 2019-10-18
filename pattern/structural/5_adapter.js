// Адаптер позволяет интегрировать новый и старый интерфейс

class OldCalc {
    operations(t1, t2, operation) {
        switch(operation) {
            case 'add': return t1 + t2;
            case 'sub': return t1 + t2;
            default: return NaN;
        }
    }
}

class NewCalc {
    add(t1, t2) {
        return t1 + t2;
    }
    sub(t1, t2) {
        return t1 - t2;
    }
}

class CalcAdapter extends NewCalc {
    operations(t1, t2, operation) {
        switch(operation) {
            case 'add': return this.add(t1, t2);
            case 'sub': return this.sub(t1, t2);
            default: return NaN;
        }
    }
}
// Реализация старого интерфейса
const oldcalc = new OldCalc();
console.log('oldcalc', oldcalc.operations(10, 5, 'add'));
// Реализация нового интерфейса
const calc = new NewCalc();
console.log('calc', calc.add(10, 5));
// Реализация патерна
const calcadapter = new CalcAdapter();
console.log('calcadapter', calcadapter.operations(10, 5, 'add'));