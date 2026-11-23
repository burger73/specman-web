// @ts-nocheck – generiert von antlr-ng (npm run gen:parser), nicht von Hand ändern

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { SpecmanModel_V002Visitor } from "./SpecmanModel_V002Visitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class SpecmanModel_V002Parser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly T__8 = 9;
    public static readonly T__9 = 10;
    public static readonly T__10 = 11;
    public static readonly T__11 = 12;
    public static readonly T__12 = 13;
    public static readonly T__13 = 14;
    public static readonly T__14 = 15;
    public static readonly T__15 = 16;
    public static readonly T__16 = 17;
    public static readonly T__17 = 18;
    public static readonly STEP_ID = 19;
    public static readonly INT = 20;
    public static readonly STEP_NUM = 21;
    public static readonly PERCENT = 22;
    public static readonly KW_SIMPLE = 23;
    public static readonly KW_BREAK = 24;
    public static readonly KW_WHILE = 25;
    public static readonly KW_DO_WHILE = 26;
    public static readonly KW_IF_ELSE = 27;
    public static readonly KW_IF = 28;
    public static readonly KW_CASE = 29;
    public static readonly KW_SUBSEQUENCE = 30;
    public static readonly KW_MAIN_SEQUENCE = 31;
    public static readonly KW_INTRO = 32;
    public static readonly KW_OUTRO = 33;
    public static readonly KW_SETTINGS = 34;
    public static readonly KW_IF_BRANCH = 35;
    public static readonly KW_ELSE_BRANCH = 36;
    public static readonly KW_DEFAULT_BRANCH = 37;
    public static readonly KW_CASE_BRANCH = 38;
    public static readonly KW_CATCH = 39;
    public static readonly KW_CO_CATCH = 40;
    public static readonly KW_LIST = 41;
    public static readonly KW_ITEM = 42;
    public static readonly KW_TABLE = 43;
    public static readonly KW_ROW = 44;
    public static readonly KW_CELL = 45;
    public static readonly KW_IMAGE = 46;
    public static readonly KW_PLANTUML = 47;
    public static readonly KW_SVG = 48;
    public static readonly KW_TEXT = 49;
    public static readonly KW_ORDERED = 50;
    public static readonly KW_FLAT = 51;
    public static readonly KW_COLS = 52;
    public static readonly KW_WIDTH = 53;
    public static readonly KW_ZOOM = 54;
    public static readonly KW_BAR_WIDTH = 55;
    public static readonly KW_IF_RATIO = 56;
    public static readonly KW_EMPTY_WIDTH = 57;
    public static readonly KW_PLAIN = 58;
    public static readonly KW_MARKUPS = 59;
    public static readonly KW_SCALE = 60;
    public static readonly KW_TYPE = 61;
    public static readonly KW_CHANGE = 62;
    public static readonly KW_SOURCE = 63;
    public static readonly KW_SOURCE_STEP = 64;
    public static readonly KW_BACKUP = 65;
    public static readonly KW_DECO = 66;
    public static readonly KW_SHADE = 67;
    public static readonly KW_COLLAPSED = 68;
    public static readonly KW_HEADING_WIDTH = 69;
    public static readonly KW_CATCH_AREA = 70;
    public static readonly KW_CHANGE_MODE = 71;
    public static readonly KW_CHANGESET_NAME = 72;
    public static readonly KW_PDF_OPTIONS = 73;
    public static readonly KW_FILENAME = 74;
    public static readonly KW_MODEL_FILENAME = 75;
    public static readonly KW_PAGE_SIZE = 76;
    public static readonly KW_PORTRAIT = 77;
    public static readonly KW_PAGING = 78;
    public static readonly KW_META_TAGS = 79;
    public static readonly KW_TAG = 80;
    public static readonly KW_TAGS = 81;
    public static readonly KW_LABEL = 82;
    public static readonly KW_BACKGROUND = 83;
    public static readonly KW_BORDER = 84;
    public static readonly KW_ICON = 85;
    public static readonly KW_FREETEXT = 86;
    public static readonly ID = 87;
    public static readonly COLOR_HEX = 88;
    public static readonly BACKTICK_STRING = 89;
    public static readonly BASE64_BLOCK = 90;
    public static readonly WS = 91;
    public static readonly ENVELOPE_COMMENT = 92;
    public static readonly LINE_COMMENT = 93;
    public static readonly RULE_diagram = 0;
    public static readonly RULE_stepFragment = 1;
    public static readonly RULE_tableFragment = 2;
    public static readonly RULE_settings = 3;
    public static readonly RULE_settingEntry = 4;
    public static readonly RULE_pdfOptionEntry = 5;
    public static readonly RULE_metaTagConfig = 6;
    public static readonly RULE_freetextParam = 7;
    public static readonly RULE_metaTagContent = 8;
    public static readonly RULE_labelParam = 9;
    public static readonly RULE_iconParam = 10;
    public static readonly RULE_intro = 11;
    public static readonly RULE_outro = 12;
    public static readonly RULE_mainSequence = 13;
    public static readonly RULE_step = 14;
    public static readonly RULE_simpleStep = 15;
    public static readonly RULE_breakStep = 16;
    public static readonly RULE_sourceStep = 17;
    public static readonly RULE_whileStep = 18;
    public static readonly RULE_doWhileStep = 19;
    public static readonly RULE_ifElseStep = 20;
    public static readonly RULE_ifStep = 21;
    public static readonly RULE_caseStep = 22;
    public static readonly RULE_subsequenceStep = 23;
    public static readonly RULE_ifBranch = 24;
    public static readonly RULE_elseBranch = 25;
    public static readonly RULE_defaultBranch = 26;
    public static readonly RULE_caseBranch = 27;
    public static readonly RULE_catchArea = 28;
    public static readonly RULE_catchAreaParam = 29;
    public static readonly RULE_catchBlock = 30;
    public static readonly RULE_coCatch = 31;
    public static readonly RULE_editContainerHead = 32;
    public static readonly RULE_editContainerTail = 33;
    public static readonly RULE_area = 34;
    public static readonly RULE_listBlock = 35;
    public static readonly RULE_listItem = 36;
    public static readonly RULE_listItemTail = 37;
    public static readonly RULE_textArea = 38;
    public static readonly RULE_tableBlock = 39;
    public static readonly RULE_tableRow = 40;
    public static readonly RULE_tableCell = 41;
    public static readonly RULE_imageBlock = 42;
    public static readonly RULE_backupAttr = 43;
    public static readonly RULE_htmlContent = 44;
    public static readonly RULE_plainAttr = 45;
    public static readonly RULE_markupsAttr = 46;
    public static readonly RULE_markup = 47;
    public static readonly RULE_markupType = 48;
    public static readonly RULE_changeParam = 49;
    public static readonly RULE_decoParam = 50;
    public static readonly RULE_shadeParam = 51;
    public static readonly RULE_tagsParam = 52;
    public static readonly RULE_tagRef = 53;
    public static readonly RULE_tagId = 54;
    public static readonly RULE_changeType = 55;
    public static readonly RULE_boolVal = 56;
    public static readonly RULE_stepNum = 57;
    public static readonly RULE_stepId = 58;

    public static readonly literalNames = [
        null, "'{'", "'}'", "'='", "'('", "','", "')'", "'false'", "';'", 
        "'true'", "'['", "']'", "'|'", "'Changed'", "'Steplink'", "'ChangedSteplink'", 
        "'added'", "'removed'", "'target'", null, null, null, null, "'simple'", 
        "'break'", "'while'", "'doWhile'", "'ifElse'", "'if'", "'case'", 
        "'subsequence'", "'mainSequence'", "'intro'", "'outro'", "'settings'", 
        "'if_branch'", "'else_branch'", "'default_branch'", "'case_branch'", 
        "'catch'", "'coCatch'", "'list'", "'item'", "'table'", "'row'", 
        "'cell'", "'image'", "'plantuml'", "'svg'", "'text'", "'ordered'", 
        "'flat'", "'cols'", "'width'", "'zoom'", "'barWidth'", "'ifRatio'", 
        "'emptyWidth'", "'plain'", "'markups'", "'scale'", "'type'", "'change'", 
        "'source'", "'sourceStep'", "'backup'", "'deco'", "'shade'", "'collapsed'", 
        "'headingWidth'", "'catchArea'", "'changeModeEnabled'", "'changeSetName'", 
        "'pdfOptions'", "'filename'", "'modelFilename'", "'pageSize'", "'portrait'", 
        "'paging'", "'metaTags'", "'tag'", "'tags'", "'label'", "'background'", 
        "'border'", "'icon'", "'freetext'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, "STEP_ID", "INT", 
        "STEP_NUM", "PERCENT", "KW_SIMPLE", "KW_BREAK", "KW_WHILE", "KW_DO_WHILE", 
        "KW_IF_ELSE", "KW_IF", "KW_CASE", "KW_SUBSEQUENCE", "KW_MAIN_SEQUENCE", 
        "KW_INTRO", "KW_OUTRO", "KW_SETTINGS", "KW_IF_BRANCH", "KW_ELSE_BRANCH", 
        "KW_DEFAULT_BRANCH", "KW_CASE_BRANCH", "KW_CATCH", "KW_CO_CATCH", 
        "KW_LIST", "KW_ITEM", "KW_TABLE", "KW_ROW", "KW_CELL", "KW_IMAGE", 
        "KW_PLANTUML", "KW_SVG", "KW_TEXT", "KW_ORDERED", "KW_FLAT", "KW_COLS", 
        "KW_WIDTH", "KW_ZOOM", "KW_BAR_WIDTH", "KW_IF_RATIO", "KW_EMPTY_WIDTH", 
        "KW_PLAIN", "KW_MARKUPS", "KW_SCALE", "KW_TYPE", "KW_CHANGE", "KW_SOURCE", 
        "KW_SOURCE_STEP", "KW_BACKUP", "KW_DECO", "KW_SHADE", "KW_COLLAPSED", 
        "KW_HEADING_WIDTH", "KW_CATCH_AREA", "KW_CHANGE_MODE", "KW_CHANGESET_NAME", 
        "KW_PDF_OPTIONS", "KW_FILENAME", "KW_MODEL_FILENAME", "KW_PAGE_SIZE", 
        "KW_PORTRAIT", "KW_PAGING", "KW_META_TAGS", "KW_TAG", "KW_TAGS", 
        "KW_LABEL", "KW_BACKGROUND", "KW_BORDER", "KW_ICON", "KW_FREETEXT", 
        "ID", "COLOR_HEX", "BACKTICK_STRING", "BASE64_BLOCK", "WS", "ENVELOPE_COMMENT", 
        "LINE_COMMENT"
    ];
    public static readonly ruleNames = [
        "diagram", "stepFragment", "tableFragment", "settings", "settingEntry", 
        "pdfOptionEntry", "metaTagConfig", "freetextParam", "metaTagContent", 
        "labelParam", "iconParam", "intro", "outro", "mainSequence", "step", 
        "simpleStep", "breakStep", "sourceStep", "whileStep", "doWhileStep", 
        "ifElseStep", "ifStep", "caseStep", "subsequenceStep", "ifBranch", 
        "elseBranch", "defaultBranch", "caseBranch", "catchArea", "catchAreaParam", 
        "catchBlock", "coCatch", "editContainerHead", "editContainerTail", 
        "area", "listBlock", "listItem", "listItemTail", "textArea", "tableBlock", 
        "tableRow", "tableCell", "imageBlock", "backupAttr", "htmlContent", 
        "plainAttr", "markupsAttr", "markup", "markupType", "changeParam", 
        "decoParam", "shadeParam", "tagsParam", "tagRef", "tagId", "changeType", 
        "boolVal", "stepNum", "stepId",
    ];

    public get grammarFileName(): string { return "SpecmanModel_V002.g4"; }
    public get literalNames(): (string | null)[] { return SpecmanModel_V002Parser.literalNames; }
    public get symbolicNames(): (string | null)[] { return SpecmanModel_V002Parser.symbolicNames; }
    public get ruleNames(): string[] { return SpecmanModel_V002Parser.ruleNames; }
    public get serializedATN(): number[] { return SpecmanModel_V002Parser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, SpecmanModel_V002Parser._ATN, SpecmanModel_V002Parser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public diagram(): DiagramContext {
        let localContext = new DiagramContext(this.context, this.state);
        this.enterRule(localContext, 0, SpecmanModel_V002Parser.RULE_diagram);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 119;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 34) {
                {
                this.state = 118;
                this.settings();
                }
            }

            this.state = 122;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 32) {
                {
                this.state = 121;
                this.intro();
                }
            }

            this.state = 124;
            this.mainSequence();
            this.state = 126;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 33) {
                {
                this.state = 125;
                this.outro();
                }
            }

            this.state = 128;
            this.match(SpecmanModel_V002Parser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public stepFragment(): StepFragmentContext {
        let localContext = new StepFragmentContext(this.context, this.state);
        this.enterRule(localContext, 2, SpecmanModel_V002Parser.RULE_stepFragment);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 131;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 130;
                this.step();
                }
                }
                this.state = 133;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 135;
            this.match(SpecmanModel_V002Parser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableFragment(): TableFragmentContext {
        let localContext = new TableFragmentContext(this.context, this.state);
        this.enterRule(localContext, 4, SpecmanModel_V002Parser.RULE_tableFragment);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 137;
            this.tableBlock();
            this.state = 138;
            this.match(SpecmanModel_V002Parser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public settings(): SettingsContext {
        let localContext = new SettingsContext(this.context, this.state);
        this.enterRule(localContext, 6, SpecmanModel_V002Parser.RULE_settings);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 140;
            this.match(SpecmanModel_V002Parser.KW_SETTINGS);
            this.state = 141;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 145;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 68943875) !== 0)) {
                {
                {
                this.state = 142;
                this.settingEntry();
                }
                }
                this.state = 147;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 148;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public settingEntry(): SettingEntryContext {
        let localContext = new SettingEntryContext(this.context, this.state);
        this.enterRule(localContext, 8, SpecmanModel_V002Parser.RULE_settingEntry);
        let _la: number;
        try {
            this.state = 180;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_WIDTH:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 150;
                this.match(SpecmanModel_V002Parser.KW_WIDTH);
                this.state = 151;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 152;
                this.match(SpecmanModel_V002Parser.INT);
                }
                break;
            case SpecmanModel_V002Parser.KW_ZOOM:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 153;
                this.match(SpecmanModel_V002Parser.KW_ZOOM);
                this.state = 154;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 155;
                this.match(SpecmanModel_V002Parser.INT);
                }
                break;
            case SpecmanModel_V002Parser.KW_CHANGE_MODE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 156;
                this.match(SpecmanModel_V002Parser.KW_CHANGE_MODE);
                this.state = 157;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 158;
                this.boolVal();
                }
                break;
            case SpecmanModel_V002Parser.KW_CHANGESET_NAME:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 159;
                this.match(SpecmanModel_V002Parser.KW_CHANGESET_NAME);
                this.state = 160;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 161;
                this.match(SpecmanModel_V002Parser.ID);
                }
                break;
            case SpecmanModel_V002Parser.KW_PDF_OPTIONS:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 162;
                this.match(SpecmanModel_V002Parser.KW_PDF_OPTIONS);
                this.state = 163;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 167;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (((((_la - 74)) & ~0x1F) === 0 && ((1 << (_la - 74)) & 31) !== 0)) {
                    {
                    {
                    this.state = 164;
                    this.pdfOptionEntry();
                    }
                    }
                    this.state = 169;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 170;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            case SpecmanModel_V002Parser.KW_META_TAGS:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 171;
                this.match(SpecmanModel_V002Parser.KW_META_TAGS);
                this.state = 172;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 174;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 173;
                    this.metaTagConfig();
                    }
                    }
                    this.state = 176;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 80);
                this.state = 178;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public pdfOptionEntry(): PdfOptionEntryContext {
        let localContext = new PdfOptionEntryContext(this.context, this.state);
        this.enterRule(localContext, 10, SpecmanModel_V002Parser.RULE_pdfOptionEntry);
        try {
            this.state = 197;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_FILENAME:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 182;
                this.match(SpecmanModel_V002Parser.KW_FILENAME);
                this.state = 183;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 184;
                this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
                }
                break;
            case SpecmanModel_V002Parser.KW_MODEL_FILENAME:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 185;
                this.match(SpecmanModel_V002Parser.KW_MODEL_FILENAME);
                this.state = 186;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 187;
                this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
                }
                break;
            case SpecmanModel_V002Parser.KW_PAGE_SIZE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 188;
                this.match(SpecmanModel_V002Parser.KW_PAGE_SIZE);
                this.state = 189;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 190;
                this.match(SpecmanModel_V002Parser.ID);
                }
                break;
            case SpecmanModel_V002Parser.KW_PORTRAIT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 191;
                this.match(SpecmanModel_V002Parser.KW_PORTRAIT);
                this.state = 192;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 193;
                this.boolVal();
                }
                break;
            case SpecmanModel_V002Parser.KW_PAGING:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 194;
                this.match(SpecmanModel_V002Parser.KW_PAGING);
                this.state = 195;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 196;
                this.boolVal();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public metaTagConfig(): MetaTagConfigContext {
        let localContext = new MetaTagConfigContext(this.context, this.state);
        this.enterRule(localContext, 12, SpecmanModel_V002Parser.RULE_metaTagConfig);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 199;
            this.match(SpecmanModel_V002Parser.KW_TAG);
            this.state = 200;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 201;
            this.tagId();
            this.state = 202;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 203;
            this.match(SpecmanModel_V002Parser.KW_BACKGROUND);
            this.state = 204;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 205;
            this.match(SpecmanModel_V002Parser.COLOR_HEX);
            this.state = 210;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 9, this.context) ) {
            case 1:
                {
                this.state = 206;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 207;
                this.match(SpecmanModel_V002Parser.KW_BORDER);
                this.state = 208;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 209;
                this.match(SpecmanModel_V002Parser.COLOR_HEX);
                }
                break;
            }
            this.state = 212;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 213;
            this.metaTagContent();
            this.state = 216;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 214;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 215;
                this.freetextParam();
                }
            }

            this.state = 218;
            this.match(SpecmanModel_V002Parser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public freetextParam(): FreetextParamContext {
        let localContext = new FreetextParamContext(this.context, this.state);
        this.enterRule(localContext, 14, SpecmanModel_V002Parser.RULE_freetextParam);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 220;
            this.match(SpecmanModel_V002Parser.KW_FREETEXT);
            this.state = 221;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 222;
            this.match(SpecmanModel_V002Parser.T__6);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public metaTagContent(): MetaTagContentContext {
        let localContext = new MetaTagContentContext(this.context, this.state);
        this.enterRule(localContext, 16, SpecmanModel_V002Parser.RULE_metaTagContent);
        try {
            this.state = 230;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_LABEL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 224;
                this.labelParam();
                this.state = 227;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 11, this.context) ) {
                case 1:
                    {
                    this.state = 225;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 226;
                    this.iconParam();
                    }
                    break;
                }
                }
                break;
            case SpecmanModel_V002Parser.KW_ICON:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 229;
                this.iconParam();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public labelParam(): LabelParamContext {
        let localContext = new LabelParamContext(this.context, this.state);
        this.enterRule(localContext, 18, SpecmanModel_V002Parser.RULE_labelParam);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 232;
            this.match(SpecmanModel_V002Parser.KW_LABEL);
            this.state = 233;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 234;
            this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public iconParam(): IconParamContext {
        let localContext = new IconParamContext(this.context, this.state);
        this.enterRule(localContext, 20, SpecmanModel_V002Parser.RULE_iconParam);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 236;
            this.match(SpecmanModel_V002Parser.KW_ICON);
            this.state = 237;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 238;
            this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public intro(): IntroContext {
        let localContext = new IntroContext(this.context, this.state);
        this.enterRule(localContext, 22, SpecmanModel_V002Parser.RULE_intro);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 240;
            this.match(SpecmanModel_V002Parser.KW_INTRO);
            this.state = 241;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 242;
            this.editContainerHead();
            this.state = 243;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 244;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 245;
            this.editContainerTail();
            this.state = 246;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public outro(): OutroContext {
        let localContext = new OutroContext(this.context, this.state);
        this.enterRule(localContext, 24, SpecmanModel_V002Parser.RULE_outro);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 248;
            this.match(SpecmanModel_V002Parser.KW_OUTRO);
            this.state = 249;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 250;
            this.editContainerHead();
            this.state = 251;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 252;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 253;
            this.editContainerTail();
            this.state = 254;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public mainSequence(): MainSequenceContext {
        let localContext = new MainSequenceContext(this.context, this.state);
        this.enterRule(localContext, 26, SpecmanModel_V002Parser.RULE_mainSequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 256;
            this.match(SpecmanModel_V002Parser.KW_MAIN_SEQUENCE);
            this.state = 257;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 259;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 258;
                this.step();
                }
                }
                this.state = 261;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 264;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 39 || _la === 70) {
                {
                this.state = 263;
                this.catchArea();
                }
            }

            this.state = 266;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public step(): StepContext {
        let localContext = new StepContext(this.context, this.state);
        this.enterRule(localContext, 28, SpecmanModel_V002Parser.RULE_step);
        try {
            this.state = 277;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_SIMPLE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 268;
                this.simpleStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_BREAK:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 269;
                this.breakStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_SOURCE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 270;
                this.sourceStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_WHILE:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 271;
                this.whileStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_DO_WHILE:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 272;
                this.doWhileStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_IF_ELSE:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 273;
                this.ifElseStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_IF:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 274;
                this.ifStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_CASE:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 275;
                this.caseStep();
                }
                break;
            case SpecmanModel_V002Parser.KW_SUBSEQUENCE:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 276;
                this.subsequenceStep();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public simpleStep(): SimpleStepContext {
        let localContext = new SimpleStepContext(this.context, this.state);
        this.enterRule(localContext, 30, SpecmanModel_V002Parser.RULE_simpleStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 279;
            this.match(SpecmanModel_V002Parser.KW_SIMPLE);
            this.state = 280;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 281;
            this.stepNum();
            this.state = 282;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 283;
            this.stepId();
            this.state = 284;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 285;
            this.editContainerHead();
            this.state = 288;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 16, this.context) ) {
            case 1:
                {
                this.state = 286;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 287;
                this.changeParam();
                }
                break;
            }
            this.state = 292;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                {
                this.state = 290;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 291;
                this.decoParam();
                }
                break;
            }
            this.state = 296;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 18, this.context) ) {
            case 1:
                {
                this.state = 294;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 295;
                this.shadeParam();
                }
                break;
            }
            this.state = 300;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 298;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 299;
                this.tagsParam();
                }
            }

            this.state = 302;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 308;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.T__7:
                {
                this.state = 303;
                this.match(SpecmanModel_V002Parser.T__7);
                }
                break;
            case SpecmanModel_V002Parser.T__0:
                {
                this.state = 304;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 305;
                this.editContainerTail();
                this.state = 306;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public breakStep(): BreakStepContext {
        let localContext = new BreakStepContext(this.context, this.state);
        this.enterRule(localContext, 32, SpecmanModel_V002Parser.RULE_breakStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 310;
            this.match(SpecmanModel_V002Parser.KW_BREAK);
            this.state = 311;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 312;
            this.stepNum();
            this.state = 313;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 314;
            this.stepId();
            this.state = 315;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 316;
            this.editContainerHead();
            this.state = 319;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 21, this.context) ) {
            case 1:
                {
                this.state = 317;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 318;
                this.changeParam();
                }
                break;
            }
            this.state = 323;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 22, this.context) ) {
            case 1:
                {
                this.state = 321;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 322;
                this.decoParam();
                }
                break;
            }
            this.state = 327;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 23, this.context) ) {
            case 1:
                {
                this.state = 325;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 326;
                this.shadeParam();
                }
                break;
            }
            this.state = 331;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 329;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 330;
                this.tagsParam();
                }
            }

            this.state = 333;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 339;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.T__7:
                {
                this.state = 334;
                this.match(SpecmanModel_V002Parser.T__7);
                }
                break;
            case SpecmanModel_V002Parser.T__0:
                {
                this.state = 335;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 336;
                this.editContainerTail();
                this.state = 337;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sourceStep(): SourceStepContext {
        let localContext = new SourceStepContext(this.context, this.state);
        this.enterRule(localContext, 34, SpecmanModel_V002Parser.RULE_sourceStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 341;
            this.match(SpecmanModel_V002Parser.KW_SOURCE);
            this.state = 342;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 343;
            this.stepNum();
            this.state = 344;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 345;
            this.stepId();
            this.state = 346;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 347;
            this.editContainerHead();
            this.state = 348;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 349;
            this.match(SpecmanModel_V002Parser.ID);
            this.state = 354;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 26, this.context) ) {
            case 1:
                {
                this.state = 350;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 351;
                this.match(SpecmanModel_V002Parser.KW_SOURCE_STEP);
                this.state = 352;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 353;
                this.match(SpecmanModel_V002Parser.STEP_ID);
                }
                break;
            }
            this.state = 358;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 27, this.context) ) {
            case 1:
                {
                this.state = 356;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 357;
                this.decoParam();
                }
                break;
            }
            this.state = 362;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 28, this.context) ) {
            case 1:
                {
                this.state = 360;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 361;
                this.shadeParam();
                }
                break;
            }
            this.state = 366;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 364;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 365;
                this.tagsParam();
                }
            }

            this.state = 368;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 374;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.T__7:
                {
                this.state = 369;
                this.match(SpecmanModel_V002Parser.T__7);
                }
                break;
            case SpecmanModel_V002Parser.T__0:
                {
                this.state = 370;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 371;
                this.editContainerTail();
                this.state = 372;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whileStep(): WhileStepContext {
        let localContext = new WhileStepContext(this.context, this.state);
        this.enterRule(localContext, 36, SpecmanModel_V002Parser.RULE_whileStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 376;
            this.match(SpecmanModel_V002Parser.KW_WHILE);
            this.state = 377;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 378;
            this.stepNum();
            this.state = 379;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 380;
            this.stepId();
            this.state = 381;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 382;
            this.editContainerHead();
            this.state = 387;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 31, this.context) ) {
            case 1:
                {
                this.state = 383;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 384;
                this.match(SpecmanModel_V002Parser.KW_BAR_WIDTH);
                this.state = 385;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 386;
                this.match(SpecmanModel_V002Parser.INT);
                }
                break;
            }
            this.state = 393;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 32, this.context) ) {
            case 1:
                {
                this.state = 389;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 390;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 391;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 392;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 397;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 33, this.context) ) {
            case 1:
                {
                this.state = 395;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 396;
                this.changeParam();
                }
                break;
            }
            this.state = 401;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 34, this.context) ) {
            case 1:
                {
                this.state = 399;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 400;
                this.decoParam();
                }
                break;
            }
            this.state = 405;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 35, this.context) ) {
            case 1:
                {
                this.state = 403;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 404;
                this.shadeParam();
                }
                break;
            }
            this.state = 409;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 407;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 408;
                this.tagsParam();
                }
            }

            this.state = 411;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 412;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 413;
            this.editContainerTail();
            this.state = 415;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 414;
                this.step();
                }
                }
                this.state = 417;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 420;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 39 || _la === 70) {
                {
                this.state = 419;
                this.catchArea();
                }
            }

            this.state = 422;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public doWhileStep(): DoWhileStepContext {
        let localContext = new DoWhileStepContext(this.context, this.state);
        this.enterRule(localContext, 38, SpecmanModel_V002Parser.RULE_doWhileStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 424;
            this.match(SpecmanModel_V002Parser.KW_DO_WHILE);
            this.state = 425;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 426;
            this.stepNum();
            this.state = 427;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 428;
            this.stepId();
            this.state = 429;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 430;
            this.editContainerHead();
            this.state = 435;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 39, this.context) ) {
            case 1:
                {
                this.state = 431;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 432;
                this.match(SpecmanModel_V002Parser.KW_BAR_WIDTH);
                this.state = 433;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 434;
                this.match(SpecmanModel_V002Parser.INT);
                }
                break;
            }
            this.state = 441;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 40, this.context) ) {
            case 1:
                {
                this.state = 437;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 438;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 439;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 440;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 445;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 41, this.context) ) {
            case 1:
                {
                this.state = 443;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 444;
                this.changeParam();
                }
                break;
            }
            this.state = 449;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 42, this.context) ) {
            case 1:
                {
                this.state = 447;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 448;
                this.decoParam();
                }
                break;
            }
            this.state = 453;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 43, this.context) ) {
            case 1:
                {
                this.state = 451;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 452;
                this.shadeParam();
                }
                break;
            }
            this.state = 457;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 455;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 456;
                this.tagsParam();
                }
            }

            this.state = 459;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 460;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 461;
            this.editContainerTail();
            this.state = 463;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 462;
                this.step();
                }
                }
                this.state = 465;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 467;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifElseStep(): IfElseStepContext {
        let localContext = new IfElseStepContext(this.context, this.state);
        this.enterRule(localContext, 40, SpecmanModel_V002Parser.RULE_ifElseStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 469;
            this.match(SpecmanModel_V002Parser.KW_IF_ELSE);
            this.state = 470;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 471;
            this.stepNum();
            this.state = 472;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 473;
            this.stepId();
            this.state = 474;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 475;
            this.editContainerHead();
            this.state = 480;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 46, this.context) ) {
            case 1:
                {
                this.state = 476;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 477;
                this.match(SpecmanModel_V002Parser.KW_IF_RATIO);
                this.state = 478;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 479;
                this.match(SpecmanModel_V002Parser.PERCENT);
                }
                break;
            }
            this.state = 486;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 47, this.context) ) {
            case 1:
                {
                this.state = 482;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 483;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 484;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 485;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 490;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 48, this.context) ) {
            case 1:
                {
                this.state = 488;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 489;
                this.changeParam();
                }
                break;
            }
            this.state = 494;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 49, this.context) ) {
            case 1:
                {
                this.state = 492;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 493;
                this.decoParam();
                }
                break;
            }
            this.state = 498;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 50, this.context) ) {
            case 1:
                {
                this.state = 496;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 497;
                this.shadeParam();
                }
                break;
            }
            this.state = 502;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 500;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 501;
                this.tagsParam();
                }
            }

            this.state = 504;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 505;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 506;
            this.editContainerTail();
            this.state = 507;
            this.ifBranch();
            this.state = 508;
            this.elseBranch();
            this.state = 509;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStep(): IfStepContext {
        let localContext = new IfStepContext(this.context, this.state);
        this.enterRule(localContext, 42, SpecmanModel_V002Parser.RULE_ifStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 511;
            this.match(SpecmanModel_V002Parser.KW_IF);
            this.state = 512;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 513;
            this.stepNum();
            this.state = 514;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 515;
            this.stepId();
            this.state = 516;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 517;
            this.editContainerHead();
            this.state = 522;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 52, this.context) ) {
            case 1:
                {
                this.state = 518;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 519;
                this.match(SpecmanModel_V002Parser.KW_EMPTY_WIDTH);
                this.state = 520;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 521;
                this.match(SpecmanModel_V002Parser.INT);
                }
                break;
            }
            this.state = 528;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 53, this.context) ) {
            case 1:
                {
                this.state = 524;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 525;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 526;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 527;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 532;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 54, this.context) ) {
            case 1:
                {
                this.state = 530;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 531;
                this.changeParam();
                }
                break;
            }
            this.state = 536;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 55, this.context) ) {
            case 1:
                {
                this.state = 534;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 535;
                this.decoParam();
                }
                break;
            }
            this.state = 540;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 56, this.context) ) {
            case 1:
                {
                this.state = 538;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 539;
                this.shadeParam();
                }
                break;
            }
            this.state = 544;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 542;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 543;
                this.tagsParam();
                }
            }

            this.state = 546;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 547;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 548;
            this.editContainerTail();
            this.state = 549;
            this.ifBranch();
            this.state = 550;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public caseStep(): CaseStepContext {
        let localContext = new CaseStepContext(this.context, this.state);
        this.enterRule(localContext, 44, SpecmanModel_V002Parser.RULE_caseStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 552;
            this.match(SpecmanModel_V002Parser.KW_CASE);
            this.state = 553;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 554;
            this.stepNum();
            this.state = 555;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 556;
            this.stepId();
            this.state = 557;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 558;
            this.editContainerHead();
            this.state = 572;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 59, this.context) ) {
            case 1:
                {
                this.state = 559;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 560;
                this.match(SpecmanModel_V002Parser.KW_COLS);
                this.state = 561;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 562;
                this.match(SpecmanModel_V002Parser.T__9);
                this.state = 563;
                this.match(SpecmanModel_V002Parser.PERCENT);
                this.state = 568;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 5) {
                    {
                    {
                    this.state = 564;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 565;
                    this.match(SpecmanModel_V002Parser.PERCENT);
                    }
                    }
                    this.state = 570;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 571;
                this.match(SpecmanModel_V002Parser.T__10);
                }
                break;
            }
            this.state = 578;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 60, this.context) ) {
            case 1:
                {
                this.state = 574;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 575;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 576;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 577;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 582;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 61, this.context) ) {
            case 1:
                {
                this.state = 580;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 581;
                this.changeParam();
                }
                break;
            }
            this.state = 586;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 62, this.context) ) {
            case 1:
                {
                this.state = 584;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 585;
                this.decoParam();
                }
                break;
            }
            this.state = 590;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 63, this.context) ) {
            case 1:
                {
                this.state = 588;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 589;
                this.shadeParam();
                }
                break;
            }
            this.state = 594;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 592;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 593;
                this.tagsParam();
                }
            }

            this.state = 596;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 597;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 598;
            this.editContainerTail();
            this.state = 599;
            this.defaultBranch();
            this.state = 600;
            this.caseBranch();
            this.state = 602;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 601;
                this.caseBranch();
                }
                }
                this.state = 604;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 38);
            this.state = 606;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public subsequenceStep(): SubsequenceStepContext {
        let localContext = new SubsequenceStepContext(this.context, this.state);
        this.enterRule(localContext, 46, SpecmanModel_V002Parser.RULE_subsequenceStep);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 608;
            this.match(SpecmanModel_V002Parser.KW_SUBSEQUENCE);
            this.state = 609;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 610;
            this.stepNum();
            this.state = 611;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 612;
            this.stepId();
            this.state = 613;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 614;
            this.editContainerHead();
            this.state = 619;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 66, this.context) ) {
            case 1:
                {
                this.state = 615;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 616;
                this.match(SpecmanModel_V002Parser.KW_FLAT);
                this.state = 617;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 618;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 625;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 67, this.context) ) {
            case 1:
                {
                this.state = 621;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 622;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 623;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 624;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            }
            this.state = 629;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 68, this.context) ) {
            case 1:
                {
                this.state = 627;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 628;
                this.changeParam();
                }
                break;
            }
            this.state = 633;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 69, this.context) ) {
            case 1:
                {
                this.state = 631;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 632;
                this.decoParam();
                }
                break;
            }
            this.state = 637;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 70, this.context) ) {
            case 1:
                {
                this.state = 635;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 636;
                this.shadeParam();
                }
                break;
            }
            this.state = 641;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 639;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 640;
                this.tagsParam();
                }
            }

            this.state = 643;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 644;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 645;
            this.editContainerTail();
            this.state = 647;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 646;
                this.step();
                }
                }
                this.state = 649;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 652;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 39 || _la === 70) {
                {
                this.state = 651;
                this.catchArea();
                }
            }

            this.state = 654;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifBranch(): IfBranchContext {
        let localContext = new IfBranchContext(this.context, this.state);
        this.enterRule(localContext, 48, SpecmanModel_V002Parser.RULE_ifBranch);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 656;
            this.match(SpecmanModel_V002Parser.KW_IF_BRANCH);
            this.state = 657;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 658;
            this.editContainerHead();
            this.state = 661;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 659;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 660;
                this.changeParam();
                }
            }

            this.state = 663;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 664;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 665;
            this.editContainerTail();
            this.state = 667;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 666;
                this.step();
                }
                }
                this.state = 669;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 672;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 39 || _la === 70) {
                {
                this.state = 671;
                this.catchArea();
                }
            }

            this.state = 674;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elseBranch(): ElseBranchContext {
        let localContext = new ElseBranchContext(this.context, this.state);
        this.enterRule(localContext, 50, SpecmanModel_V002Parser.RULE_elseBranch);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 676;
            this.match(SpecmanModel_V002Parser.KW_ELSE_BRANCH);
            this.state = 677;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 678;
            this.editContainerHead();
            this.state = 681;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 679;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 680;
                this.changeParam();
                }
            }

            this.state = 683;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 684;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 685;
            this.editContainerTail();
            this.state = 687;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 686;
                this.step();
                }
                }
                this.state = 689;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 692;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 39 || _la === 70) {
                {
                this.state = 691;
                this.catchArea();
                }
            }

            this.state = 694;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public defaultBranch(): DefaultBranchContext {
        let localContext = new DefaultBranchContext(this.context, this.state);
        this.enterRule(localContext, 52, SpecmanModel_V002Parser.RULE_defaultBranch);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 696;
            this.match(SpecmanModel_V002Parser.KW_DEFAULT_BRANCH);
            this.state = 697;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 698;
            this.editContainerHead();
            this.state = 701;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 699;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 700;
                this.changeParam();
                }
            }

            this.state = 703;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 704;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 705;
            this.editContainerTail();
            this.state = 707;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 706;
                this.step();
                }
                }
                this.state = 709;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 711;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public caseBranch(): CaseBranchContext {
        let localContext = new CaseBranchContext(this.context, this.state);
        this.enterRule(localContext, 54, SpecmanModel_V002Parser.RULE_caseBranch);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 713;
            this.match(SpecmanModel_V002Parser.KW_CASE_BRANCH);
            this.state = 714;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 715;
            this.editContainerHead();
            this.state = 718;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 716;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 717;
                this.changeParam();
                }
            }

            this.state = 720;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 721;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 722;
            this.editContainerTail();
            this.state = 724;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 723;
                this.step();
                }
                }
                this.state = 726;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 728;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public catchArea(): CatchAreaContext {
        let localContext = new CatchAreaContext(this.context, this.state);
        this.enterRule(localContext, 56, SpecmanModel_V002Parser.RULE_catchArea);
        let _la: number;
        try {
            this.state = 757;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_CATCH_AREA:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 730;
                this.match(SpecmanModel_V002Parser.KW_CATCH_AREA);
                this.state = 742;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 4) {
                    {
                    this.state = 731;
                    this.match(SpecmanModel_V002Parser.T__3);
                    this.state = 732;
                    this.catchAreaParam();
                    this.state = 737;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 5) {
                        {
                        {
                        this.state = 733;
                        this.match(SpecmanModel_V002Parser.T__4);
                        this.state = 734;
                        this.catchAreaParam();
                        }
                        }
                        this.state = 739;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 740;
                    this.match(SpecmanModel_V002Parser.T__5);
                    }
                }

                this.state = 744;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 746;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 745;
                    this.catchBlock();
                    }
                    }
                    this.state = 748;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 39);
                this.state = 750;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            case SpecmanModel_V002Parser.KW_CATCH:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 753;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 752;
                    this.catchBlock();
                    }
                    }
                    this.state = 755;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 39);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public catchAreaParam(): CatchAreaParamContext {
        let localContext = new CatchAreaParamContext(this.context, this.state);
        this.enterRule(localContext, 58, SpecmanModel_V002Parser.RULE_catchAreaParam);
        let _la: number;
        try {
            this.state = 774;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_COLLAPSED:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 759;
                this.match(SpecmanModel_V002Parser.KW_COLLAPSED);
                this.state = 760;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 761;
                this.match(SpecmanModel_V002Parser.T__8);
                }
                break;
            case SpecmanModel_V002Parser.KW_COLS:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 762;
                this.match(SpecmanModel_V002Parser.KW_COLS);
                this.state = 763;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 764;
                this.match(SpecmanModel_V002Parser.T__9);
                this.state = 765;
                this.match(SpecmanModel_V002Parser.PERCENT);
                this.state = 770;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 5) {
                    {
                    {
                    this.state = 766;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 767;
                    this.match(SpecmanModel_V002Parser.PERCENT);
                    }
                    }
                    this.state = 772;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 773;
                this.match(SpecmanModel_V002Parser.T__10);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public catchBlock(): CatchBlockContext {
        let localContext = new CatchBlockContext(this.context, this.state);
        this.enterRule(localContext, 60, SpecmanModel_V002Parser.RULE_catchBlock);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 776;
            this.match(SpecmanModel_V002Parser.KW_CATCH);
            this.state = 777;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 778;
            this.stepNum();
            this.state = 779;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 780;
            this.editContainerHead();
            this.state = 783;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 91, this.context) ) {
            case 1:
                {
                this.state = 781;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 782;
                this.changeParam();
                }
                break;
            }
            this.state = 789;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 785;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 786;
                this.match(SpecmanModel_V002Parser.KW_HEADING_WIDTH);
                this.state = 787;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 788;
                this.match(SpecmanModel_V002Parser.INT);
                }
            }

            this.state = 791;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 792;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 793;
            this.editContainerTail();
            this.state = 797;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 40) {
                {
                {
                this.state = 794;
                this.coCatch();
                }
                }
                this.state = 799;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 801;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 800;
                this.step();
                }
                }
                this.state = 803;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2139095040) !== 0) || _la === 63);
            this.state = 805;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public coCatch(): CoCatchContext {
        let localContext = new CoCatchContext(this.context, this.state);
        this.enterRule(localContext, 62, SpecmanModel_V002Parser.RULE_coCatch);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 807;
            this.match(SpecmanModel_V002Parser.KW_CO_CATCH);
            this.state = 808;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 809;
            this.stepNum();
            this.state = 810;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 811;
            this.editContainerHead();
            this.state = 814;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 812;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 813;
                this.changeParam();
                }
            }

            this.state = 816;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 817;
            this.match(SpecmanModel_V002Parser.T__7);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public editContainerHead(): EditContainerHeadContext {
        let localContext = new EditContainerHeadContext(this.context, this.state);
        this.enterRule(localContext, 64, SpecmanModel_V002Parser.RULE_editContainerHead);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 819;
            this.htmlContent();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public editContainerTail(): EditContainerTailContext {
        let localContext = new EditContainerTailContext(this.context, this.state);
        this.enterRule(localContext, 66, SpecmanModel_V002Parser.RULE_editContainerTail);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 824;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 293) !== 0)) {
                {
                {
                this.state = 821;
                this.area();
                }
                }
                this.state = 826;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public area(): AreaContext {
        let localContext = new AreaContext(this.context, this.state);
        this.enterRule(localContext, 68, SpecmanModel_V002Parser.RULE_area);
        try {
            this.state = 831;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SpecmanModel_V002Parser.KW_LIST:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 827;
                this.listBlock();
                }
                break;
            case SpecmanModel_V002Parser.KW_TEXT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 828;
                this.textArea();
                }
                break;
            case SpecmanModel_V002Parser.KW_TABLE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 829;
                this.tableBlock();
                }
                break;
            case SpecmanModel_V002Parser.KW_IMAGE:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 830;
                this.imageBlock();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public listBlock(): ListBlockContext {
        let localContext = new ListBlockContext(this.context, this.state);
        this.enterRule(localContext, 70, SpecmanModel_V002Parser.RULE_listBlock);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 833;
            this.match(SpecmanModel_V002Parser.KW_LIST);
            this.state = 834;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 835;
            this.match(SpecmanModel_V002Parser.KW_ORDERED);
            this.state = 836;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 837;
            this.boolVal();
            this.state = 838;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 839;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 843;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 42) {
                {
                {
                this.state = 840;
                this.listItem();
                }
                }
                this.state = 845;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 846;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public listItem(): ListItemContext {
        let localContext = new ListItemContext(this.context, this.state);
        this.enterRule(localContext, 72, SpecmanModel_V002Parser.RULE_listItem);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 848;
            this.match(SpecmanModel_V002Parser.KW_ITEM);
            this.state = 849;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 850;
            this.editContainerHead();
            this.state = 853;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 851;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 852;
                this.changeParam();
                }
            }

            this.state = 855;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 860;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 856;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 857;
                this.listItemTail();
                this.state = 858;
                this.match(SpecmanModel_V002Parser.T__1);
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public listItemTail(): ListItemTailContext {
        let localContext = new ListItemTailContext(this.context, this.state);
        this.enterRule(localContext, 74, SpecmanModel_V002Parser.RULE_listItemTail);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 867;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 43)) & ~0x1F) === 0 && ((1 << (_la - 43)) & 73) !== 0)) {
                {
                this.state = 865;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case SpecmanModel_V002Parser.KW_TEXT:
                    {
                    this.state = 862;
                    this.textArea();
                    }
                    break;
                case SpecmanModel_V002Parser.KW_TABLE:
                    {
                    this.state = 863;
                    this.tableBlock();
                    }
                    break;
                case SpecmanModel_V002Parser.KW_IMAGE:
                    {
                    this.state = 864;
                    this.imageBlock();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                this.state = 869;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public textArea(): TextAreaContext {
        let localContext = new TextAreaContext(this.context, this.state);
        this.enterRule(localContext, 76, SpecmanModel_V002Parser.RULE_textArea);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 870;
            this.match(SpecmanModel_V002Parser.KW_TEXT);
            this.state = 871;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 872;
            this.htmlContent();
            this.state = 875;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 873;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 874;
                this.changeParam();
                }
            }

            this.state = 877;
            this.match(SpecmanModel_V002Parser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableBlock(): TableBlockContext {
        let localContext = new TableBlockContext(this.context, this.state);
        this.enterRule(localContext, 78, SpecmanModel_V002Parser.RULE_tableBlock);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 879;
            this.match(SpecmanModel_V002Parser.KW_TABLE);
            this.state = 880;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 881;
            this.match(SpecmanModel_V002Parser.KW_WIDTH);
            this.state = 882;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 883;
            this.match(SpecmanModel_V002Parser.PERCENT);
            this.state = 897;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 105, this.context) ) {
            case 1:
                {
                this.state = 884;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 885;
                this.match(SpecmanModel_V002Parser.KW_COLS);
                this.state = 886;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 887;
                this.match(SpecmanModel_V002Parser.T__9);
                this.state = 888;
                this.match(SpecmanModel_V002Parser.PERCENT);
                this.state = 893;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 5) {
                    {
                    {
                    this.state = 889;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 890;
                    this.match(SpecmanModel_V002Parser.PERCENT);
                    }
                    }
                    this.state = 895;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 896;
                this.match(SpecmanModel_V002Parser.T__10);
                }
                break;
            }
            this.state = 901;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 899;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 900;
                this.changeParam();
                }
            }

            this.state = 903;
            this.match(SpecmanModel_V002Parser.T__5);
            this.state = 904;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 908;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 44) {
                {
                {
                this.state = 905;
                this.tableRow();
                }
                }
                this.state = 910;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 911;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableRow(): TableRowContext {
        let localContext = new TableRowContext(this.context, this.state);
        this.enterRule(localContext, 80, SpecmanModel_V002Parser.RULE_tableRow);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 913;
            this.match(SpecmanModel_V002Parser.KW_ROW);
            this.state = 914;
            this.match(SpecmanModel_V002Parser.T__0);
            this.state = 915;
            this.tableCell();
            this.state = 920;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 12) {
                {
                {
                this.state = 916;
                this.match(SpecmanModel_V002Parser.T__11);
                this.state = 917;
                this.tableCell();
                }
                }
                this.state = 922;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 923;
            this.match(SpecmanModel_V002Parser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableCell(): TableCellContext {
        let localContext = new TableCellContext(this.context, this.state);
        this.enterRule(localContext, 82, SpecmanModel_V002Parser.RULE_tableCell);
        let _la: number;
        try {
            this.state = 946;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 111, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 925;
                this.match(SpecmanModel_V002Parser.KW_CELL);
                this.state = 926;
                this.match(SpecmanModel_V002Parser.T__3);
                this.state = 927;
                this.editContainerHead();
                this.state = 930;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 5) {
                    {
                    this.state = 928;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 929;
                    this.changeParam();
                    }
                }

                this.state = 932;
                this.match(SpecmanModel_V002Parser.T__5);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 934;
                this.match(SpecmanModel_V002Parser.KW_CELL);
                this.state = 935;
                this.match(SpecmanModel_V002Parser.T__3);
                this.state = 936;
                this.editContainerHead();
                this.state = 939;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 5) {
                    {
                    this.state = 937;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 938;
                    this.changeParam();
                    }
                }

                this.state = 941;
                this.match(SpecmanModel_V002Parser.T__5);
                this.state = 942;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 943;
                this.editContainerTail();
                this.state = 944;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public imageBlock(): ImageBlockContext {
        let localContext = new ImageBlockContext(this.context, this.state);
        this.enterRule(localContext, 84, SpecmanModel_V002Parser.RULE_imageBlock);
        let _la: number;
        try {
            this.state = 1003;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 116, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 948;
                this.match(SpecmanModel_V002Parser.KW_IMAGE);
                this.state = 949;
                this.match(SpecmanModel_V002Parser.T__3);
                this.state = 950;
                this.match(SpecmanModel_V002Parser.KW_SCALE);
                this.state = 951;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 952;
                this.match(SpecmanModel_V002Parser.PERCENT);
                this.state = 953;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 954;
                this.match(SpecmanModel_V002Parser.KW_TYPE);
                this.state = 955;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 956;
                this.match(SpecmanModel_V002Parser.ID);
                this.state = 959;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 5) {
                    {
                    this.state = 957;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 958;
                    this.changeParam();
                    }
                }

                this.state = 961;
                this.match(SpecmanModel_V002Parser.T__5);
                this.state = 962;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 963;
                this.match(SpecmanModel_V002Parser.BASE64_BLOCK);
                this.state = 964;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 965;
                this.match(SpecmanModel_V002Parser.KW_IMAGE);
                this.state = 966;
                this.match(SpecmanModel_V002Parser.T__3);
                this.state = 967;
                this.match(SpecmanModel_V002Parser.KW_SCALE);
                this.state = 968;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 969;
                this.match(SpecmanModel_V002Parser.PERCENT);
                this.state = 970;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 971;
                this.match(SpecmanModel_V002Parser.KW_TYPE);
                this.state = 972;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 973;
                this.match(SpecmanModel_V002Parser.KW_PLANTUML);
                this.state = 976;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 5) {
                    {
                    this.state = 974;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 975;
                    this.changeParam();
                    }
                }

                this.state = 978;
                this.match(SpecmanModel_V002Parser.T__5);
                this.state = 979;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 980;
                this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
                this.state = 983;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 5) {
                    {
                    this.state = 981;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 982;
                    this.backupAttr();
                    }
                }

                this.state = 985;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 986;
                this.match(SpecmanModel_V002Parser.KW_IMAGE);
                this.state = 987;
                this.match(SpecmanModel_V002Parser.T__3);
                this.state = 988;
                this.match(SpecmanModel_V002Parser.KW_SCALE);
                this.state = 989;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 990;
                this.match(SpecmanModel_V002Parser.PERCENT);
                this.state = 991;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 992;
                this.match(SpecmanModel_V002Parser.KW_TYPE);
                this.state = 993;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 994;
                this.match(SpecmanModel_V002Parser.KW_SVG);
                this.state = 997;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 5) {
                    {
                    this.state = 995;
                    this.match(SpecmanModel_V002Parser.T__4);
                    this.state = 996;
                    this.changeParam();
                    }
                }

                this.state = 999;
                this.match(SpecmanModel_V002Parser.T__5);
                this.state = 1000;
                this.match(SpecmanModel_V002Parser.T__0);
                this.state = 1001;
                this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
                this.state = 1002;
                this.match(SpecmanModel_V002Parser.T__1);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public backupAttr(): BackupAttrContext {
        let localContext = new BackupAttrContext(this.context, this.state);
        this.enterRule(localContext, 86, SpecmanModel_V002Parser.RULE_backupAttr);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1005;
            this.match(SpecmanModel_V002Parser.KW_BACKUP);
            this.state = 1006;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1007;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 1008;
            this.match(SpecmanModel_V002Parser.ID);
            this.state = 1009;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 1010;
            this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
            this.state = 1011;
            this.match(SpecmanModel_V002Parser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public htmlContent(): HtmlContentContext {
        let localContext = new HtmlContentContext(this.context, this.state);
        this.enterRule(localContext, 88, SpecmanModel_V002Parser.RULE_htmlContent);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1013;
            this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
            this.state = 1015;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 117, this.context) ) {
            case 1:
                {
                this.state = 1014;
                this.plainAttr();
                }
                break;
            }
            this.state = 1018;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 118, this.context) ) {
            case 1:
                {
                this.state = 1017;
                this.markupsAttr();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public plainAttr(): PlainAttrContext {
        let localContext = new PlainAttrContext(this.context, this.state);
        this.enterRule(localContext, 90, SpecmanModel_V002Parser.RULE_plainAttr);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1020;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 1021;
            this.match(SpecmanModel_V002Parser.KW_PLAIN);
            this.state = 1022;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1023;
            this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public markupsAttr(): MarkupsAttrContext {
        let localContext = new MarkupsAttrContext(this.context, this.state);
        this.enterRule(localContext, 92, SpecmanModel_V002Parser.RULE_markupsAttr);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1025;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 1026;
            this.match(SpecmanModel_V002Parser.KW_MARKUPS);
            this.state = 1027;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1028;
            this.match(SpecmanModel_V002Parser.T__9);
            this.state = 1032;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 4) {
                {
                {
                this.state = 1029;
                this.markup();
                }
                }
                this.state = 1034;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 1035;
            this.match(SpecmanModel_V002Parser.T__10);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public markup(): MarkupContext {
        let localContext = new MarkupContext(this.context, this.state);
        this.enterRule(localContext, 94, SpecmanModel_V002Parser.RULE_markup);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1037;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 1038;
            this.match(SpecmanModel_V002Parser.INT);
            this.state = 1039;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 1040;
            this.match(SpecmanModel_V002Parser.INT);
            this.state = 1041;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 1042;
            this.markupType();
            this.state = 1045;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 1043;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 1044;
                this.match(SpecmanModel_V002Parser.ID);
                }
            }

            this.state = 1047;
            this.match(SpecmanModel_V002Parser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public markupType(): MarkupTypeContext {
        let localContext = new MarkupTypeContext(this.context, this.state);
        this.enterRule(localContext, 96, SpecmanModel_V002Parser.RULE_markupType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1049;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 57344) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public changeParam(): ChangeParamContext {
        let localContext = new ChangeParamContext(this.context, this.state);
        this.enterRule(localContext, 98, SpecmanModel_V002Parser.RULE_changeParam);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1051;
            this.match(SpecmanModel_V002Parser.KW_CHANGE);
            this.state = 1052;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1053;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 1054;
            this.changeType();
            this.state = 1055;
            this.match(SpecmanModel_V002Parser.T__4);
            this.state = 1056;
            this.match(SpecmanModel_V002Parser.ID);
            this.state = 1061;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 1057;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 1058;
                this.match(SpecmanModel_V002Parser.KW_SOURCE_STEP);
                this.state = 1059;
                this.match(SpecmanModel_V002Parser.T__2);
                this.state = 1060;
                this.match(SpecmanModel_V002Parser.STEP_ID);
                }
            }

            this.state = 1063;
            this.match(SpecmanModel_V002Parser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public decoParam(): DecoParamContext {
        let localContext = new DecoParamContext(this.context, this.state);
        this.enterRule(localContext, 100, SpecmanModel_V002Parser.RULE_decoParam);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1065;
            this.match(SpecmanModel_V002Parser.KW_DECO);
            this.state = 1066;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1067;
            this.match(SpecmanModel_V002Parser.ID);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public shadeParam(): ShadeParamContext {
        let localContext = new ShadeParamContext(this.context, this.state);
        this.enterRule(localContext, 102, SpecmanModel_V002Parser.RULE_shadeParam);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1069;
            this.match(SpecmanModel_V002Parser.KW_SHADE);
            this.state = 1070;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1071;
            this.match(SpecmanModel_V002Parser.COLOR_HEX);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tagsParam(): TagsParamContext {
        let localContext = new TagsParamContext(this.context, this.state);
        this.enterRule(localContext, 104, SpecmanModel_V002Parser.RULE_tagsParam);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1073;
            this.match(SpecmanModel_V002Parser.KW_TAGS);
            this.state = 1074;
            this.match(SpecmanModel_V002Parser.T__2);
            this.state = 1075;
            this.match(SpecmanModel_V002Parser.T__9);
            this.state = 1076;
            this.tagRef();
            this.state = 1081;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 5) {
                {
                {
                this.state = 1077;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 1078;
                this.tagRef();
                }
                }
                this.state = 1083;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 1084;
            this.match(SpecmanModel_V002Parser.T__10);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tagRef(): TagRefContext {
        let localContext = new TagRefContext(this.context, this.state);
        this.enterRule(localContext, 106, SpecmanModel_V002Parser.RULE_tagRef);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1086;
            this.match(SpecmanModel_V002Parser.T__3);
            this.state = 1087;
            this.tagId();
            this.state = 1090;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 5) {
                {
                this.state = 1088;
                this.match(SpecmanModel_V002Parser.T__4);
                this.state = 1089;
                this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
                }
            }

            this.state = 1092;
            this.match(SpecmanModel_V002Parser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tagId(): TagIdContext {
        let localContext = new TagIdContext(this.context, this.state);
        this.enterRule(localContext, 108, SpecmanModel_V002Parser.RULE_tagId);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1094;
            this.match(SpecmanModel_V002Parser.BACKTICK_STRING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public changeType(): ChangeTypeContext {
        let localContext = new ChangeTypeContext(this.context, this.state);
        this.enterRule(localContext, 110, SpecmanModel_V002Parser.RULE_changeType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1096;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 458752) !== 0) || _la === 63)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public boolVal(): BoolValContext {
        let localContext = new BoolValContext(this.context, this.state);
        this.enterRule(localContext, 112, SpecmanModel_V002Parser.RULE_boolVal);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1098;
            _la = this.tokenStream.LA(1);
            if(!(_la === 7 || _la === 9)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public stepNum(): StepNumContext {
        let localContext = new StepNumContext(this.context, this.state);
        this.enterRule(localContext, 114, SpecmanModel_V002Parser.RULE_stepNum);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1100;
            _la = this.tokenStream.LA(1);
            if(!(_la === 20 || _la === 21)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public stepId(): StepIdContext {
        let localContext = new StepIdContext(this.context, this.state);
        this.enterRule(localContext, 116, SpecmanModel_V002Parser.RULE_stepId);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1102;
            this.match(SpecmanModel_V002Parser.STEP_ID);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,93,1105,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,
        7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,
        13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
        20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,
        26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,
        33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,
        39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
        46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,
        52,2,53,7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,1,
        0,3,0,120,8,0,1,0,3,0,123,8,0,1,0,1,0,3,0,127,8,0,1,0,1,0,1,1,4,
        1,132,8,1,11,1,12,1,133,1,1,1,1,1,2,1,2,1,2,1,3,1,3,1,3,5,3,144,
        8,3,10,3,12,3,147,9,3,1,3,1,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,
        4,1,4,1,4,1,4,1,4,1,4,1,4,5,4,166,8,4,10,4,12,4,169,9,4,1,4,1,4,
        1,4,1,4,4,4,175,8,4,11,4,12,4,176,1,4,1,4,3,4,181,8,4,1,5,1,5,1,
        5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,198,8,5,1,
        6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,3,6,211,8,6,1,6,1,6,1,
        6,1,6,3,6,217,8,6,1,6,1,6,1,7,1,7,1,7,1,7,1,8,1,8,1,8,3,8,228,8,
        8,1,8,3,8,231,8,8,1,9,1,9,1,9,1,9,1,10,1,10,1,10,1,10,1,11,1,11,
        1,11,1,11,1,11,1,11,1,11,1,11,1,12,1,12,1,12,1,12,1,12,1,12,1,12,
        1,12,1,13,1,13,1,13,4,13,260,8,13,11,13,12,13,261,1,13,3,13,265,
        8,13,1,13,1,13,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,3,14,
        278,8,14,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,1,15,3,15,289,8,
        15,1,15,1,15,3,15,293,8,15,1,15,1,15,3,15,297,8,15,1,15,1,15,3,15,
        301,8,15,1,15,1,15,1,15,1,15,1,15,1,15,3,15,309,8,15,1,16,1,16,1,
        16,1,16,1,16,1,16,1,16,1,16,1,16,3,16,320,8,16,1,16,1,16,3,16,324,
        8,16,1,16,1,16,3,16,328,8,16,1,16,1,16,3,16,332,8,16,1,16,1,16,1,
        16,1,16,1,16,1,16,3,16,340,8,16,1,17,1,17,1,17,1,17,1,17,1,17,1,
        17,1,17,1,17,1,17,1,17,1,17,1,17,3,17,355,8,17,1,17,1,17,3,17,359,
        8,17,1,17,1,17,3,17,363,8,17,1,17,1,17,3,17,367,8,17,1,17,1,17,1,
        17,1,17,1,17,1,17,3,17,375,8,17,1,18,1,18,1,18,1,18,1,18,1,18,1,
        18,1,18,1,18,1,18,1,18,3,18,388,8,18,1,18,1,18,1,18,1,18,3,18,394,
        8,18,1,18,1,18,3,18,398,8,18,1,18,1,18,3,18,402,8,18,1,18,1,18,3,
        18,406,8,18,1,18,1,18,3,18,410,8,18,1,18,1,18,1,18,1,18,4,18,416,
        8,18,11,18,12,18,417,1,18,3,18,421,8,18,1,18,1,18,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,3,19,436,8,19,1,19,1,19,
        1,19,1,19,3,19,442,8,19,1,19,1,19,3,19,446,8,19,1,19,1,19,3,19,450,
        8,19,1,19,1,19,3,19,454,8,19,1,19,1,19,3,19,458,8,19,1,19,1,19,1,
        19,1,19,4,19,464,8,19,11,19,12,19,465,1,19,1,19,1,20,1,20,1,20,1,
        20,1,20,1,20,1,20,1,20,1,20,1,20,1,20,3,20,481,8,20,1,20,1,20,1,
        20,1,20,3,20,487,8,20,1,20,1,20,3,20,491,8,20,1,20,1,20,3,20,495,
        8,20,1,20,1,20,3,20,499,8,20,1,20,1,20,3,20,503,8,20,1,20,1,20,1,
        20,1,20,1,20,1,20,1,20,1,21,1,21,1,21,1,21,1,21,1,21,1,21,1,21,1,
        21,1,21,1,21,3,21,523,8,21,1,21,1,21,1,21,1,21,3,21,529,8,21,1,21,
        1,21,3,21,533,8,21,1,21,1,21,3,21,537,8,21,1,21,1,21,3,21,541,8,
        21,1,21,1,21,3,21,545,8,21,1,21,1,21,1,21,1,21,1,21,1,21,1,22,1,
        22,1,22,1,22,1,22,1,22,1,22,1,22,1,22,1,22,1,22,1,22,1,22,1,22,5,
        22,567,8,22,10,22,12,22,570,9,22,1,22,3,22,573,8,22,1,22,1,22,1,
        22,1,22,3,22,579,8,22,1,22,1,22,3,22,583,8,22,1,22,1,22,3,22,587,
        8,22,1,22,1,22,3,22,591,8,22,1,22,1,22,3,22,595,8,22,1,22,1,22,1,
        22,1,22,1,22,1,22,4,22,603,8,22,11,22,12,22,604,1,22,1,22,1,23,1,
        23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,3,23,620,8,23,1,
        23,1,23,1,23,1,23,3,23,626,8,23,1,23,1,23,3,23,630,8,23,1,23,1,23,
        3,23,634,8,23,1,23,1,23,3,23,638,8,23,1,23,1,23,3,23,642,8,23,1,
        23,1,23,1,23,1,23,4,23,648,8,23,11,23,12,23,649,1,23,3,23,653,8,
        23,1,23,1,23,1,24,1,24,1,24,1,24,1,24,3,24,662,8,24,1,24,1,24,1,
        24,1,24,4,24,668,8,24,11,24,12,24,669,1,24,3,24,673,8,24,1,24,1,
        24,1,25,1,25,1,25,1,25,1,25,3,25,682,8,25,1,25,1,25,1,25,1,25,4,
        25,688,8,25,11,25,12,25,689,1,25,3,25,693,8,25,1,25,1,25,1,26,1,
        26,1,26,1,26,1,26,3,26,702,8,26,1,26,1,26,1,26,1,26,4,26,708,8,26,
        11,26,12,26,709,1,26,1,26,1,27,1,27,1,27,1,27,1,27,3,27,719,8,27,
        1,27,1,27,1,27,1,27,4,27,725,8,27,11,27,12,27,726,1,27,1,27,1,28,
        1,28,1,28,1,28,1,28,5,28,736,8,28,10,28,12,28,739,9,28,1,28,1,28,
        3,28,743,8,28,1,28,1,28,4,28,747,8,28,11,28,12,28,748,1,28,1,28,
        1,28,4,28,754,8,28,11,28,12,28,755,3,28,758,8,28,1,29,1,29,1,29,
        1,29,1,29,1,29,1,29,1,29,1,29,5,29,769,8,29,10,29,12,29,772,9,29,
        1,29,3,29,775,8,29,1,30,1,30,1,30,1,30,1,30,1,30,1,30,3,30,784,8,
        30,1,30,1,30,1,30,1,30,3,30,790,8,30,1,30,1,30,1,30,1,30,5,30,796,
        8,30,10,30,12,30,799,9,30,1,30,4,30,802,8,30,11,30,12,30,803,1,30,
        1,30,1,31,1,31,1,31,1,31,1,31,1,31,1,31,3,31,815,8,31,1,31,1,31,
        1,31,1,32,1,32,1,33,5,33,823,8,33,10,33,12,33,826,9,33,1,34,1,34,
        1,34,1,34,3,34,832,8,34,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,
        5,35,842,8,35,10,35,12,35,845,9,35,1,35,1,35,1,36,1,36,1,36,1,36,
        1,36,3,36,854,8,36,1,36,1,36,1,36,1,36,1,36,3,36,861,8,36,1,37,1,
        37,1,37,5,37,866,8,37,10,37,12,37,869,9,37,1,38,1,38,1,38,1,38,1,
        38,3,38,876,8,38,1,38,1,38,1,39,1,39,1,39,1,39,1,39,1,39,1,39,1,
        39,1,39,1,39,1,39,1,39,5,39,892,8,39,10,39,12,39,895,9,39,1,39,3,
        39,898,8,39,1,39,1,39,3,39,902,8,39,1,39,1,39,1,39,5,39,907,8,39,
        10,39,12,39,910,9,39,1,39,1,39,1,40,1,40,1,40,1,40,1,40,5,40,919,
        8,40,10,40,12,40,922,9,40,1,40,1,40,1,41,1,41,1,41,1,41,1,41,3,41,
        931,8,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,3,41,940,8,41,1,41,1,
        41,1,41,1,41,1,41,3,41,947,8,41,1,42,1,42,1,42,1,42,1,42,1,42,1,
        42,1,42,1,42,1,42,1,42,3,42,960,8,42,1,42,1,42,1,42,1,42,1,42,1,
        42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,3,42,977,8,42,1,
        42,1,42,1,42,1,42,1,42,3,42,984,8,42,1,42,1,42,1,42,1,42,1,42,1,
        42,1,42,1,42,1,42,1,42,1,42,1,42,3,42,998,8,42,1,42,1,42,1,42,1,
        42,3,42,1004,8,42,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,44,1,
        44,3,44,1016,8,44,1,44,3,44,1019,8,44,1,45,1,45,1,45,1,45,1,45,1,
        46,1,46,1,46,1,46,1,46,5,46,1031,8,46,10,46,12,46,1034,9,46,1,46,
        1,46,1,47,1,47,1,47,1,47,1,47,1,47,1,47,1,47,3,47,1046,8,47,1,47,
        1,47,1,48,1,48,1,49,1,49,1,49,1,49,1,49,1,49,1,49,1,49,1,49,1,49,
        3,49,1062,8,49,1,49,1,49,1,50,1,50,1,50,1,50,1,51,1,51,1,51,1,51,
        1,52,1,52,1,52,1,52,1,52,1,52,5,52,1080,8,52,10,52,12,52,1083,9,
        52,1,52,1,52,1,53,1,53,1,53,1,53,3,53,1091,8,53,1,53,1,53,1,54,1,
        54,1,55,1,55,1,56,1,56,1,57,1,57,1,58,1,58,1,58,0,0,59,0,2,4,6,8,
        10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,
        54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,
        98,100,102,104,106,108,110,112,114,116,0,4,1,0,13,15,2,0,16,18,63,
        63,2,0,7,7,9,9,1,0,20,21,1187,0,119,1,0,0,0,2,131,1,0,0,0,4,137,
        1,0,0,0,6,140,1,0,0,0,8,180,1,0,0,0,10,197,1,0,0,0,12,199,1,0,0,
        0,14,220,1,0,0,0,16,230,1,0,0,0,18,232,1,0,0,0,20,236,1,0,0,0,22,
        240,1,0,0,0,24,248,1,0,0,0,26,256,1,0,0,0,28,277,1,0,0,0,30,279,
        1,0,0,0,32,310,1,0,0,0,34,341,1,0,0,0,36,376,1,0,0,0,38,424,1,0,
        0,0,40,469,1,0,0,0,42,511,1,0,0,0,44,552,1,0,0,0,46,608,1,0,0,0,
        48,656,1,0,0,0,50,676,1,0,0,0,52,696,1,0,0,0,54,713,1,0,0,0,56,757,
        1,0,0,0,58,774,1,0,0,0,60,776,1,0,0,0,62,807,1,0,0,0,64,819,1,0,
        0,0,66,824,1,0,0,0,68,831,1,0,0,0,70,833,1,0,0,0,72,848,1,0,0,0,
        74,867,1,0,0,0,76,870,1,0,0,0,78,879,1,0,0,0,80,913,1,0,0,0,82,946,
        1,0,0,0,84,1003,1,0,0,0,86,1005,1,0,0,0,88,1013,1,0,0,0,90,1020,
        1,0,0,0,92,1025,1,0,0,0,94,1037,1,0,0,0,96,1049,1,0,0,0,98,1051,
        1,0,0,0,100,1065,1,0,0,0,102,1069,1,0,0,0,104,1073,1,0,0,0,106,1086,
        1,0,0,0,108,1094,1,0,0,0,110,1096,1,0,0,0,112,1098,1,0,0,0,114,1100,
        1,0,0,0,116,1102,1,0,0,0,118,120,3,6,3,0,119,118,1,0,0,0,119,120,
        1,0,0,0,120,122,1,0,0,0,121,123,3,22,11,0,122,121,1,0,0,0,122,123,
        1,0,0,0,123,124,1,0,0,0,124,126,3,26,13,0,125,127,3,24,12,0,126,
        125,1,0,0,0,126,127,1,0,0,0,127,128,1,0,0,0,128,129,5,0,0,1,129,
        1,1,0,0,0,130,132,3,28,14,0,131,130,1,0,0,0,132,133,1,0,0,0,133,
        131,1,0,0,0,133,134,1,0,0,0,134,135,1,0,0,0,135,136,5,0,0,1,136,
        3,1,0,0,0,137,138,3,78,39,0,138,139,5,0,0,1,139,5,1,0,0,0,140,141,
        5,34,0,0,141,145,5,1,0,0,142,144,3,8,4,0,143,142,1,0,0,0,144,147,
        1,0,0,0,145,143,1,0,0,0,145,146,1,0,0,0,146,148,1,0,0,0,147,145,
        1,0,0,0,148,149,5,2,0,0,149,7,1,0,0,0,150,151,5,53,0,0,151,152,5,
        3,0,0,152,181,5,20,0,0,153,154,5,54,0,0,154,155,5,3,0,0,155,181,
        5,20,0,0,156,157,5,71,0,0,157,158,5,3,0,0,158,181,3,112,56,0,159,
        160,5,72,0,0,160,161,5,3,0,0,161,181,5,87,0,0,162,163,5,73,0,0,163,
        167,5,1,0,0,164,166,3,10,5,0,165,164,1,0,0,0,166,169,1,0,0,0,167,
        165,1,0,0,0,167,168,1,0,0,0,168,170,1,0,0,0,169,167,1,0,0,0,170,
        181,5,2,0,0,171,172,5,79,0,0,172,174,5,1,0,0,173,175,3,12,6,0,174,
        173,1,0,0,0,175,176,1,0,0,0,176,174,1,0,0,0,176,177,1,0,0,0,177,
        178,1,0,0,0,178,179,5,2,0,0,179,181,1,0,0,0,180,150,1,0,0,0,180,
        153,1,0,0,0,180,156,1,0,0,0,180,159,1,0,0,0,180,162,1,0,0,0,180,
        171,1,0,0,0,181,9,1,0,0,0,182,183,5,74,0,0,183,184,5,3,0,0,184,198,
        5,89,0,0,185,186,5,75,0,0,186,187,5,3,0,0,187,198,5,89,0,0,188,189,
        5,76,0,0,189,190,5,3,0,0,190,198,5,87,0,0,191,192,5,77,0,0,192,193,
        5,3,0,0,193,198,3,112,56,0,194,195,5,78,0,0,195,196,5,3,0,0,196,
        198,3,112,56,0,197,182,1,0,0,0,197,185,1,0,0,0,197,188,1,0,0,0,197,
        191,1,0,0,0,197,194,1,0,0,0,198,11,1,0,0,0,199,200,5,80,0,0,200,
        201,5,4,0,0,201,202,3,108,54,0,202,203,5,5,0,0,203,204,5,83,0,0,
        204,205,5,3,0,0,205,210,5,88,0,0,206,207,5,5,0,0,207,208,5,84,0,
        0,208,209,5,3,0,0,209,211,5,88,0,0,210,206,1,0,0,0,210,211,1,0,0,
        0,211,212,1,0,0,0,212,213,5,5,0,0,213,216,3,16,8,0,214,215,5,5,0,
        0,215,217,3,14,7,0,216,214,1,0,0,0,216,217,1,0,0,0,217,218,1,0,0,
        0,218,219,5,6,0,0,219,13,1,0,0,0,220,221,5,86,0,0,221,222,5,3,0,
        0,222,223,5,7,0,0,223,15,1,0,0,0,224,227,3,18,9,0,225,226,5,5,0,
        0,226,228,3,20,10,0,227,225,1,0,0,0,227,228,1,0,0,0,228,231,1,0,
        0,0,229,231,3,20,10,0,230,224,1,0,0,0,230,229,1,0,0,0,231,17,1,0,
        0,0,232,233,5,82,0,0,233,234,5,3,0,0,234,235,5,89,0,0,235,19,1,0,
        0,0,236,237,5,85,0,0,237,238,5,3,0,0,238,239,5,89,0,0,239,21,1,0,
        0,0,240,241,5,32,0,0,241,242,5,4,0,0,242,243,3,64,32,0,243,244,5,
        6,0,0,244,245,5,1,0,0,245,246,3,66,33,0,246,247,5,2,0,0,247,23,1,
        0,0,0,248,249,5,33,0,0,249,250,5,4,0,0,250,251,3,64,32,0,251,252,
        5,6,0,0,252,253,5,1,0,0,253,254,3,66,33,0,254,255,5,2,0,0,255,25,
        1,0,0,0,256,257,5,31,0,0,257,259,5,1,0,0,258,260,3,28,14,0,259,258,
        1,0,0,0,260,261,1,0,0,0,261,259,1,0,0,0,261,262,1,0,0,0,262,264,
        1,0,0,0,263,265,3,56,28,0,264,263,1,0,0,0,264,265,1,0,0,0,265,266,
        1,0,0,0,266,267,5,2,0,0,267,27,1,0,0,0,268,278,3,30,15,0,269,278,
        3,32,16,0,270,278,3,34,17,0,271,278,3,36,18,0,272,278,3,38,19,0,
        273,278,3,40,20,0,274,278,3,42,21,0,275,278,3,44,22,0,276,278,3,
        46,23,0,277,268,1,0,0,0,277,269,1,0,0,0,277,270,1,0,0,0,277,271,
        1,0,0,0,277,272,1,0,0,0,277,273,1,0,0,0,277,274,1,0,0,0,277,275,
        1,0,0,0,277,276,1,0,0,0,278,29,1,0,0,0,279,280,5,23,0,0,280,281,
        5,4,0,0,281,282,3,114,57,0,282,283,5,5,0,0,283,284,3,116,58,0,284,
        285,5,5,0,0,285,288,3,64,32,0,286,287,5,5,0,0,287,289,3,98,49,0,
        288,286,1,0,0,0,288,289,1,0,0,0,289,292,1,0,0,0,290,291,5,5,0,0,
        291,293,3,100,50,0,292,290,1,0,0,0,292,293,1,0,0,0,293,296,1,0,0,
        0,294,295,5,5,0,0,295,297,3,102,51,0,296,294,1,0,0,0,296,297,1,0,
        0,0,297,300,1,0,0,0,298,299,5,5,0,0,299,301,3,104,52,0,300,298,1,
        0,0,0,300,301,1,0,0,0,301,302,1,0,0,0,302,308,5,6,0,0,303,309,5,
        8,0,0,304,305,5,1,0,0,305,306,3,66,33,0,306,307,5,2,0,0,307,309,
        1,0,0,0,308,303,1,0,0,0,308,304,1,0,0,0,309,31,1,0,0,0,310,311,5,
        24,0,0,311,312,5,4,0,0,312,313,3,114,57,0,313,314,5,5,0,0,314,315,
        3,116,58,0,315,316,5,5,0,0,316,319,3,64,32,0,317,318,5,5,0,0,318,
        320,3,98,49,0,319,317,1,0,0,0,319,320,1,0,0,0,320,323,1,0,0,0,321,
        322,5,5,0,0,322,324,3,100,50,0,323,321,1,0,0,0,323,324,1,0,0,0,324,
        327,1,0,0,0,325,326,5,5,0,0,326,328,3,102,51,0,327,325,1,0,0,0,327,
        328,1,0,0,0,328,331,1,0,0,0,329,330,5,5,0,0,330,332,3,104,52,0,331,
        329,1,0,0,0,331,332,1,0,0,0,332,333,1,0,0,0,333,339,5,6,0,0,334,
        340,5,8,0,0,335,336,5,1,0,0,336,337,3,66,33,0,337,338,5,2,0,0,338,
        340,1,0,0,0,339,334,1,0,0,0,339,335,1,0,0,0,340,33,1,0,0,0,341,342,
        5,63,0,0,342,343,5,4,0,0,343,344,3,114,57,0,344,345,5,5,0,0,345,
        346,3,116,58,0,346,347,5,5,0,0,347,348,3,64,32,0,348,349,5,5,0,0,
        349,354,5,87,0,0,350,351,5,5,0,0,351,352,5,64,0,0,352,353,5,3,0,
        0,353,355,5,19,0,0,354,350,1,0,0,0,354,355,1,0,0,0,355,358,1,0,0,
        0,356,357,5,5,0,0,357,359,3,100,50,0,358,356,1,0,0,0,358,359,1,0,
        0,0,359,362,1,0,0,0,360,361,5,5,0,0,361,363,3,102,51,0,362,360,1,
        0,0,0,362,363,1,0,0,0,363,366,1,0,0,0,364,365,5,5,0,0,365,367,3,
        104,52,0,366,364,1,0,0,0,366,367,1,0,0,0,367,368,1,0,0,0,368,374,
        5,6,0,0,369,375,5,8,0,0,370,371,5,1,0,0,371,372,3,66,33,0,372,373,
        5,2,0,0,373,375,1,0,0,0,374,369,1,0,0,0,374,370,1,0,0,0,375,35,1,
        0,0,0,376,377,5,25,0,0,377,378,5,4,0,0,378,379,3,114,57,0,379,380,
        5,5,0,0,380,381,3,116,58,0,381,382,5,5,0,0,382,387,3,64,32,0,383,
        384,5,5,0,0,384,385,5,55,0,0,385,386,5,3,0,0,386,388,5,20,0,0,387,
        383,1,0,0,0,387,388,1,0,0,0,388,393,1,0,0,0,389,390,5,5,0,0,390,
        391,5,68,0,0,391,392,5,3,0,0,392,394,5,9,0,0,393,389,1,0,0,0,393,
        394,1,0,0,0,394,397,1,0,0,0,395,396,5,5,0,0,396,398,3,98,49,0,397,
        395,1,0,0,0,397,398,1,0,0,0,398,401,1,0,0,0,399,400,5,5,0,0,400,
        402,3,100,50,0,401,399,1,0,0,0,401,402,1,0,0,0,402,405,1,0,0,0,403,
        404,5,5,0,0,404,406,3,102,51,0,405,403,1,0,0,0,405,406,1,0,0,0,406,
        409,1,0,0,0,407,408,5,5,0,0,408,410,3,104,52,0,409,407,1,0,0,0,409,
        410,1,0,0,0,410,411,1,0,0,0,411,412,5,6,0,0,412,413,5,1,0,0,413,
        415,3,66,33,0,414,416,3,28,14,0,415,414,1,0,0,0,416,417,1,0,0,0,
        417,415,1,0,0,0,417,418,1,0,0,0,418,420,1,0,0,0,419,421,3,56,28,
        0,420,419,1,0,0,0,420,421,1,0,0,0,421,422,1,0,0,0,422,423,5,2,0,
        0,423,37,1,0,0,0,424,425,5,26,0,0,425,426,5,4,0,0,426,427,3,114,
        57,0,427,428,5,5,0,0,428,429,3,116,58,0,429,430,5,5,0,0,430,435,
        3,64,32,0,431,432,5,5,0,0,432,433,5,55,0,0,433,434,5,3,0,0,434,436,
        5,20,0,0,435,431,1,0,0,0,435,436,1,0,0,0,436,441,1,0,0,0,437,438,
        5,5,0,0,438,439,5,68,0,0,439,440,5,3,0,0,440,442,5,9,0,0,441,437,
        1,0,0,0,441,442,1,0,0,0,442,445,1,0,0,0,443,444,5,5,0,0,444,446,
        3,98,49,0,445,443,1,0,0,0,445,446,1,0,0,0,446,449,1,0,0,0,447,448,
        5,5,0,0,448,450,3,100,50,0,449,447,1,0,0,0,449,450,1,0,0,0,450,453,
        1,0,0,0,451,452,5,5,0,0,452,454,3,102,51,0,453,451,1,0,0,0,453,454,
        1,0,0,0,454,457,1,0,0,0,455,456,5,5,0,0,456,458,3,104,52,0,457,455,
        1,0,0,0,457,458,1,0,0,0,458,459,1,0,0,0,459,460,5,6,0,0,460,461,
        5,1,0,0,461,463,3,66,33,0,462,464,3,28,14,0,463,462,1,0,0,0,464,
        465,1,0,0,0,465,463,1,0,0,0,465,466,1,0,0,0,466,467,1,0,0,0,467,
        468,5,2,0,0,468,39,1,0,0,0,469,470,5,27,0,0,470,471,5,4,0,0,471,
        472,3,114,57,0,472,473,5,5,0,0,473,474,3,116,58,0,474,475,5,5,0,
        0,475,480,3,64,32,0,476,477,5,5,0,0,477,478,5,56,0,0,478,479,5,3,
        0,0,479,481,5,22,0,0,480,476,1,0,0,0,480,481,1,0,0,0,481,486,1,0,
        0,0,482,483,5,5,0,0,483,484,5,68,0,0,484,485,5,3,0,0,485,487,5,9,
        0,0,486,482,1,0,0,0,486,487,1,0,0,0,487,490,1,0,0,0,488,489,5,5,
        0,0,489,491,3,98,49,0,490,488,1,0,0,0,490,491,1,0,0,0,491,494,1,
        0,0,0,492,493,5,5,0,0,493,495,3,100,50,0,494,492,1,0,0,0,494,495,
        1,0,0,0,495,498,1,0,0,0,496,497,5,5,0,0,497,499,3,102,51,0,498,496,
        1,0,0,0,498,499,1,0,0,0,499,502,1,0,0,0,500,501,5,5,0,0,501,503,
        3,104,52,0,502,500,1,0,0,0,502,503,1,0,0,0,503,504,1,0,0,0,504,505,
        5,6,0,0,505,506,5,1,0,0,506,507,3,66,33,0,507,508,3,48,24,0,508,
        509,3,50,25,0,509,510,5,2,0,0,510,41,1,0,0,0,511,512,5,28,0,0,512,
        513,5,4,0,0,513,514,3,114,57,0,514,515,5,5,0,0,515,516,3,116,58,
        0,516,517,5,5,0,0,517,522,3,64,32,0,518,519,5,5,0,0,519,520,5,57,
        0,0,520,521,5,3,0,0,521,523,5,20,0,0,522,518,1,0,0,0,522,523,1,0,
        0,0,523,528,1,0,0,0,524,525,5,5,0,0,525,526,5,68,0,0,526,527,5,3,
        0,0,527,529,5,9,0,0,528,524,1,0,0,0,528,529,1,0,0,0,529,532,1,0,
        0,0,530,531,5,5,0,0,531,533,3,98,49,0,532,530,1,0,0,0,532,533,1,
        0,0,0,533,536,1,0,0,0,534,535,5,5,0,0,535,537,3,100,50,0,536,534,
        1,0,0,0,536,537,1,0,0,0,537,540,1,0,0,0,538,539,5,5,0,0,539,541,
        3,102,51,0,540,538,1,0,0,0,540,541,1,0,0,0,541,544,1,0,0,0,542,543,
        5,5,0,0,543,545,3,104,52,0,544,542,1,0,0,0,544,545,1,0,0,0,545,546,
        1,0,0,0,546,547,5,6,0,0,547,548,5,1,0,0,548,549,3,66,33,0,549,550,
        3,48,24,0,550,551,5,2,0,0,551,43,1,0,0,0,552,553,5,29,0,0,553,554,
        5,4,0,0,554,555,3,114,57,0,555,556,5,5,0,0,556,557,3,116,58,0,557,
        558,5,5,0,0,558,572,3,64,32,0,559,560,5,5,0,0,560,561,5,52,0,0,561,
        562,5,3,0,0,562,563,5,10,0,0,563,568,5,22,0,0,564,565,5,5,0,0,565,
        567,5,22,0,0,566,564,1,0,0,0,567,570,1,0,0,0,568,566,1,0,0,0,568,
        569,1,0,0,0,569,571,1,0,0,0,570,568,1,0,0,0,571,573,5,11,0,0,572,
        559,1,0,0,0,572,573,1,0,0,0,573,578,1,0,0,0,574,575,5,5,0,0,575,
        576,5,68,0,0,576,577,5,3,0,0,577,579,5,9,0,0,578,574,1,0,0,0,578,
        579,1,0,0,0,579,582,1,0,0,0,580,581,5,5,0,0,581,583,3,98,49,0,582,
        580,1,0,0,0,582,583,1,0,0,0,583,586,1,0,0,0,584,585,5,5,0,0,585,
        587,3,100,50,0,586,584,1,0,0,0,586,587,1,0,0,0,587,590,1,0,0,0,588,
        589,5,5,0,0,589,591,3,102,51,0,590,588,1,0,0,0,590,591,1,0,0,0,591,
        594,1,0,0,0,592,593,5,5,0,0,593,595,3,104,52,0,594,592,1,0,0,0,594,
        595,1,0,0,0,595,596,1,0,0,0,596,597,5,6,0,0,597,598,5,1,0,0,598,
        599,3,66,33,0,599,600,3,52,26,0,600,602,3,54,27,0,601,603,3,54,27,
        0,602,601,1,0,0,0,603,604,1,0,0,0,604,602,1,0,0,0,604,605,1,0,0,
        0,605,606,1,0,0,0,606,607,5,2,0,0,607,45,1,0,0,0,608,609,5,30,0,
        0,609,610,5,4,0,0,610,611,3,114,57,0,611,612,5,5,0,0,612,613,3,116,
        58,0,613,614,5,5,0,0,614,619,3,64,32,0,615,616,5,5,0,0,616,617,5,
        51,0,0,617,618,5,3,0,0,618,620,5,9,0,0,619,615,1,0,0,0,619,620,1,
        0,0,0,620,625,1,0,0,0,621,622,5,5,0,0,622,623,5,68,0,0,623,624,5,
        3,0,0,624,626,5,9,0,0,625,621,1,0,0,0,625,626,1,0,0,0,626,629,1,
        0,0,0,627,628,5,5,0,0,628,630,3,98,49,0,629,627,1,0,0,0,629,630,
        1,0,0,0,630,633,1,0,0,0,631,632,5,5,0,0,632,634,3,100,50,0,633,631,
        1,0,0,0,633,634,1,0,0,0,634,637,1,0,0,0,635,636,5,5,0,0,636,638,
        3,102,51,0,637,635,1,0,0,0,637,638,1,0,0,0,638,641,1,0,0,0,639,640,
        5,5,0,0,640,642,3,104,52,0,641,639,1,0,0,0,641,642,1,0,0,0,642,643,
        1,0,0,0,643,644,5,6,0,0,644,645,5,1,0,0,645,647,3,66,33,0,646,648,
        3,28,14,0,647,646,1,0,0,0,648,649,1,0,0,0,649,647,1,0,0,0,649,650,
        1,0,0,0,650,652,1,0,0,0,651,653,3,56,28,0,652,651,1,0,0,0,652,653,
        1,0,0,0,653,654,1,0,0,0,654,655,5,2,0,0,655,47,1,0,0,0,656,657,5,
        35,0,0,657,658,5,4,0,0,658,661,3,64,32,0,659,660,5,5,0,0,660,662,
        3,98,49,0,661,659,1,0,0,0,661,662,1,0,0,0,662,663,1,0,0,0,663,664,
        5,6,0,0,664,665,5,1,0,0,665,667,3,66,33,0,666,668,3,28,14,0,667,
        666,1,0,0,0,668,669,1,0,0,0,669,667,1,0,0,0,669,670,1,0,0,0,670,
        672,1,0,0,0,671,673,3,56,28,0,672,671,1,0,0,0,672,673,1,0,0,0,673,
        674,1,0,0,0,674,675,5,2,0,0,675,49,1,0,0,0,676,677,5,36,0,0,677,
        678,5,4,0,0,678,681,3,64,32,0,679,680,5,5,0,0,680,682,3,98,49,0,
        681,679,1,0,0,0,681,682,1,0,0,0,682,683,1,0,0,0,683,684,5,6,0,0,
        684,685,5,1,0,0,685,687,3,66,33,0,686,688,3,28,14,0,687,686,1,0,
        0,0,688,689,1,0,0,0,689,687,1,0,0,0,689,690,1,0,0,0,690,692,1,0,
        0,0,691,693,3,56,28,0,692,691,1,0,0,0,692,693,1,0,0,0,693,694,1,
        0,0,0,694,695,5,2,0,0,695,51,1,0,0,0,696,697,5,37,0,0,697,698,5,
        4,0,0,698,701,3,64,32,0,699,700,5,5,0,0,700,702,3,98,49,0,701,699,
        1,0,0,0,701,702,1,0,0,0,702,703,1,0,0,0,703,704,5,6,0,0,704,705,
        5,1,0,0,705,707,3,66,33,0,706,708,3,28,14,0,707,706,1,0,0,0,708,
        709,1,0,0,0,709,707,1,0,0,0,709,710,1,0,0,0,710,711,1,0,0,0,711,
        712,5,2,0,0,712,53,1,0,0,0,713,714,5,38,0,0,714,715,5,4,0,0,715,
        718,3,64,32,0,716,717,5,5,0,0,717,719,3,98,49,0,718,716,1,0,0,0,
        718,719,1,0,0,0,719,720,1,0,0,0,720,721,5,6,0,0,721,722,5,1,0,0,
        722,724,3,66,33,0,723,725,3,28,14,0,724,723,1,0,0,0,725,726,1,0,
        0,0,726,724,1,0,0,0,726,727,1,0,0,0,727,728,1,0,0,0,728,729,5,2,
        0,0,729,55,1,0,0,0,730,742,5,70,0,0,731,732,5,4,0,0,732,737,3,58,
        29,0,733,734,5,5,0,0,734,736,3,58,29,0,735,733,1,0,0,0,736,739,1,
        0,0,0,737,735,1,0,0,0,737,738,1,0,0,0,738,740,1,0,0,0,739,737,1,
        0,0,0,740,741,5,6,0,0,741,743,1,0,0,0,742,731,1,0,0,0,742,743,1,
        0,0,0,743,744,1,0,0,0,744,746,5,1,0,0,745,747,3,60,30,0,746,745,
        1,0,0,0,747,748,1,0,0,0,748,746,1,0,0,0,748,749,1,0,0,0,749,750,
        1,0,0,0,750,751,5,2,0,0,751,758,1,0,0,0,752,754,3,60,30,0,753,752,
        1,0,0,0,754,755,1,0,0,0,755,753,1,0,0,0,755,756,1,0,0,0,756,758,
        1,0,0,0,757,730,1,0,0,0,757,753,1,0,0,0,758,57,1,0,0,0,759,760,5,
        68,0,0,760,761,5,3,0,0,761,775,5,9,0,0,762,763,5,52,0,0,763,764,
        5,3,0,0,764,765,5,10,0,0,765,770,5,22,0,0,766,767,5,5,0,0,767,769,
        5,22,0,0,768,766,1,0,0,0,769,772,1,0,0,0,770,768,1,0,0,0,770,771,
        1,0,0,0,771,773,1,0,0,0,772,770,1,0,0,0,773,775,5,11,0,0,774,759,
        1,0,0,0,774,762,1,0,0,0,775,59,1,0,0,0,776,777,5,39,0,0,777,778,
        5,4,0,0,778,779,3,114,57,0,779,780,5,5,0,0,780,783,3,64,32,0,781,
        782,5,5,0,0,782,784,3,98,49,0,783,781,1,0,0,0,783,784,1,0,0,0,784,
        789,1,0,0,0,785,786,5,5,0,0,786,787,5,69,0,0,787,788,5,3,0,0,788,
        790,5,20,0,0,789,785,1,0,0,0,789,790,1,0,0,0,790,791,1,0,0,0,791,
        792,5,6,0,0,792,793,5,1,0,0,793,797,3,66,33,0,794,796,3,62,31,0,
        795,794,1,0,0,0,796,799,1,0,0,0,797,795,1,0,0,0,797,798,1,0,0,0,
        798,801,1,0,0,0,799,797,1,0,0,0,800,802,3,28,14,0,801,800,1,0,0,
        0,802,803,1,0,0,0,803,801,1,0,0,0,803,804,1,0,0,0,804,805,1,0,0,
        0,805,806,5,2,0,0,806,61,1,0,0,0,807,808,5,40,0,0,808,809,5,4,0,
        0,809,810,3,114,57,0,810,811,5,5,0,0,811,814,3,64,32,0,812,813,5,
        5,0,0,813,815,3,98,49,0,814,812,1,0,0,0,814,815,1,0,0,0,815,816,
        1,0,0,0,816,817,5,6,0,0,817,818,5,8,0,0,818,63,1,0,0,0,819,820,3,
        88,44,0,820,65,1,0,0,0,821,823,3,68,34,0,822,821,1,0,0,0,823,826,
        1,0,0,0,824,822,1,0,0,0,824,825,1,0,0,0,825,67,1,0,0,0,826,824,1,
        0,0,0,827,832,3,70,35,0,828,832,3,76,38,0,829,832,3,78,39,0,830,
        832,3,84,42,0,831,827,1,0,0,0,831,828,1,0,0,0,831,829,1,0,0,0,831,
        830,1,0,0,0,832,69,1,0,0,0,833,834,5,41,0,0,834,835,5,4,0,0,835,
        836,5,50,0,0,836,837,5,3,0,0,837,838,3,112,56,0,838,839,5,6,0,0,
        839,843,5,1,0,0,840,842,3,72,36,0,841,840,1,0,0,0,842,845,1,0,0,
        0,843,841,1,0,0,0,843,844,1,0,0,0,844,846,1,0,0,0,845,843,1,0,0,
        0,846,847,5,2,0,0,847,71,1,0,0,0,848,849,5,42,0,0,849,850,5,4,0,
        0,850,853,3,64,32,0,851,852,5,5,0,0,852,854,3,98,49,0,853,851,1,
        0,0,0,853,854,1,0,0,0,854,855,1,0,0,0,855,860,5,6,0,0,856,857,5,
        1,0,0,857,858,3,74,37,0,858,859,5,2,0,0,859,861,1,0,0,0,860,856,
        1,0,0,0,860,861,1,0,0,0,861,73,1,0,0,0,862,866,3,76,38,0,863,866,
        3,78,39,0,864,866,3,84,42,0,865,862,1,0,0,0,865,863,1,0,0,0,865,
        864,1,0,0,0,866,869,1,0,0,0,867,865,1,0,0,0,867,868,1,0,0,0,868,
        75,1,0,0,0,869,867,1,0,0,0,870,871,5,49,0,0,871,872,5,4,0,0,872,
        875,3,88,44,0,873,874,5,5,0,0,874,876,3,98,49,0,875,873,1,0,0,0,
        875,876,1,0,0,0,876,877,1,0,0,0,877,878,5,6,0,0,878,77,1,0,0,0,879,
        880,5,43,0,0,880,881,5,4,0,0,881,882,5,53,0,0,882,883,5,3,0,0,883,
        897,5,22,0,0,884,885,5,5,0,0,885,886,5,52,0,0,886,887,5,3,0,0,887,
        888,5,10,0,0,888,893,5,22,0,0,889,890,5,5,0,0,890,892,5,22,0,0,891,
        889,1,0,0,0,892,895,1,0,0,0,893,891,1,0,0,0,893,894,1,0,0,0,894,
        896,1,0,0,0,895,893,1,0,0,0,896,898,5,11,0,0,897,884,1,0,0,0,897,
        898,1,0,0,0,898,901,1,0,0,0,899,900,5,5,0,0,900,902,3,98,49,0,901,
        899,1,0,0,0,901,902,1,0,0,0,902,903,1,0,0,0,903,904,5,6,0,0,904,
        908,5,1,0,0,905,907,3,80,40,0,906,905,1,0,0,0,907,910,1,0,0,0,908,
        906,1,0,0,0,908,909,1,0,0,0,909,911,1,0,0,0,910,908,1,0,0,0,911,
        912,5,2,0,0,912,79,1,0,0,0,913,914,5,44,0,0,914,915,5,1,0,0,915,
        920,3,82,41,0,916,917,5,12,0,0,917,919,3,82,41,0,918,916,1,0,0,0,
        919,922,1,0,0,0,920,918,1,0,0,0,920,921,1,0,0,0,921,923,1,0,0,0,
        922,920,1,0,0,0,923,924,5,2,0,0,924,81,1,0,0,0,925,926,5,45,0,0,
        926,927,5,4,0,0,927,930,3,64,32,0,928,929,5,5,0,0,929,931,3,98,49,
        0,930,928,1,0,0,0,930,931,1,0,0,0,931,932,1,0,0,0,932,933,5,6,0,
        0,933,947,1,0,0,0,934,935,5,45,0,0,935,936,5,4,0,0,936,939,3,64,
        32,0,937,938,5,5,0,0,938,940,3,98,49,0,939,937,1,0,0,0,939,940,1,
        0,0,0,940,941,1,0,0,0,941,942,5,6,0,0,942,943,5,1,0,0,943,944,3,
        66,33,0,944,945,5,2,0,0,945,947,1,0,0,0,946,925,1,0,0,0,946,934,
        1,0,0,0,947,83,1,0,0,0,948,949,5,46,0,0,949,950,5,4,0,0,950,951,
        5,60,0,0,951,952,5,3,0,0,952,953,5,22,0,0,953,954,5,5,0,0,954,955,
        5,61,0,0,955,956,5,3,0,0,956,959,5,87,0,0,957,958,5,5,0,0,958,960,
        3,98,49,0,959,957,1,0,0,0,959,960,1,0,0,0,960,961,1,0,0,0,961,962,
        5,6,0,0,962,963,5,1,0,0,963,964,5,90,0,0,964,1004,5,2,0,0,965,966,
        5,46,0,0,966,967,5,4,0,0,967,968,5,60,0,0,968,969,5,3,0,0,969,970,
        5,22,0,0,970,971,5,5,0,0,971,972,5,61,0,0,972,973,5,3,0,0,973,976,
        5,47,0,0,974,975,5,5,0,0,975,977,3,98,49,0,976,974,1,0,0,0,976,977,
        1,0,0,0,977,978,1,0,0,0,978,979,5,6,0,0,979,980,5,1,0,0,980,983,
        5,89,0,0,981,982,5,5,0,0,982,984,3,86,43,0,983,981,1,0,0,0,983,984,
        1,0,0,0,984,985,1,0,0,0,985,1004,5,2,0,0,986,987,5,46,0,0,987,988,
        5,4,0,0,988,989,5,60,0,0,989,990,5,3,0,0,990,991,5,22,0,0,991,992,
        5,5,0,0,992,993,5,61,0,0,993,994,5,3,0,0,994,997,5,48,0,0,995,996,
        5,5,0,0,996,998,3,98,49,0,997,995,1,0,0,0,997,998,1,0,0,0,998,999,
        1,0,0,0,999,1000,5,6,0,0,1000,1001,5,1,0,0,1001,1002,5,89,0,0,1002,
        1004,5,2,0,0,1003,948,1,0,0,0,1003,965,1,0,0,0,1003,986,1,0,0,0,
        1004,85,1,0,0,0,1005,1006,5,65,0,0,1006,1007,5,3,0,0,1007,1008,5,
        4,0,0,1008,1009,5,87,0,0,1009,1010,5,5,0,0,1010,1011,5,89,0,0,1011,
        1012,5,6,0,0,1012,87,1,0,0,0,1013,1015,5,89,0,0,1014,1016,3,90,45,
        0,1015,1014,1,0,0,0,1015,1016,1,0,0,0,1016,1018,1,0,0,0,1017,1019,
        3,92,46,0,1018,1017,1,0,0,0,1018,1019,1,0,0,0,1019,89,1,0,0,0,1020,
        1021,5,5,0,0,1021,1022,5,58,0,0,1022,1023,5,3,0,0,1023,1024,5,89,
        0,0,1024,91,1,0,0,0,1025,1026,5,5,0,0,1026,1027,5,59,0,0,1027,1028,
        5,3,0,0,1028,1032,5,10,0,0,1029,1031,3,94,47,0,1030,1029,1,0,0,0,
        1031,1034,1,0,0,0,1032,1030,1,0,0,0,1032,1033,1,0,0,0,1033,1035,
        1,0,0,0,1034,1032,1,0,0,0,1035,1036,5,11,0,0,1036,93,1,0,0,0,1037,
        1038,5,4,0,0,1038,1039,5,20,0,0,1039,1040,5,5,0,0,1040,1041,5,20,
        0,0,1041,1042,5,5,0,0,1042,1045,3,96,48,0,1043,1044,5,5,0,0,1044,
        1046,5,87,0,0,1045,1043,1,0,0,0,1045,1046,1,0,0,0,1046,1047,1,0,
        0,0,1047,1048,5,6,0,0,1048,95,1,0,0,0,1049,1050,7,0,0,0,1050,97,
        1,0,0,0,1051,1052,5,62,0,0,1052,1053,5,3,0,0,1053,1054,5,4,0,0,1054,
        1055,3,110,55,0,1055,1056,5,5,0,0,1056,1061,5,87,0,0,1057,1058,5,
        5,0,0,1058,1059,5,64,0,0,1059,1060,5,3,0,0,1060,1062,5,19,0,0,1061,
        1057,1,0,0,0,1061,1062,1,0,0,0,1062,1063,1,0,0,0,1063,1064,5,6,0,
        0,1064,99,1,0,0,0,1065,1066,5,66,0,0,1066,1067,5,3,0,0,1067,1068,
        5,87,0,0,1068,101,1,0,0,0,1069,1070,5,67,0,0,1070,1071,5,3,0,0,1071,
        1072,5,88,0,0,1072,103,1,0,0,0,1073,1074,5,81,0,0,1074,1075,5,3,
        0,0,1075,1076,5,10,0,0,1076,1081,3,106,53,0,1077,1078,5,5,0,0,1078,
        1080,3,106,53,0,1079,1077,1,0,0,0,1080,1083,1,0,0,0,1081,1079,1,
        0,0,0,1081,1082,1,0,0,0,1082,1084,1,0,0,0,1083,1081,1,0,0,0,1084,
        1085,5,11,0,0,1085,105,1,0,0,0,1086,1087,5,4,0,0,1087,1090,3,108,
        54,0,1088,1089,5,5,0,0,1089,1091,5,89,0,0,1090,1088,1,0,0,0,1090,
        1091,1,0,0,0,1091,1092,1,0,0,0,1092,1093,5,6,0,0,1093,107,1,0,0,
        0,1094,1095,5,89,0,0,1095,109,1,0,0,0,1096,1097,7,1,0,0,1097,111,
        1,0,0,0,1098,1099,7,2,0,0,1099,113,1,0,0,0,1100,1101,7,3,0,0,1101,
        115,1,0,0,0,1102,1103,5,19,0,0,1103,117,1,0,0,0,124,119,122,126,
        133,145,167,176,180,197,210,216,227,230,261,264,277,288,292,296,
        300,308,319,323,327,331,339,354,358,362,366,374,387,393,397,401,
        405,409,417,420,435,441,445,449,453,457,465,480,486,490,494,498,
        502,522,528,532,536,540,544,568,572,578,582,586,590,594,604,619,
        625,629,633,637,641,649,652,661,669,672,681,689,692,701,709,718,
        726,737,742,748,755,757,770,774,783,789,797,803,814,824,831,843,
        853,860,865,867,875,893,897,901,908,920,930,939,946,959,976,983,
        997,1003,1015,1018,1032,1045,1061,1081,1090
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!SpecmanModel_V002Parser.__ATN) {
            SpecmanModel_V002Parser.__ATN = new antlr.ATNDeserializer().deserialize(SpecmanModel_V002Parser._serializedATN);
        }

        return SpecmanModel_V002Parser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(SpecmanModel_V002Parser.literalNames, SpecmanModel_V002Parser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return SpecmanModel_V002Parser.vocabulary;
    }

    private static readonly decisionsToDFA = SpecmanModel_V002Parser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class DiagramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public mainSequence(): MainSequenceContext {
        return this.getRuleContext(0, MainSequenceContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.EOF, 0)!;
    }
    public settings(): SettingsContext | null {
        return this.getRuleContext(0, SettingsContext);
    }
    public intro(): IntroContext | null {
        return this.getRuleContext(0, IntroContext);
    }
    public outro(): OutroContext | null {
        return this.getRuleContext(0, OutroContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_diagram;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitDiagram) {
            return visitor.visitDiagram(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StepFragmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.EOF, 0)!;
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_stepFragment;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitStepFragment) {
            return visitor.visitStepFragment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TableFragmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public tableBlock(): TableBlockContext {
        return this.getRuleContext(0, TableBlockContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.EOF, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tableFragment;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTableFragment) {
            return visitor.visitTableFragment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SettingsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_SETTINGS(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SETTINGS, 0)!;
    }
    public settingEntry(): SettingEntryContext[];
    public settingEntry(i: number): SettingEntryContext | null;
    public settingEntry(i?: number): SettingEntryContext[] | SettingEntryContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SettingEntryContext);
        }

        return this.getRuleContext(i, SettingEntryContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_settings;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitSettings) {
            return visitor.visitSettings(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SettingEntryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_WIDTH(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_WIDTH, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.INT, 0);
    }
    public KW_ZOOM(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_ZOOM, 0);
    }
    public KW_CHANGE_MODE(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_CHANGE_MODE, 0);
    }
    public boolVal(): BoolValContext | null {
        return this.getRuleContext(0, BoolValContext);
    }
    public KW_CHANGESET_NAME(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_CHANGESET_NAME, 0);
    }
    public ID(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.ID, 0);
    }
    public KW_PDF_OPTIONS(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_PDF_OPTIONS, 0);
    }
    public pdfOptionEntry(): PdfOptionEntryContext[];
    public pdfOptionEntry(i: number): PdfOptionEntryContext | null;
    public pdfOptionEntry(i?: number): PdfOptionEntryContext[] | PdfOptionEntryContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PdfOptionEntryContext);
        }

        return this.getRuleContext(i, PdfOptionEntryContext);
    }
    public KW_META_TAGS(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_META_TAGS, 0);
    }
    public metaTagConfig(): MetaTagConfigContext[];
    public metaTagConfig(i: number): MetaTagConfigContext | null;
    public metaTagConfig(i?: number): MetaTagConfigContext[] | MetaTagConfigContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetaTagConfigContext);
        }

        return this.getRuleContext(i, MetaTagConfigContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_settingEntry;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitSettingEntry) {
            return visitor.visitSettingEntry(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PdfOptionEntryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_FILENAME(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_FILENAME, 0);
    }
    public BACKTICK_STRING(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0);
    }
    public KW_MODEL_FILENAME(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_MODEL_FILENAME, 0);
    }
    public KW_PAGE_SIZE(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_PAGE_SIZE, 0);
    }
    public ID(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.ID, 0);
    }
    public KW_PORTRAIT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_PORTRAIT, 0);
    }
    public boolVal(): BoolValContext | null {
        return this.getRuleContext(0, BoolValContext);
    }
    public KW_PAGING(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_PAGING, 0);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_pdfOptionEntry;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitPdfOptionEntry) {
            return visitor.visitPdfOptionEntry(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MetaTagConfigContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_TAG(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_TAG, 0)!;
    }
    public tagId(): TagIdContext {
        return this.getRuleContext(0, TagIdContext)!;
    }
    public KW_BACKGROUND(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_BACKGROUND, 0)!;
    }
    public COLOR_HEX(): antlr.TerminalNode[];
    public COLOR_HEX(i: number): antlr.TerminalNode | null;
    public COLOR_HEX(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SpecmanModel_V002Parser.COLOR_HEX);
    	} else {
    		return this.getToken(SpecmanModel_V002Parser.COLOR_HEX, i);
    	}
    }
    public metaTagContent(): MetaTagContentContext {
        return this.getRuleContext(0, MetaTagContentContext)!;
    }
    public KW_BORDER(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_BORDER, 0);
    }
    public freetextParam(): FreetextParamContext | null {
        return this.getRuleContext(0, FreetextParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_metaTagConfig;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitMetaTagConfig) {
            return visitor.visitMetaTagConfig(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FreetextParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_FREETEXT(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_FREETEXT, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_freetextParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitFreetextParam) {
            return visitor.visitFreetextParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MetaTagContentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public labelParam(): LabelParamContext | null {
        return this.getRuleContext(0, LabelParamContext);
    }
    public iconParam(): IconParamContext | null {
        return this.getRuleContext(0, IconParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_metaTagContent;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitMetaTagContent) {
            return visitor.visitMetaTagContent(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LabelParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_LABEL(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_LABEL, 0)!;
    }
    public BACKTICK_STRING(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_labelParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitLabelParam) {
            return visitor.visitLabelParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IconParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_ICON(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_ICON, 0)!;
    }
    public BACKTICK_STRING(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_iconParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitIconParam) {
            return visitor.visitIconParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IntroContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_INTRO(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_INTRO, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_intro;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitIntro) {
            return visitor.visitIntro(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class OutroContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_OUTRO(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_OUTRO, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_outro;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitOutro) {
            return visitor.visitOutro(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MainSequenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_MAIN_SEQUENCE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_MAIN_SEQUENCE, 0)!;
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public catchArea(): CatchAreaContext | null {
        return this.getRuleContext(0, CatchAreaContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_mainSequence;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitMainSequence) {
            return visitor.visitMainSequence(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public simpleStep(): SimpleStepContext | null {
        return this.getRuleContext(0, SimpleStepContext);
    }
    public breakStep(): BreakStepContext | null {
        return this.getRuleContext(0, BreakStepContext);
    }
    public sourceStep(): SourceStepContext | null {
        return this.getRuleContext(0, SourceStepContext);
    }
    public whileStep(): WhileStepContext | null {
        return this.getRuleContext(0, WhileStepContext);
    }
    public doWhileStep(): DoWhileStepContext | null {
        return this.getRuleContext(0, DoWhileStepContext);
    }
    public ifElseStep(): IfElseStepContext | null {
        return this.getRuleContext(0, IfElseStepContext);
    }
    public ifStep(): IfStepContext | null {
        return this.getRuleContext(0, IfStepContext);
    }
    public caseStep(): CaseStepContext | null {
        return this.getRuleContext(0, CaseStepContext);
    }
    public subsequenceStep(): SubsequenceStepContext | null {
        return this.getRuleContext(0, SubsequenceStepContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_step;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitStep) {
            return visitor.visitStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SimpleStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_SIMPLE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SIMPLE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext | null {
        return this.getRuleContext(0, EditContainerTailContext);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_simpleStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitSimpleStep) {
            return visitor.visitSimpleStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BreakStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_BREAK(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_BREAK, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext | null {
        return this.getRuleContext(0, EditContainerTailContext);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_breakStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitBreakStep) {
            return visitor.visitBreakStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SourceStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_SOURCE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SOURCE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.ID, 0)!;
    }
    public editContainerTail(): EditContainerTailContext | null {
        return this.getRuleContext(0, EditContainerTailContext);
    }
    public KW_SOURCE_STEP(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_SOURCE_STEP, 0);
    }
    public STEP_ID(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.STEP_ID, 0);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_sourceStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitSourceStep) {
            return visitor.visitSourceStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class WhileStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_WHILE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_WHILE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public KW_BAR_WIDTH(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_BAR_WIDTH, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.INT, 0);
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public catchArea(): CatchAreaContext | null {
        return this.getRuleContext(0, CatchAreaContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_whileStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitWhileStep) {
            return visitor.visitWhileStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DoWhileStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_DO_WHILE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_DO_WHILE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public KW_BAR_WIDTH(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_BAR_WIDTH, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.INT, 0);
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_doWhileStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitDoWhileStep) {
            return visitor.visitDoWhileStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfElseStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_IF_ELSE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_IF_ELSE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public ifBranch(): IfBranchContext {
        return this.getRuleContext(0, IfBranchContext)!;
    }
    public elseBranch(): ElseBranchContext {
        return this.getRuleContext(0, ElseBranchContext)!;
    }
    public KW_IF_RATIO(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_IF_RATIO, 0);
    }
    public PERCENT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.PERCENT, 0);
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_ifElseStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitIfElseStep) {
            return visitor.visitIfElseStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_IF(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_IF, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public ifBranch(): IfBranchContext {
        return this.getRuleContext(0, IfBranchContext)!;
    }
    public KW_EMPTY_WIDTH(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_EMPTY_WIDTH, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.INT, 0);
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_ifStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitIfStep) {
            return visitor.visitIfStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CaseStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CASE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_CASE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public defaultBranch(): DefaultBranchContext {
        return this.getRuleContext(0, DefaultBranchContext)!;
    }
    public caseBranch(): CaseBranchContext[];
    public caseBranch(i: number): CaseBranchContext | null;
    public caseBranch(i?: number): CaseBranchContext[] | CaseBranchContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CaseBranchContext);
        }

        return this.getRuleContext(i, CaseBranchContext);
    }
    public KW_COLS(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLS, 0);
    }
    public PERCENT(): antlr.TerminalNode[];
    public PERCENT(i: number): antlr.TerminalNode | null;
    public PERCENT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SpecmanModel_V002Parser.PERCENT);
    	} else {
    		return this.getToken(SpecmanModel_V002Parser.PERCENT, i);
    	}
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_caseStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitCaseStep) {
            return visitor.visitCaseStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SubsequenceStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_SUBSEQUENCE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SUBSEQUENCE, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public stepId(): StepIdContext {
        return this.getRuleContext(0, StepIdContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public KW_FLAT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_FLAT, 0);
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public decoParam(): DecoParamContext | null {
        return this.getRuleContext(0, DecoParamContext);
    }
    public shadeParam(): ShadeParamContext | null {
        return this.getRuleContext(0, ShadeParamContext);
    }
    public tagsParam(): TagsParamContext | null {
        return this.getRuleContext(0, TagsParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public catchArea(): CatchAreaContext | null {
        return this.getRuleContext(0, CatchAreaContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_subsequenceStep;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitSubsequenceStep) {
            return visitor.visitSubsequenceStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfBranchContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_IF_BRANCH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_IF_BRANCH, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public catchArea(): CatchAreaContext | null {
        return this.getRuleContext(0, CatchAreaContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_ifBranch;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitIfBranch) {
            return visitor.visitIfBranch(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElseBranchContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_ELSE_BRANCH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_ELSE_BRANCH, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public catchArea(): CatchAreaContext | null {
        return this.getRuleContext(0, CatchAreaContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_elseBranch;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitElseBranch) {
            return visitor.visitElseBranch(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefaultBranchContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_DEFAULT_BRANCH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_DEFAULT_BRANCH, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_defaultBranch;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitDefaultBranch) {
            return visitor.visitDefaultBranch(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CaseBranchContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CASE_BRANCH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_CASE_BRANCH, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_caseBranch;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitCaseBranch) {
            return visitor.visitCaseBranch(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CatchAreaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CATCH_AREA(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_CATCH_AREA, 0);
    }
    public catchAreaParam(): CatchAreaParamContext[];
    public catchAreaParam(i: number): CatchAreaParamContext | null;
    public catchAreaParam(i?: number): CatchAreaParamContext[] | CatchAreaParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CatchAreaParamContext);
        }

        return this.getRuleContext(i, CatchAreaParamContext);
    }
    public catchBlock(): CatchBlockContext[];
    public catchBlock(i: number): CatchBlockContext | null;
    public catchBlock(i?: number): CatchBlockContext[] | CatchBlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CatchBlockContext);
        }

        return this.getRuleContext(i, CatchBlockContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_catchArea;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitCatchArea) {
            return visitor.visitCatchArea(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CatchAreaParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_COLLAPSED(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLLAPSED, 0);
    }
    public KW_COLS(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLS, 0);
    }
    public PERCENT(): antlr.TerminalNode[];
    public PERCENT(i: number): antlr.TerminalNode | null;
    public PERCENT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SpecmanModel_V002Parser.PERCENT);
    	} else {
    		return this.getToken(SpecmanModel_V002Parser.PERCENT, i);
    	}
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_catchAreaParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitCatchAreaParam) {
            return visitor.visitCatchAreaParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CatchBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CATCH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_CATCH, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public editContainerTail(): EditContainerTailContext {
        return this.getRuleContext(0, EditContainerTailContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public KW_HEADING_WIDTH(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_HEADING_WIDTH, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.INT, 0);
    }
    public coCatch(): CoCatchContext[];
    public coCatch(i: number): CoCatchContext | null;
    public coCatch(i?: number): CoCatchContext[] | CoCatchContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CoCatchContext);
        }

        return this.getRuleContext(i, CoCatchContext);
    }
    public step(): StepContext[];
    public step(i: number): StepContext | null;
    public step(i?: number): StepContext[] | StepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StepContext);
        }

        return this.getRuleContext(i, StepContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_catchBlock;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitCatchBlock) {
            return visitor.visitCatchBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CoCatchContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CO_CATCH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_CO_CATCH, 0)!;
    }
    public stepNum(): StepNumContext {
        return this.getRuleContext(0, StepNumContext)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_coCatch;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitCoCatch) {
            return visitor.visitCoCatch(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EditContainerHeadContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public htmlContent(): HtmlContentContext {
        return this.getRuleContext(0, HtmlContentContext)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_editContainerHead;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitEditContainerHead) {
            return visitor.visitEditContainerHead(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EditContainerTailContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public area(): AreaContext[];
    public area(i: number): AreaContext | null;
    public area(i?: number): AreaContext[] | AreaContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AreaContext);
        }

        return this.getRuleContext(i, AreaContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_editContainerTail;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitEditContainerTail) {
            return visitor.visitEditContainerTail(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AreaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public listBlock(): ListBlockContext | null {
        return this.getRuleContext(0, ListBlockContext);
    }
    public textArea(): TextAreaContext | null {
        return this.getRuleContext(0, TextAreaContext);
    }
    public tableBlock(): TableBlockContext | null {
        return this.getRuleContext(0, TableBlockContext);
    }
    public imageBlock(): ImageBlockContext | null {
        return this.getRuleContext(0, ImageBlockContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_area;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitArea) {
            return visitor.visitArea(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ListBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_LIST(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_LIST, 0)!;
    }
    public KW_ORDERED(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_ORDERED, 0)!;
    }
    public boolVal(): BoolValContext {
        return this.getRuleContext(0, BoolValContext)!;
    }
    public listItem(): ListItemContext[];
    public listItem(i: number): ListItemContext | null;
    public listItem(i?: number): ListItemContext[] | ListItemContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ListItemContext);
        }

        return this.getRuleContext(i, ListItemContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_listBlock;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitListBlock) {
            return visitor.visitListBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ListItemContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_ITEM(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_ITEM, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public listItemTail(): ListItemTailContext | null {
        return this.getRuleContext(0, ListItemTailContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_listItem;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitListItem) {
            return visitor.visitListItem(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ListItemTailContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public textArea(): TextAreaContext[];
    public textArea(i: number): TextAreaContext | null;
    public textArea(i?: number): TextAreaContext[] | TextAreaContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TextAreaContext);
        }

        return this.getRuleContext(i, TextAreaContext);
    }
    public tableBlock(): TableBlockContext[];
    public tableBlock(i: number): TableBlockContext | null;
    public tableBlock(i?: number): TableBlockContext[] | TableBlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableBlockContext);
        }

        return this.getRuleContext(i, TableBlockContext);
    }
    public imageBlock(): ImageBlockContext[];
    public imageBlock(i: number): ImageBlockContext | null;
    public imageBlock(i?: number): ImageBlockContext[] | ImageBlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ImageBlockContext);
        }

        return this.getRuleContext(i, ImageBlockContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_listItemTail;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitListItemTail) {
            return visitor.visitListItemTail(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TextAreaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_TEXT(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_TEXT, 0)!;
    }
    public htmlContent(): HtmlContentContext {
        return this.getRuleContext(0, HtmlContentContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_textArea;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTextArea) {
            return visitor.visitTextArea(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TableBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_TABLE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_TABLE, 0)!;
    }
    public KW_WIDTH(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_WIDTH, 0)!;
    }
    public PERCENT(): antlr.TerminalNode[];
    public PERCENT(i: number): antlr.TerminalNode | null;
    public PERCENT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SpecmanModel_V002Parser.PERCENT);
    	} else {
    		return this.getToken(SpecmanModel_V002Parser.PERCENT, i);
    	}
    }
    public KW_COLS(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_COLS, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public tableRow(): TableRowContext[];
    public tableRow(i: number): TableRowContext | null;
    public tableRow(i?: number): TableRowContext[] | TableRowContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableRowContext);
        }

        return this.getRuleContext(i, TableRowContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tableBlock;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTableBlock) {
            return visitor.visitTableBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TableRowContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_ROW(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_ROW, 0)!;
    }
    public tableCell(): TableCellContext[];
    public tableCell(i: number): TableCellContext | null;
    public tableCell(i?: number): TableCellContext[] | TableCellContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableCellContext);
        }

        return this.getRuleContext(i, TableCellContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tableRow;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTableRow) {
            return visitor.visitTableRow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TableCellContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CELL(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_CELL, 0)!;
    }
    public editContainerHead(): EditContainerHeadContext {
        return this.getRuleContext(0, EditContainerHeadContext)!;
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public editContainerTail(): EditContainerTailContext | null {
        return this.getRuleContext(0, EditContainerTailContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tableCell;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTableCell) {
            return visitor.visitTableCell(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ImageBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_IMAGE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_IMAGE, 0)!;
    }
    public KW_SCALE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SCALE, 0)!;
    }
    public PERCENT(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.PERCENT, 0)!;
    }
    public KW_TYPE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_TYPE, 0)!;
    }
    public ID(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.ID, 0);
    }
    public BASE64_BLOCK(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.BASE64_BLOCK, 0);
    }
    public changeParam(): ChangeParamContext | null {
        return this.getRuleContext(0, ChangeParamContext);
    }
    public KW_PLANTUML(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_PLANTUML, 0);
    }
    public BACKTICK_STRING(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0);
    }
    public backupAttr(): BackupAttrContext | null {
        return this.getRuleContext(0, BackupAttrContext);
    }
    public KW_SVG(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_SVG, 0);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_imageBlock;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitImageBlock) {
            return visitor.visitImageBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BackupAttrContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_BACKUP(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_BACKUP, 0)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.ID, 0)!;
    }
    public BACKTICK_STRING(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_backupAttr;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitBackupAttr) {
            return visitor.visitBackupAttr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class HtmlContentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BACKTICK_STRING(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0)!;
    }
    public plainAttr(): PlainAttrContext | null {
        return this.getRuleContext(0, PlainAttrContext);
    }
    public markupsAttr(): MarkupsAttrContext | null {
        return this.getRuleContext(0, MarkupsAttrContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_htmlContent;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitHtmlContent) {
            return visitor.visitHtmlContent(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PlainAttrContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_PLAIN(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_PLAIN, 0)!;
    }
    public BACKTICK_STRING(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_plainAttr;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitPlainAttr) {
            return visitor.visitPlainAttr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MarkupsAttrContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_MARKUPS(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_MARKUPS, 0)!;
    }
    public markup(): MarkupContext[];
    public markup(i: number): MarkupContext | null;
    public markup(i?: number): MarkupContext[] | MarkupContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MarkupContext);
        }

        return this.getRuleContext(i, MarkupContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_markupsAttr;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitMarkupsAttr) {
            return visitor.visitMarkupsAttr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MarkupContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SpecmanModel_V002Parser.INT);
    	} else {
    		return this.getToken(SpecmanModel_V002Parser.INT, i);
    	}
    }
    public markupType(): MarkupTypeContext {
        return this.getRuleContext(0, MarkupTypeContext)!;
    }
    public ID(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.ID, 0);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_markup;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitMarkup) {
            return visitor.visitMarkup(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MarkupTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_markupType;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitMarkupType) {
            return visitor.visitMarkupType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ChangeParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_CHANGE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_CHANGE, 0)!;
    }
    public changeType(): ChangeTypeContext {
        return this.getRuleContext(0, ChangeTypeContext)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.ID, 0)!;
    }
    public KW_SOURCE_STEP(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.KW_SOURCE_STEP, 0);
    }
    public STEP_ID(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.STEP_ID, 0);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_changeParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitChangeParam) {
            return visitor.visitChangeParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DecoParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_DECO(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_DECO, 0)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.ID, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_decoParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitDecoParam) {
            return visitor.visitDecoParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ShadeParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_SHADE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SHADE, 0)!;
    }
    public COLOR_HEX(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.COLOR_HEX, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_shadeParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitShadeParam) {
            return visitor.visitShadeParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TagsParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_TAGS(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_TAGS, 0)!;
    }
    public tagRef(): TagRefContext[];
    public tagRef(i: number): TagRefContext | null;
    public tagRef(i?: number): TagRefContext[] | TagRefContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TagRefContext);
        }

        return this.getRuleContext(i, TagRefContext);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tagsParam;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTagsParam) {
            return visitor.visitTagsParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TagRefContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public tagId(): TagIdContext {
        return this.getRuleContext(0, TagIdContext)!;
    }
    public BACKTICK_STRING(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tagRef;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTagRef) {
            return visitor.visitTagRef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TagIdContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BACKTICK_STRING(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.BACKTICK_STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_tagId;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitTagId) {
            return visitor.visitTagId(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ChangeTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KW_SOURCE(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.KW_SOURCE, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_changeType;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitChangeType) {
            return visitor.visitChangeType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BoolValContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_boolVal;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitBoolVal) {
            return visitor.visitBoolVal(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StepNumContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.INT, 0);
    }
    public STEP_NUM(): antlr.TerminalNode | null {
        return this.getToken(SpecmanModel_V002Parser.STEP_NUM, 0);
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_stepNum;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitStepNum) {
            return visitor.visitStepNum(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StepIdContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public STEP_ID(): antlr.TerminalNode {
        return this.getToken(SpecmanModel_V002Parser.STEP_ID, 0)!;
    }
    public override get ruleIndex(): number {
        return SpecmanModel_V002Parser.RULE_stepId;
    }
    public override accept<Result>(visitor: SpecmanModel_V002Visitor<Result>): Result | null {
        if (visitor.visitStepId) {
            return visitor.visitStepId(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
