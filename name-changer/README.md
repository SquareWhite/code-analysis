# Установка и запуск
Установка

    git clone https://github.com/SquareWhite/code-analysis.git
    cd name-changer
    npm i
    
Сборка

    npm run build
    
Запуск тестов

    npm run test
    
Использование
    
    node
    > const {default: NameChanger} = require('./dist');
    > let changer = new NameChanger(`
          function main() {
             const print = "World";
             log(print);
          }
      `);
    > changer.renameVariable('log', 'print');  
    > changer.toCode();
    'function main() {\n    const _print = \'World\';\n    print(_print);\n}'



# Задание
Напишите скрипт на Node.js(JavaScript) который заменит переменную log на print в коде:

    function main() {
       const print = "World";
       log(print);
    }

    log("Hello");
    main();
    
# Решение
Если допустить, что код из задания находится в global scope, 
а так же там находится и функция log, объявленная как 
    
    function log(...) {
        ...
    }
    
То для выполнения задания было бы достаточно вызвать строковый метод replace

    inputCode.replace(/log/g, 'global.print')

Однако в случае, когда код находится внутри функции или класса, или даже в случае, когда
функция log объявлена как

    const log = (...) => {...};
    
решение не сработает, и аналог ему будет не придумать. Это обусловлено тем, что
такие переменные будут крепиться на недоступном из js `[[LexicalScope]]`.

Таким образом правильным подходом будет составление по коду абстрактного синтаксического
дерева и его дальнейший анализ. 

Для составления ast использовалась библиотека `acorn`, для обхода - `acorn-walk`, для последующей
генерации js кода по дереву - `escodegen`. 

Основной целью реализованной программы является изменение имени переменной с устранением 
shadowing'а нового имени другими уже существующими идентификатормаи. В решении не предусмотрены
все возможные кейсы (например, не учитывается случай, где новое имя для затеняющей переменной уже занято).

Пример преобразования, осуществляемого кодом. Замена "log" на "print"

Изначальный код:

    function log(msg) {
        console.log(msg);
    }

    function main(print) {
        log(print);
        return () => {
            const print = 'print';
            log(print);
        };
    }
    
    {
        const print = 'World';
        console.log(print);
    }
    
    let a = {
        print: () => {}
    };

    log('log');
    main('Hello World!')();
    
    
Результирующий код:

    function print(msg) {
        console.log(msg);
    }
    function main(_print) {
        print(_print);
        return () => {
            const _print = 'print';
            print(_print);
        };
    }
    {
        const print = 'World';
        console.log(print);
    }
    let a = {
        print: () => {
        }
    };
    print('log');
    main('Hello World!')();
    
Другие примеры исопльзования можно посмотреть в тестах. 
Код из задания преобразуется в 3м тесте.
