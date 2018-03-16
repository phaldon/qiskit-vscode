// Generated from QasmParser.g4 by ANTLR 4.6-SNAPSHOT



class Register {
    name: string;
    size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}

class SymbolsTable {    
    
    private qregs: Register[] = [];
    private cregs: Register[] = [];
    gates: string[] = [];
    opaques: string[] = [];

    private toName = (register: Register) => register.name;

    addQuantumRegister(name: string, size: number) {
        this.qregs.push(new Register(name, size));
    }

    addClassicRegister(name: string, size: number) {
        this.cregs.push(new Register(name, size));
    }

    containsQuantumRegister(qregName: string) {
        let hasSearchedName = (register: Register) => register.name === qregName;

        return this.qregs.filter(hasSearchedName).length > 0;
    }

    containsQuantumBit(qregName: string, position: number): boolean {
        return this.findBitInRegister(this.qregs, qregName, position);
    }

    containsClassicRegister(cregName: string) {
        let hasSearchedName = (register: Register) => register.name === cregName;

        return this.cregs.filter(hasSearchedName).length > 0;
    }

    containsClassicBit(cregName: string, position: number): boolean {
        return this.findBitInRegister(this.cregs, cregName, position);
    }

    private findBitInRegister(registers: Register[], registerName: string, position: number): boolean { 
        let hasSearchedName = (register: Register) => register.name === registerName;

        let searchedRegisters = registers.filter(hasSearchedName);
        if (searchedRegisters.length > 0) {
            return searchedRegisters[0].size > position;
        }

        return true;  // if register not found that's a different error
    } 

    getQuantumRegisters(): string[] {
        return this.qregs.map(this.toName);
    }

    getClassicRegisters(): string[] {
        return this.cregs.map(this.toName);
    }

}



import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';

import { CodeContext } from './QasmParser';
import { HeadersContext } from './QasmParser';
import { SentencesContext } from './QasmParser';
import { CleanContext } from './QasmParser';
import { SentenceContext } from './QasmParser';
import { DefinitionContext } from './QasmParser';
import { ExpressionContext } from './QasmParser';
import { ConditionalContext } from './QasmParser';
import { GateDefinitionContext } from './QasmParser';
import { OpaqueDefinitionContext } from './QasmParser';
import { GateDefinitionArgumentsContext } from './QasmParser';
import { OpaqueDefinitionArgumentsContext } from './QasmParser';
import { ParamsListContext } from './QasmParser';
import { BodyContext } from './QasmParser';
import { BodyExpressionContext } from './QasmParser';
import { ParamsListBodyContext } from './QasmParser';
import { ExpContext } from './QasmParser';
import { UnaryOpContext } from './QasmParser';
import { MeasureContext } from './QasmParser';
import { QubitContext } from './QasmParser';
import { CbitContext } from './QasmParser';
import { CustomArglistContext } from './QasmParser';
import { ParamsListNumberContext } from './QasmParser';
import { QubitAndQregListContext } from './QasmParser';
import { QbitOrQregContext } from './QasmParser';
import { CxGateContext } from './QasmParser';
import { BarrierGateContext } from './QasmParser';
import { QubitListContext } from './QasmParser';
import { ResetGateContext } from './QasmParser';


/**
 * This interface defines a complete listener for a parse tree produced by
 * `QasmParser`.
 */
