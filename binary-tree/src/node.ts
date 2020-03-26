export class Node<T>{
    public left: Node<T>;
    public right: Node<T>;
    public parent: Node<T>;
    constructor(public value: T) { }
}
