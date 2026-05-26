export interface InstructionMetadata {
    name: string;
    operandBytes: number;
    //cycles: number;
}

export const instructionSet: Map<number, InstructionMetadata> = new Map([
    [0xA9, { name: 'LDA', operandBytes: 1 }],
    [0xAD, { name: 'LDA', operandBytes: 2 }],
    [0x8D, { name: 'STA', operandBytes: 2 }],
    [0x8A, { name: 'TXA', operandBytes: 0 }],
    [0x98, { name: 'TYA', operandBytes: 0 }],
    [0x6D, { name: 'ADC', operandBytes: 2 }],
    [0xA2, { name: 'LDX', operandBytes: 1 }],
    [0xAE, { name: 'LDX', operandBytes: 2 }],
    [0xAA, { name: 'TAX', operandBytes: 0 }],
    [0xA0, { name: 'LDY', operandBytes: 1 }],
    [0xAC, { name: 'LDY', operandBytes: 2 }],
    [0xA8, { name: 'TAY', operandBytes: 0 }],
    [0xEA, { name: 'NOP', operandBytes: 0 }],
    [0x00, { name: 'BRK', operandBytes: 0 }],
    [0xEC, { name: 'CPX', operandBytes: 2 }],
    [0xEE, { name: 'INC', operandBytes: 2 }],
    [0xD0, { name: 'BNE', operandBytes: 1 }],
    [0xFF, { name: 'SYS', operandBytes: 0 }]
]);