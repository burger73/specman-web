// Referenz für die Portierung: führt SHEF-Aktionen auf einem kopflosen JEditorPane aus und gibt den
// Body so aus, wie ModelSerializer_V002 ihn speichern würde.
// Aufruf: Oracle <html> <auswahl> <befehl>...
//   auswahl: "text" wählt das erste Vorkommen aus, "@text" setzt die Schreibmarke davor, "#a-b" Offsets
//   befehl: block:N  align:N  size:N  color:#rrggbb  font:Name|-  clear  bold  state
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.io.StringReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.swing.JEditorPane;
import javax.swing.text.Element;
import javax.swing.text.StyledEditorKit;
import javax.swing.text.html.HTMLDocument;
import javax.swing.text.html.HTMLEditorKit;
import net.atlanticbb.tantlinger.ui.text.HTMLUtils;
import net.atlanticbb.tantlinger.ui.text.WysiwygHTMLEditorKit;
import net.atlanticbb.tantlinger.ui.text.actions.*;

public class Oracle {
  public static void main(String[] args) throws Exception {
    JEditorPane ed = new JEditorPane();
    ed.setEditorKit(new WysiwygHTMLEditorKit());
    ed.setContentType("text/html");
    HTMLEditorKit kit = (HTMLEditorKit) ed.getEditorKit();
    kit.read(new StringReader(HTMLUtils.jEditorPaneizeHTML(args[0])), ed.getDocument(), 0);
    HTMLDocument doc = (HTMLDocument) ed.getDocument();
    String all = doc.getText(0, doc.getLength());
    String sel = args[1];
    if (sel.startsWith("#")) {
      String[] p = sel.substring(1).split("-");
      ed.select(Integer.parseInt(p[0]), Integer.parseInt(p[1]));
    } else if (sel.startsWith("@")) {
      ed.setCaretPosition(all.indexOf(sel.substring(1)));
    } else {
      int i = all.indexOf(sel);
      ed.setCaretPosition(i);
      ed.moveCaretPosition(i + sel.length());
    }
    for (int k = 2; k < args.length; k++) run(ed, args[k]);
    String text = ed.getText();
    Matcher m = Pattern.compile("<body>([\\s\\S]*?)</body>").matcher(text);
    System.out.println(m.find() ? m.group(1).trim() : text.trim());
  }

  static void run(JEditorPane ed, String cmd) {
    String[] c = cmd.split(":", 2);
    ActionEvent e = new ActionEvent(ed, 0, "");
    HTMLTextEditAction a = null;
    switch (c[0]) {
      case "block" -> a = new HTMLBlockAction(Integer.parseInt(c[1]));
      case "align" -> a = new HTMLAlignAction(Integer.parseInt(c[1]));
      case "size" -> a = new HTMLFontSizeAction(Integer.parseInt(c[1]));
      case "clear" -> a = new ClearStylesAction();
      case "bold" -> a = new HTMLInlineAction(HTMLInlineAction.BOLD);
      case "color" -> new StyledEditorKit.ForegroundAction("Color", Color.decode(c[1])).actionPerformed(e);
      case "font" -> HTMLUtils.setFontFamily(ed, c[1].equals("-") ? null : c[1]);
      case "type" -> ed.replaceSelection(c[1]);
      case "state" -> {
        HTMLDocument doc = (HTMLDocument) ed.getDocument();
        Element p = doc.getParagraphElement(ed.getCaretPosition());
        System.out.println("paragraph=" + p.getName() + " parent=" + p.getParentElement().getName()
            + " attrs=" + p.getAttributes() + " char=" + HTMLUtils.getCharacterAttributes(ed));
      }
      default -> throw new IllegalArgumentException(cmd);
    }
    if (a != null) {
      a.putContextValue(HTMLTextEditAction.EDITOR, ed);
      a.actionPerformed(e);
    }
  }
}
