// Einstieg in den ANTLR-Parser (antlr-ng-generiert aus grammar/SpecmanModel_V002.g4).
import { BaseErrorListener, CharStream, CommonTokenStream, type ATNSimulator, type RecognitionException, type Recognizer, type Token } from 'antlr4ng';
import { SpecmanModel_V002Lexer } from './parser/SpecmanModel_V002Lexer.ts';
import { SpecmanModel_V002Parser, type DiagramContext } from './parser/SpecmanModel_V002Parser.ts';

export interface ParseError {
  line: number;
  column: number;
  message: string;
}

class CollectingErrorListener extends BaseErrorListener {
  readonly errors: ParseError[] = [];
  override syntaxError<S extends Token, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    _offendingSymbol: S | null,
    line: number,
    column: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push({ line, column, message: msg });
  }
}

export interface ParseResult {
  tree: DiagramContext;
  errors: ParseError[];
}

/** Parst eine komplette V2-Modelldatei (.nsd). Fehler werden gesammelt, nicht geworfen. */
export function parseDiagram(text: string): ParseResult {
  const listener = new CollectingErrorListener();
  const lexer = new SpecmanModel_V002Lexer(CharStream.fromString(text));
  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);
  const parser = new SpecmanModel_V002Parser(new CommonTokenStream(lexer));
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  const tree = parser.diagram();
  return { tree, errors: listener.errors };
}
