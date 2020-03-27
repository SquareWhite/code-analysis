import {BinaryTree} from '../src';
import {Node} from '../src/node';

describe('BinaryTree', () => {

    it('Possible to iterate over tree', () => {
        // insert() depends on iteration, so it's not used in this test

        const root = new Node(1);
        root.left = new Node(2);
        root.left.parent = root;
        root.right = new Node(3);
        root.right.parent = root;
        root.left.left = new Node(4);
        root.left.left.parent = root.left;
        root.left.right = new Node(5);
        root.left.right.parent = root.left;

        const tree = Object.create(BinaryTree.prototype);
        tree._root = root;

        const allValues = [...tree];
        expect(allValues.length).toBe(5);
        expect(allValues).toContain(1);
        expect(allValues).toContain(2);
        expect(allValues).toContain(3);
        expect(allValues).toContain(4);
        expect(allValues).toContain(5);
    });

    it('tree.insert() inserts numbers', () => {
        const tree = new BinaryTree<number>();
        tree.insert(1);
        tree.insert(2);
        tree.insert(3);

        expect(tree.size).toBe(3);

        const allValues = [...tree];
        expect(allValues.length).toBe(3);
        expect(allValues).toContain(1);
        expect(allValues).toContain(2);
        expect(allValues).toContain(3);
    });

    it('tree.insert() throws Error when called with null or undefined', () => {
        const tree = new BinaryTree<number>();
        expect(
            () => tree.insert(null)
        ).toThrowError('Can\'t insert null or undefined!');
    });

    it('tree.delete() deletes numbers', () => {
        const tree = new BinaryTree<number>();
        tree.insert(1);
        tree.delete(1);

        let allValues = [...tree];
        expect(tree.size).toBe(0);
        expect(allValues.length).toBe(0);

        tree.insert(1);
        tree.insert(2);
        tree.insert(3);

        tree.delete(3);

        allValues = [...tree];
        expect(tree.size).toBe(2);
        expect(allValues.length).toBe(2);
        expect(allValues.includes(3)).toBe(false);

        tree.delete(2);
        allValues = [...tree];
        expect(tree.size).toBe(1);
        expect(allValues.length).toBe(1);
        expect(allValues.includes(2)).toBe(false);
    });

    it('tree.delete() throws Error when called with null or undefined', () => {
        const tree = new BinaryTree<number>();
        expect(
            () => tree.delete(null)
        ).toThrowError('Can\'t delete null or undefined!');
    });

    it('Possible to store 100 numbers, then delete them', () => {
        const tree = new BinaryTree<number>();
        for (let i = 0; i < 100; i++) {
            tree.insert(i);
        }
        for (let i = 0; i < 100; i++) {
            expect(tree.contains(i)).toBe(true);
            tree.delete(i);
            expect(tree.contains(i)).toBe(false);
        }
        expect(tree.size).toBe(0);
    });

    it('Possible to store 100 numbers, then delete them from the other end', () => {
        const tree = new BinaryTree<number>();
        for (let i = 0; i < 100; i++) {
            tree.insert(i);
        }
        for (let i = 99; i >= 0; i--) {
            expect(tree.contains(i)).toBe(true);
            tree.delete(i);
            expect(tree.contains(i)).toBe(false);
        }
        expect(tree.size).toBe(0);
    });

    it('Possible to store objects', () => {
        const tree = new BinaryTree<Object>();
        tree.insert({a: 1});
        tree.insert({a: 2});
        tree.insert({a: 3});

        expect(tree.contains({a: 1})).toBe(true);
        expect(tree.contains({b: 1})).toBe(false);
        expect(tree.contains({a: 2})).toBe(true);
        expect(tree.contains([])).toBe(false);
    });

    it('Possible to delete objects', () => {
        const tree = new BinaryTree<Object>();
        tree.insert({a: 1});
        tree.insert({a: 2});
        tree.insert({a: 3});

        expect(tree.contains({a: 1})).toBe(true);
        tree.delete({a: 1});
        expect(tree.contains({a: 1})).toBe(false);

        expect(tree.size).toBe(2);
    });

    it('Possible to store 100 objects, then delete them', () => {
        const tree = new BinaryTree<Object>();
        for (let i = 0; i < 100; i++) {
            tree.insert({i});
        }
        for (let i = 0; i < 100; i++) {
            expect(tree.contains({i})).toBe(true);
            tree.delete({i});
            expect(tree.contains({i})).toBe(false);
        }
        expect(tree.size).toBe(0);
    });

    it('Possible to store lists', () => {
        const tree = new BinaryTree<Object>();
        tree.insert([1, 0, 1]);
        tree.insert([0, 0, 1]);
        tree.insert([1, 1, 1]);

        expect(tree.size).toBe(3);
        expect(tree.contains([1, 0, 1])).toBe(true);
        expect(tree.contains([0, 0, 1])).toBe(true);
        expect(tree.contains([1, 1, 1])).toBe(true);
    });

    it('Possible to delete lists', () => {
        const tree = new BinaryTree<Object>();
        tree.insert([1, 0, 1]);
        tree.insert([0, 0, 1]);
        tree.insert([1, 1, 1]);

        tree.delete([1, 0, 1]);
        expect(tree.contains([1, 0, 1])).toBe(false);
        tree.delete([0, 0, 1]);
        expect(tree.contains([0, 0, 1])).toBe(false);
        tree.delete([1, 1, 1]);
        expect(tree.contains([1, 1, 1])).toBe(false);

        expect(tree.size).toBe(0);
    });
});