package co.uk.stefanpuia.minilang2java.core.xml;

import com.sun.org.apache.xerces.internal.dom.CommentImpl;
import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import org.w3c.dom.Document;

public class CommentElement extends CommentImpl {

  public static final String COMMENT_TAG_NAME = "!comment";
  private final String comment;

  public CommentElement(final String comment, final Document ownerDocument) {
    super((CoreDocumentImpl) ownerDocument, comment);
    this.comment = comment;
  }

  @Override
  public String getTextContent() {
    return comment;
  }

  public String getTagName() {
    return COMMENT_TAG_NAME;
  }
}