export interface QasmParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `QasmParser.code`.
	 * @param ctx the parse tree
	 */
	enterCode?: (ctx: CodeContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.code`.
	 * @param ctx the parse tree
	 */
	exitCode?: (ctx: CodeContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.headers`.
	 * @param ctx the parse tree
	 */
	enterHeaders?: (ctx: HeadersContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.headers`.
	 * @param ctx the parse tree
	 */
	exitHeaders?: (ctx: HeadersContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.sentences`.
	 * @param ctx the parse tree
	 */
	enterSentences?: (ctx: SentencesContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.sentences`.
	 * @param ctx the parse tree
	 */
	exitSentences?: (ctx: SentencesContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.clean`.
	 * @param ctx the parse tree
	 */
	enterClean?: (ctx: CleanContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.clean`.
	 * @param ctx the parse tree
	 */
	exitClean?: (ctx: CleanContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.sentence`.
	 * @param ctx the parse tree
	 */
	enterSentence?: (ctx: SentenceContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.sentence`.
	 * @param ctx the parse tree
	 */
	exitSentence?: (ctx: SentenceContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.definition`.
	 * @param ctx the parse tree
	 */
	enterDefinition?: (ctx: DefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.definition`.
	 * @param ctx the parse tree
	 */
	exitDefinition?: (ctx: DefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.conditional`.
	 * @param ctx the parse tree
	 */
	enterConditional?: (ctx: ConditionalContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.conditional`.
	 * @param ctx the parse tree
	 */
	exitConditional?: (ctx: ConditionalContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.gateDefinition`.
	 * @param ctx the parse tree
	 */
	enterGateDefinition?: (ctx: GateDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.gateDefinition`.
	 * @param ctx the parse tree
	 */
	exitGateDefinition?: (ctx: GateDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.opaqueDefinition`.
	 * @param ctx the parse tree
	 */
	enterOpaqueDefinition?: (ctx: OpaqueDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.opaqueDefinition`.
	 * @param ctx the parse tree
	 */
	exitOpaqueDefinition?: (ctx: OpaqueDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.gateDefinitionArguments`.
	 * @param ctx the parse tree
	 */
	enterGateDefinitionArguments?: (ctx: GateDefinitionArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.gateDefinitionArguments`.
	 * @param ctx the parse tree
	 */
	exitGateDefinitionArguments?: (ctx: GateDefinitionArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.opaqueDefinitionArguments`.
	 * @param ctx the parse tree
	 */
	enterOpaqueDefinitionArguments?: (ctx: OpaqueDefinitionArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.opaqueDefinitionArguments`.
	 * @param ctx the parse tree
	 */
	exitOpaqueDefinitionArguments?: (ctx: OpaqueDefinitionArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.paramsList`.
	 * @param ctx the parse tree
	 */
	enterParamsList?: (ctx: ParamsListContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.paramsList`.
	 * @param ctx the parse tree
	 */
	exitParamsList?: (ctx: ParamsListContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.body`.
	 * @param ctx the parse tree
	 */
	enterBody?: (ctx: BodyContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.body`.
	 * @param ctx the parse tree
	 */
	exitBody?: (ctx: BodyContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.bodyExpression`.
	 * @param ctx the parse tree
	 */
	enterBodyExpression?: (ctx: BodyExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.bodyExpression`.
	 * @param ctx the parse tree
	 */
	exitBodyExpression?: (ctx: BodyExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.paramsListBody`.
	 * @param ctx the parse tree
	 */
	enterParamsListBody?: (ctx: ParamsListBodyContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.paramsListBody`.
	 * @param ctx the parse tree
	 */
	exitParamsListBody?: (ctx: ParamsListBodyContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.exp`.
	 * @param ctx the parse tree
	 */
	enterExp?: (ctx: ExpContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.exp`.
	 * @param ctx the parse tree
	 */
	exitExp?: (ctx: ExpContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.unaryOp`.
	 * @param ctx the parse tree
	 */
	enterUnaryOp?: (ctx: UnaryOpContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.unaryOp`.
	 * @param ctx the parse tree
	 */
	exitUnaryOp?: (ctx: UnaryOpContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.measure`.
	 * @param ctx the parse tree
	 */
	enterMeasure?: (ctx: MeasureContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.measure`.
	 * @param ctx the parse tree
	 */
	exitMeasure?: (ctx: MeasureContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.qubit`.
	 * @param ctx the parse tree
	 */
	enterQubit?: (ctx: QubitContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.qubit`.
	 * @param ctx the parse tree
	 */
	exitQubit?: (ctx: QubitContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.cbit`.
	 * @param ctx the parse tree
	 */
	enterCbit?: (ctx: CbitContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.cbit`.
	 * @param ctx the parse tree
	 */
	exitCbit?: (ctx: CbitContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.customArglist`.
	 * @param ctx the parse tree
	 */
	enterCustomArglist?: (ctx: CustomArglistContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.customArglist`.
	 * @param ctx the parse tree
	 */
	exitCustomArglist?: (ctx: CustomArglistContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.paramsListNumber`.
	 * @param ctx the parse tree
	 */
	enterParamsListNumber?: (ctx: ParamsListNumberContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.paramsListNumber`.
	 * @param ctx the parse tree
	 */
	exitParamsListNumber?: (ctx: ParamsListNumberContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.qubitAndQregList`.
	 * @param ctx the parse tree
	 */
	enterQubitAndQregList?: (ctx: QubitAndQregListContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.qubitAndQregList`.
	 * @param ctx the parse tree
	 */
	exitQubitAndQregList?: (ctx: QubitAndQregListContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.qbitOrQreg`.
	 * @param ctx the parse tree
	 */
	enterQbitOrQreg?: (ctx: QbitOrQregContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.qbitOrQreg`.
	 * @param ctx the parse tree
	 */
	exitQbitOrQreg?: (ctx: QbitOrQregContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.cxGate`.
	 * @param ctx the parse tree
	 */
	enterCxGate?: (ctx: CxGateContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.cxGate`.
	 * @param ctx the parse tree
	 */
	exitCxGate?: (ctx: CxGateContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.barrierGate`.
	 * @param ctx the parse tree
	 */
	enterBarrierGate?: (ctx: BarrierGateContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.barrierGate`.
	 * @param ctx the parse tree
	 */
	exitBarrierGate?: (ctx: BarrierGateContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.qubitList`.
	 * @param ctx the parse tree
	 */
	enterQubitList?: (ctx: QubitListContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.qubitList`.
	 * @param ctx the parse tree
	 */
	exitQubitList?: (ctx: QubitListContext) => void;

	/**
	 * Enter a parse tree produced by `QasmParser.resetGate`.
	 * @param ctx the parse tree
	 */
	enterResetGate?: (ctx: ResetGateContext) => void;
	/**
	 * Exit a parse tree produced by `QasmParser.resetGate`.
	 * @param ctx the parse tree
	 */
	exitResetGate?: (ctx: ResetGateContext) => void;
}
