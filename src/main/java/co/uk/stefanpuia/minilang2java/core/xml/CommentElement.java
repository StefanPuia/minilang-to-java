package co.uk.stefanpuia.minilang2java.core.xml;

import co.uk.stefanpuia.minilang2java.core.xml.impl.AbstractElement;

public class CommentElement extends AbstractElement {
  private final String comment;

  public CommentElement(final String comment) {
    super();
    this.comment = comment;
  }

  @Override
  public String getTextContent() {
    return comment;
  }

  @Override
  public String getTagName() {
    return "!comment";
  }
}
