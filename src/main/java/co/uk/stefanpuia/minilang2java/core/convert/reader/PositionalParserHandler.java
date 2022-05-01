package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader.LINE_NUMBER_KEY_NAME;

import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.xml.CommentElement;
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
  private final Document document;
  private final Stack<Element> elementStack = new Stack<>();
  private final StringBuilder textBuffer = new StringBuilder();
  private final List<Element> rootElements = new ArrayList<>();
  private Locator locator;

  public List<Element> getRootElements() {
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
    elementStack.push(createElement(qName, attributes));
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
    final Element parentElement = elementStack.peek();
    parentElement.appendChild(new CommentElement(new String(chars, start, length)));
  }

  @Override
  public void endElement(final String uri, final String localName, final String qName) {
    addTextIfNeeded();
    final Element closedElement = elementStack.pop();
    if (elementStack.isEmpty()) {
      rootElements.add(closedElement);
    } else {
      final Element parentElement = elementStack.peek();
      parentElement.appendChild(closedElement);
    }
  }

  @Override
  public void characters(final char[] chars, final int start, final int length) {
    textBuffer.append(chars, start, length);
  }

  private void addTextIfNeeded() {
    if (textBuffer.length() > 0) {
      final String textContent = textBuffer.toString();
      // .replaceAll("^\\s*?\\n+", "\n").replaceAll("\\n+\\s*$", "");
      if (OptionalString.isNotEmpty(textContent)) {
        final Node textNode = document.createTextNode(textContent);
        elementStack.peek().appendChild(textNode);
        textBuffer.delete(0, textBuffer.length());
      }
    }
  }
}
