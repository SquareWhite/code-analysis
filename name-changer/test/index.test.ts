import {NameChanger} from '../src';
import outdent from 'outdent';

describe('renameVariable(oldName, newName)', () => {

    it('Changes the name of a variable', () => {
        const inputCode = outdent`
            const a = 1;
            const b = 2;
            console.log(a + b);
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('a', 'x');
        expect(nameChanger.toCode())
            .toBe(outdent`
                const x = 1;
                const b = 2;
                console.log(x + b);`
            );
    });

    it('Changes the name of a function', () => {
        const inputCode = outdent`
            function a() {
                return 1;
            }
            const b = 2;
            console.log(a() + b);
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('a', 'x');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function x() {
                    return 1;
                }
                const b = 2;
                console.log(x() + b);`
            );
    });

    it('Modifies the name of a variable that shadows newName', () => {
        const inputCode = outdent`
            function main() {
                const print = 'World';
                log(print);
            }

            log('Hello');
            main();
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main() {
                    const _print = 'World';
                    print(_print);
                }
                print('Hello');
                main();`
            );
    });

    it('Modifies function\'s parameters when they shadow newName - declaration', () => {
        const inputCode = outdent`
            function main(print) {
                log(print);
            }

            log('Hello');
            main('World');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main(_print) {
                    print(_print);
                }
                print('Hello');
                main('World');`
            );
    });

    it('Modifies function\'s parameters when they shadow newName - expression', () => {
        const inputCode = outdent`
            const main = function (print) {
                log(print);
            };

            log('Hello');
            main('World');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                const main = function (_print) {
                    print(_print);
                };
                print('Hello');
                main('World');`
            );
    });

    it('Modifies arrow function\'s parameters that shadow newName', () => {
        const inputCode = outdent`
            const main = print => {
                log(print);
            };

            log('Hello');
            main('World');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                const main = _print => {
                    print(_print);
                };
                print('Hello');
                main('World');`
            );
    });

    it('Doesn\'t rename a method with a name newName', () => {
        const inputCode = outdent`
            function main() {
                const print = 'World';
                log(print);
            }

            log('Hello');
            main();

            printer.print('asd');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main() {
                    const _print = 'World';
                    print(_print);
                }
                print('Hello');
                main();
                printer.print('asd');`
            );
    });

    it('Doesn\'t rename a method with a name oldName', () => {
        const inputCode = outdent`
            function main() {
                const print = 'World';
                log(print);
            }

            log('Hello');
            main();

            logger.log('asd');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main() {
                    const _print = 'World';
                    print(_print);
                }
                print('Hello');
                main();
                logger.log('asd');`
            );
    });

    it('Doesn\'t modify literals that contain oldName and newName', () => {
        const inputCode = outdent`
            function main() {
                const print = 'World';
                log(print);
            }

            log('log');
            main();

            logger.log('print');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main() {
                    const _print = 'World';
                    print(_print);
                }
                print('log');
                main();
                logger.log('print');`
            );
    });

    it('Doesn\'t modify function parameters if the oldName isn\'t used inside', () => {
        const inputCode = outdent`
            function main(print) {
                console.log(print);
            }

            log('Hello');
            main('World');
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main(print) {
                    console.log(print);
                }
                print('Hello');
                main('World');`
            );
    });

    it('Doesn\'t modify variable newName if the oldName isn\'t used in the same block', () => {
        const inputCode = outdent`
            {
                const print = 'World';
                console.log(print);
            }

            log('log');
            main();
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                {
                    const print = 'World';
                    console.log(print);
                }
                print('log');
                main();`
            );
    });

    it('Doesn\'t modify a variable that shadows oldName if the outer oldName isn\'t used in the same scope', () => {
        const inputCode = outdent`
            function main() {
                const print = 'World';
                console.log(print);
            }

            log('log');
            main();
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main() {
                    const print = 'World';
                    console.log(print);
                }
                print('log');
                main();`
            );
    });

    it('Modifies the name of a variable that shadows newName from outer scope', () => {
        const inputCode = outdent`
            function main() {
                const print = 'World';
                return () => {
                    log('123');
                };
            }

            log('log');
            main()();
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
                function main() {
                    const _print = 'World';
                    return () => {
                        print('123');
                    };
                }
                print('log');
                main()();`
            );
    });

    it('Everything combined', () => {
        const inputCode = outdent`
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
        `;
        const nameChanger = new NameChanger(inputCode);
        nameChanger.renameVariable('log', 'print');
        expect(nameChanger.toCode())
            .toBe(outdent`
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
                main('Hello World!')();`
            );
    });
});