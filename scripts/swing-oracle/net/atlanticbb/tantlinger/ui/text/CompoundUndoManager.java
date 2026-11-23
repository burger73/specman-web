package net.atlanticbb.tantlinger.ui.text;

import javax.swing.text.Document;

/** Ersatz für die Specman-Klasse, die im SHEF-Jar fehlt: Undo spielt für die Referenz keine Rolle */
public class CompoundUndoManager {
  public static final Object UNDO = new Object();
  public static final Object REDO = new Object();
  public static void beginCompoundEdit(Document d) {}
  public static void endCompoundEdit(Document d) {}
}
