# Установка и запуск
Установка 

    git clone https://github.com/SquareWhite/code-analysis.git
    cd binary-tree
    npm i
    
Сборка

    npm run build
    
Запуск тестов

    npm run test
    
Использование
    
    node
    > const {BinaryTree} = require('./dist');
    > let tree = new BinaryTree();
    > [1, 2, 3, 4, 5, 6].forEach((num) => tree.insert(num));
    > tree.delete(6);
    > const printTree = (tree) => console.log(...tree);
    > printTree(tree);
    1, 2, 3, 4, 5 



# Задание
- Написать двоичное дерево на JavaScript
- Написать функцию, которая выводит все значения переданного в нее двоичного дерева (printTree(binaryTree))
    
# Решение
Реализовано двоичное дерево, поддерживающее следующие функции:
- insert(value) - добавляет value в дерево
- delete(value) - удаляет первое найденное вхождение value из дерева
- contains(value) - возвращает true, если value содержится в дереве

Дерево поддерживает протокол итерации javascript, значит его можно
использовать в циклах и со spread операциями:

    for (const value of tree) {
        ...
    }
    const allValues = [...tree];


Таким образом `printTree` можно реализовать следующим образом:

    const printTree = (tree) => console.log(...tree);