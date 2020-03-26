import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as escodegen from 'escodegen';


export default class NameChanger {
    private readonly astTree : acorn.Node;

    constructor(inputCode: string) {
        this.astTree = acorn.parse(inputCode);
    }

    toCode() : string {
        return escodegen.generate(this.astTree);
    }

    renameVariable(oldName: string, newName: string) : void {
        const foundOldNames: Identifier[] = [];
        const foundNewNames: IdentifierWithContext[] = [];

        walk.fullAncestor(this.astTree, (node: Node, _, ancestors: Node[]) => {
            const identifiers = this.lookForIdentifiers(node);
            if (!identifiers.length) {
                return;
            }

            identifiers.forEach(identifier => {
                if (identifier.name === newName) {
                    // copy ancestors so that acorn doesn't change them
                    foundNewNames.push({identifier, ancestors: [...ancestors]});
                }
                else if (identifier.name === oldName) {
                    foundOldNames.push(identifier);
                }
            });
        });

        foundNewNames.forEach(({identifier, ancestors}) => {
            if (this.closestScopeContainsName(oldName, ancestors)) {
                identifier.name = '_' + newName;
            }
        });
        foundOldNames.forEach(identifier => identifier.name = newName);
    }

    private closestScopeContainsName(name: string, ancestors: Node[]) : boolean {
        const LEXICAL_SCOPE_TYPES = [
            'BlockStatement',
            'FunctionDeclaration',
            'FunctionExpression',
            'ArrowFunctionExpression',
        ];

        let block = ancestors
            .reverse()
            .find(node => LEXICAL_SCOPE_TYPES.includes(node.type));
        if (!block) {
            return true;
        }
        if (block.type !== 'BlockStatement') {
            block = block.body;
        }

        let appeared = false;
        walk.full(block, (node: Node) => {
            const identifiers = this.lookForIdentifiers(node);
            if (!identifiers.length) {
                return;
            }
            identifiers.forEach(identifier => {
                if (identifier.name === name) {
                    appeared = true;
                }
            });
        });
        return appeared;
    }

    private lookForIdentifiers(node: Node) : Identifier[] {
        const identifiers: Identifier[] = [];

        if (node.type === 'Identifier') {
           identifiers.push(node as Identifier);
        }
        if (node.id) {
            identifiers.push(node.id);
        }
        if (node.params && node.params.length) {
            identifiers.push(...node.params);
        }

        return identifiers;
    }
}


interface Node extends acorn.Node {
    id?: Identifier,
    params?: Identifier[],
    body?: Node
}

interface Identifier extends Node {
    name: string
}

interface IdentifierWithContext {
    identifier: Identifier,
    ancestors: Node[]
}
