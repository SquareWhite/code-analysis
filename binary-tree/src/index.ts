import {Node} from "./node";
import * as hash from "object-hash";
import * as assert from "assert";


export class BinaryTree<T> {
    private _root: Node<T>;
    private _size: number;

    constructor() {
        this._root = new Node(null);
        this._size = 0;
    }

    get size() {
        return this._size;
    }

    /**
     * Insert new value into the tree
     */
    insert(value: T) : void {
        if (value == null) {
            throw new Error('Can\'t insert null or undefined!');
        }

        const useHash = value instanceof Object;
        for (const node of this._walk()) {
            if (node.value == null) {
                node.value = value;
                node.hash = useHash? hash(value) : null;
                break;
            }
            else if (node.left == null) {
                node.left = new Node(value);
                node.left.parent = node;
                node.left.hash = useHash? hash(value) : null;
                break;
            }
            else if (node.right == null) {
                node.right = new Node(value);
                node.right.parent = node;
                node.right.hash = useHash? hash(value) : null;
                break;
            }
        }
        this._size++;
    }

    /**
     * Returns an iterator that goes through all values stored in the tree
     */
    *[Symbol.iterator]() : IterableIterator<T> {
        for (const node of this._walk()) {
            if (node.value != null) {
                yield node.value;
            }
        }
    }

    /**
     * Returns true if passed value is stored in the tree
     */
    contains(value: T) : boolean {
        return !!this._findNode(value);
    }

    /**
     * Delete node with the specified value.
     * Replace it with the deepest rightmost node
     */
    delete(value: T) : void {
        if (value == null) {
            throw new Error('Can\'t delete null or undefined!');
        }

        const nodeToDelete = this._findNode(value);
        if (!nodeToDelete) {
            return;
        }

        const replacement = [...this._walk()].pop();
        if (replacement === this._root) {
            this._root.value = null;
            this._root.hash = null;
        } else {
            this._replaceNode(nodeToDelete, replacement);
        }

        this._size--;
    }

    private _replaceNode(nodeToDelete: Node<T>, replacement: Node<T>) {
        if (replacement.parent.left === replacement) {
            replacement.parent.left = null;
        } else {
            replacement.parent.right = null;
        }

        if (nodeToDelete !== replacement) {
            replacement.left = nodeToDelete.left;
            replacement.right = nodeToDelete.right;
            replacement.parent = nodeToDelete.parent;

            if (nodeToDelete.left) {
                nodeToDelete.left.parent = replacement;
            }
            if (nodeToDelete.right) {
                nodeToDelete.right.parent = replacement;
            }

            if (nodeToDelete.parent) {
                if (nodeToDelete.parent.left === nodeToDelete) {
                    nodeToDelete.parent.left = replacement;
                } else {
                    nodeToDelete.parent.right = replacement;
                }
            }
        }

        if (nodeToDelete === this._root) {
            this._root = replacement;
        }

        delete nodeToDelete.left;
        delete nodeToDelete.right;
        delete nodeToDelete.parent;
    }

    private _findNode(value: T) : Node<T> {
        const hashed = hash(value);

        for (const node of this._walk()) {
            if (node.value === value ||
                  node.hash === hashed) {
                return node;
            }
        }
    }

    private *_walk() : IterableIterator<Node<T>> {
        const nodeQueue: Node<T>[] = [this._root];

        yield this._root;
        for (const node of nodeQueue) {
            if (node.left) {
                nodeQueue.push(node.left);
                yield node.left;
            }
            if (node.right) {
                nodeQueue.push(node.right);
                yield node.right;
            }
        }
    }
}
