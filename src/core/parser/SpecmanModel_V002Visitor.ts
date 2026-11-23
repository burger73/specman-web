// @ts-nocheck – generiert von antlr-ng (npm run gen:parser), nicht von Hand ändern

import { AbstractParseTreeVisitor } from "antlr4ng";


import { DiagramContext } from "./SpecmanModel_V002Parser.js";
import { StepFragmentContext } from "./SpecmanModel_V002Parser.js";
import { TableFragmentContext } from "./SpecmanModel_V002Parser.js";
import { SettingsContext } from "./SpecmanModel_V002Parser.js";
import { SettingEntryContext } from "./SpecmanModel_V002Parser.js";
import { PdfOptionEntryContext } from "./SpecmanModel_V002Parser.js";
import { MetaTagConfigContext } from "./SpecmanModel_V002Parser.js";
import { FreetextParamContext } from "./SpecmanModel_V002Parser.js";
import { MetaTagContentContext } from "./SpecmanModel_V002Parser.js";
import { LabelParamContext } from "./SpecmanModel_V002Parser.js";
import { IconParamContext } from "./SpecmanModel_V002Parser.js";
import { IntroContext } from "./SpecmanModel_V002Parser.js";
import { OutroContext } from "./SpecmanModel_V002Parser.js";
import { MainSequenceContext } from "./SpecmanModel_V002Parser.js";
import { StepContext } from "./SpecmanModel_V002Parser.js";
import { SimpleStepContext } from "./SpecmanModel_V002Parser.js";
import { BreakStepContext } from "./SpecmanModel_V002Parser.js";
import { SourceStepContext } from "./SpecmanModel_V002Parser.js";
import { WhileStepContext } from "./SpecmanModel_V002Parser.js";
import { DoWhileStepContext } from "./SpecmanModel_V002Parser.js";
import { IfElseStepContext } from "./SpecmanModel_V002Parser.js";
import { IfStepContext } from "./SpecmanModel_V002Parser.js";
import { CaseStepContext } from "./SpecmanModel_V002Parser.js";
import { SubsequenceStepContext } from "./SpecmanModel_V002Parser.js";
import { IfBranchContext } from "./SpecmanModel_V002Parser.js";
import { ElseBranchContext } from "./SpecmanModel_V002Parser.js";
import { DefaultBranchContext } from "./SpecmanModel_V002Parser.js";
import { CaseBranchContext } from "./SpecmanModel_V002Parser.js";
import { CatchAreaContext } from "./SpecmanModel_V002Parser.js";
import { CatchAreaParamContext } from "./SpecmanModel_V002Parser.js";
import { CatchBlockContext } from "./SpecmanModel_V002Parser.js";
import { CoCatchContext } from "./SpecmanModel_V002Parser.js";
import { EditContainerHeadContext } from "./SpecmanModel_V002Parser.js";
import { EditContainerTailContext } from "./SpecmanModel_V002Parser.js";
import { AreaContext } from "./SpecmanModel_V002Parser.js";
import { ListBlockContext } from "./SpecmanModel_V002Parser.js";
import { ListItemContext } from "./SpecmanModel_V002Parser.js";
import { ListItemTailContext } from "./SpecmanModel_V002Parser.js";
import { TextAreaContext } from "./SpecmanModel_V002Parser.js";
import { TableBlockContext } from "./SpecmanModel_V002Parser.js";
import { TableRowContext } from "./SpecmanModel_V002Parser.js";
import { TableCellContext } from "./SpecmanModel_V002Parser.js";
import { ImageBlockContext } from "./SpecmanModel_V002Parser.js";
import { BackupAttrContext } from "./SpecmanModel_V002Parser.js";
import { HtmlContentContext } from "./SpecmanModel_V002Parser.js";
import { PlainAttrContext } from "./SpecmanModel_V002Parser.js";
import { MarkupsAttrContext } from "./SpecmanModel_V002Parser.js";
import { MarkupContext } from "./SpecmanModel_V002Parser.js";
import { MarkupTypeContext } from "./SpecmanModel_V002Parser.js";
import { ChangeParamContext } from "./SpecmanModel_V002Parser.js";
import { DecoParamContext } from "./SpecmanModel_V002Parser.js";
import { ShadeParamContext } from "./SpecmanModel_V002Parser.js";
import { TagsParamContext } from "./SpecmanModel_V002Parser.js";
import { TagRefContext } from "./SpecmanModel_V002Parser.js";
import { TagIdContext } from "./SpecmanModel_V002Parser.js";
import { ChangeTypeContext } from "./SpecmanModel_V002Parser.js";
import { BoolValContext } from "./SpecmanModel_V002Parser.js";
import { StepNumContext } from "./SpecmanModel_V002Parser.js";
import { StepIdContext } from "./SpecmanModel_V002Parser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `SpecmanModel_V002Parser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class SpecmanModel_V002Visitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.diagram`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDiagram?: (ctx: DiagramContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.stepFragment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStepFragment?: (ctx: StepFragmentContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tableFragment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTableFragment?: (ctx: TableFragmentContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.settings`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSettings?: (ctx: SettingsContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.settingEntry`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSettingEntry?: (ctx: SettingEntryContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.pdfOptionEntry`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPdfOptionEntry?: (ctx: PdfOptionEntryContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.metaTagConfig`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMetaTagConfig?: (ctx: MetaTagConfigContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.freetextParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFreetextParam?: (ctx: FreetextParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.metaTagContent`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMetaTagContent?: (ctx: MetaTagContentContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.labelParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLabelParam?: (ctx: LabelParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.iconParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIconParam?: (ctx: IconParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.intro`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIntro?: (ctx: IntroContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.outro`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOutro?: (ctx: OutroContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.mainSequence`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMainSequence?: (ctx: MainSequenceContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.step`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStep?: (ctx: StepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.simpleStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSimpleStep?: (ctx: SimpleStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.breakStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBreakStep?: (ctx: BreakStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.sourceStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSourceStep?: (ctx: SourceStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.whileStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhileStep?: (ctx: WhileStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.doWhileStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDoWhileStep?: (ctx: DoWhileStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.ifElseStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfElseStep?: (ctx: IfElseStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.ifStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfStep?: (ctx: IfStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.caseStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCaseStep?: (ctx: CaseStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.subsequenceStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSubsequenceStep?: (ctx: SubsequenceStepContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.ifBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfBranch?: (ctx: IfBranchContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.elseBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElseBranch?: (ctx: ElseBranchContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.defaultBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDefaultBranch?: (ctx: DefaultBranchContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.caseBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCaseBranch?: (ctx: CaseBranchContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.catchArea`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCatchArea?: (ctx: CatchAreaContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.catchAreaParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCatchAreaParam?: (ctx: CatchAreaParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.catchBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCatchBlock?: (ctx: CatchBlockContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.coCatch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCoCatch?: (ctx: CoCatchContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.editContainerHead`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEditContainerHead?: (ctx: EditContainerHeadContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.editContainerTail`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEditContainerTail?: (ctx: EditContainerTailContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.area`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArea?: (ctx: AreaContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.listBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitListBlock?: (ctx: ListBlockContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.listItem`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitListItem?: (ctx: ListItemContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.listItemTail`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitListItemTail?: (ctx: ListItemTailContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.textArea`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTextArea?: (ctx: TextAreaContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tableBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTableBlock?: (ctx: TableBlockContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tableRow`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTableRow?: (ctx: TableRowContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tableCell`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTableCell?: (ctx: TableCellContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.imageBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitImageBlock?: (ctx: ImageBlockContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.backupAttr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBackupAttr?: (ctx: BackupAttrContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.htmlContent`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlContent?: (ctx: HtmlContentContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.plainAttr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPlainAttr?: (ctx: PlainAttrContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.markupsAttr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMarkupsAttr?: (ctx: MarkupsAttrContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.markup`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMarkup?: (ctx: MarkupContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.markupType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMarkupType?: (ctx: MarkupTypeContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.changeParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitChangeParam?: (ctx: ChangeParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.decoParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDecoParam?: (ctx: DecoParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.shadeParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitShadeParam?: (ctx: ShadeParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tagsParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTagsParam?: (ctx: TagsParamContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tagRef`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTagRef?: (ctx: TagRefContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.tagId`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTagId?: (ctx: TagIdContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.changeType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitChangeType?: (ctx: ChangeTypeContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.boolVal`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBoolVal?: (ctx: BoolValContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.stepNum`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStepNum?: (ctx: StepNumContext) => Result;
    /**
     * Visit a parse tree produced by `SpecmanModel_V002Parser.stepId`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStepId?: (ctx: StepIdContext) => Result;
}

