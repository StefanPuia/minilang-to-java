package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader.LINE_NUMBER_KEY_NAME;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.xml.CommentElement;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import lombok.RequiredArgsConstructor;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.Attributes;
import org.xml.sax.Locator;
import org.xml.sax.ext.DefaultHandler2;

@SuppressWarnings("PMD.AvoidStringBufferField")
@RequiredArgsConstructor
public class PositionalParserHandler extends DefaultHandler2 {
  private final ConversionContext context;
  private final Document document;
  private final Stack<Tag> tagStack = new Stack<>();
  private final StringBuilder textBuffer = new StringBuilder();
  private final List<Tag> rootElements = new ArrayList<>();
  private Locator locator;
  private Element element;

  public List<Tag> getRootElements() {
    return rootElements;
  }

  @Override
  public void setDocumentLocator(final Locator locator) {
    this.locator = locator;
  }

  @Override
  public void startElement(
      final String uri, final String localName, final String qName, final Attributes attributes) {
    addTextIfNeeded();
    element = createElement(qName, attributes);
    tagStack.push(TagFactory.createTag(element.getTagName(), new TagInit(context, element, null)));
  }

  private Element createElement(final String qName, final Attributes attributes) {
    final Element newElement = document.createElement(qName);
    for (int i = 0; i < attributes.getLength(); i++) {
      newElement.setAttribute(attributes.getQName(i), attributes.getValue(i));
    }
    newElement.setUserData(LINE_NUMBER_KEY_NAME, this.locator.getLineNumber(), null);
    return newElement;
  }

  @Override
  public void comment(final char[] chars, final int start, final int length) {
    final Tag parentTag = tagStack.peek();
    parentTag.appendChild(
        TagFactory.createTag(
            "!comment",
            new TagInit(context, new CommentElement(new String(chars, start, length)), parentTag)));
  }

  @Override
  public void endElement(final String uri, final String localName, final String qName) {
    addTextIfNeeded();
    final Tag closedTag = tagStack.pop();
    if (tagStack.isEmpty()) {
      rootElements.add(closedTag);
    } else {
      final Tag parentTag = tagStack.peek();
      parentTag.appendChild(closedTag);
    }
  }

  @Override
  public void characters(final char[] chars, final int start, final int length) {
    textBuffer.append(chars, start, length);
  }

  private void addTextIfNeeded() {
    if (textBuffer.length() > 0) {
      final String textContent = textBuffer.toString().trim();
      if (OptionalString.isNotEmpty(textContent)) {
        final Node textNode = document.createTextNode(textContent);
        element.appendChild(textNode);
        textBuffer.delete(0, textBuffer.length());
      }
    }
  }
}
