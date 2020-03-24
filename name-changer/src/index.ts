import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as escodegen from 'escodegen';
import {outdent} from "outdent";


export default class NameChanger {
    private readonly astTree : acorn.Node;

    constructor(inputCode: string) {
        this.astTree = acorn.parse(inputCode);
    }

    buildString() : string {
        return escodegen.generate(this.astTree);
    }

    renameVariable(oldName: string, newName: string) : void {
        const foundOldNames: Node[] = [];
        const foundNewNames: {identifier: Node, ancestors: Node[]}[] = [];

        walk.fullAncestor(this.astTree, (node: Node, _, ancestors: Node[]) => {
            let identifiers = this.lookForIdentifiers(node);
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
            if (this.closestScopeContains(oldName, ancestors)) {
                identifier.name = '_' + newName;
            }
        });
        foundOldNames.forEach(identifier => identifier.name = newName);
    }

    private closestScopeContains(name: string, ancestors: Node[]) : boolean {
        let block = ancestors
            .reverse()
            .find(node =>
                node.type === 'BlockStatement' ||
                node.type === 'FunctionDeclaration'
            );
        if (!block) {
            return true;
        }
        if (block.type === 'FunctionDeclaration') {
            block = block.body;
        }

        let appeared = false;
        walk.full(block, (node: Node) => {
            let identifiers = this.lookForIdentifiers(node);
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

    private lookForIdentifiers(node: Node) : Node[] {
        let identifiers = [];

        if (node.type === 'Identifier') {
           identifiers.push(node);
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
    name?: string,
    id?: Node,
    params?: Node[],
    body?: Node
}
