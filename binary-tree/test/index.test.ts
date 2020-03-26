import {BinaryTree} from '../src';
import {Node} from '../src/node';

describe('BinaryTree', () => {

    it('Possible to iterate over tree', () => {
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

    it('tree.insert() inserts nodes', () => {
        const tree = new BinaryTree<number>();
        tree.insert(1);
        tree.insert(2);
        tree.insert(3);

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

    it('tree.delete() deletes nodes', () => {
        const tree = new BinaryTree<number>();
        tree.insert(1);
        tree.delete(1);

        let allValues = [...tree];
        expect(allValues.length).toBe(0);

        tree.insert(1);
        tree.insert(2);
        tree.insert(3);

        tree.delete(3);

        allValues = [...tree];
        expect(allValues.length).toBe(2);
        expect(allValues.includes(3)).toBe(false);

        tree.delete(2);
        allValues = [...tree];
        expect(allValues.length).toBe(1);
        expect(allValues.includes(2)).toBe(false);
    });

    it('tree.delete() throws Error when called with null or undefined', () => {
        const tree = new BinaryTree<number>();
        expect(
            () => tree.delete(null)
        ).toThrowError('Can\'t delete null or undefined!');
    });

    it('Possible to store 100 values, then delete them', () => {
        const tree = new BinaryTree<number>();
        for (let i = 0; i < 100; i++) {
            tree.insert(i);
        }
        for (let i = 0; i < 100; i++) {
            expect(tree.contains(i)).toBe(true);
            tree.delete(i);
            expect(tree.contains(i)).toBe(false);
        }
    });
});