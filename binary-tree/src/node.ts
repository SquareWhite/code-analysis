export class Node<T>{
    public left: Node<T>;
    public right: Node<T>;
    public parent: Node<T>;
    public hash: string;
    constructor(public value: T) { }
}
