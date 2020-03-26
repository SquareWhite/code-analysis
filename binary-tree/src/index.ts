export class BinaryTree<T> {
    private _root: Node<T>;

    constructor() {
        this._root = new Node(null);
    }

    /**
     * Insert new value into the tree
     */
    insert(value: T) : void {
        if (value == null) {
            throw new Error('Can\'t insert null or undefined!');
        }
        for (const node of this._walk()) {
            if (node.value == null) {
                node.value = value;
                break;
            }
            else if (node.left == null) {
                node.left = new Node(value);
                node.left.parent = node;
                break;
            }
            else if (node.right == null) {
                node.right = new Node(value);
                node.right.parent = node;
                break;
            }
        }
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
        } else {
            this._replaceNode(nodeToDelete, replacement);
        }

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
        for (const node of this._walk()) {
            if (node.value === value) {
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

export class Node<T>{
    public left: Node<T>;
    public right: Node<T>;
    public parent: Node<T>;
    constructor(public value: T) { }
}
