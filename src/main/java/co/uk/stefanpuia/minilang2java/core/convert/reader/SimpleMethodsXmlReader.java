package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static java.util.function.Predicate.not;

import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.model.SimpleMethodsElement;
import co.uk.stefanpuia.minilang2java.core.model.exception.SimpleMethodsElementsReadException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@SuppressWarnings("PMD")
@Component
public class SimpleMethodsXmlReader {
  @Value("classpath:simple-methods.xsd")
  private Resource simpleMethods;

  private Stream<Node> readXsd(final PositionalParserHandler handler, final XMLReader reader)
      throws SimpleMethodsElementsReadException {
    try {
      reader.setProperty("http://xml.org/sax/properties/lexical-handler", handler);
      reader.setContentHandler(handler);
      reader.parse(new InputSource(simpleMethods.getInputStream()));
      final NodeList children = handler.getRootElements().get(0).getChildNodes();
      return IntStream.range(0, children.getLength()).mapToObj(children::item);
    } catch (IOException | SAXException e) {
      throw new SimpleMethodsElementsReadException(e);
    }
  }

  public List<SimpleMethodsElement> getElements(
      final PositionalParserHandler handler, final XMLReader reader)
      throws SimpleMethodsElementsReadException {
    return readXsd(handler, reader)
        .filter(this::isElement)
        .filter(not(this::isAbstractElement))
        .map(this::convert)
        .sorted()
        .toList();
  }

  private boolean isElement(final Node element) {
    return "xs:element".equals(element.getNodeName());
  }

  private SimpleMethodsElement convert(final Node element) {
    return new SimpleMethodsElement(getAttribute(element, "name"), getDocumentation(element));
  }

  private String getDocumentation(final Node element) {
    final NodeList elementChildren = element.getChildNodes();
    for (int i = 0; i < elementChildren.getLength(); i++) {
      final Node annotation = elementChildren.item(i);
      if ("xs:annotation".equals(annotation.getNodeName())) {
        final NodeList annotationChildNodes = annotation.getChildNodes();
        for (int j = 0; j < annotationChildNodes.getLength(); j++) {
          final Node documentation = annotationChildNodes.item(j);
          if ("xs:documentation".equals(documentation.getNodeName())) {
            return OptionalString.of(documentation.getTextContent())
                .map(String::strip)
                .map(str -> str.replaceAll("\\s{3,}", " "))
                .orElse("");
          }
        }
      }
    }
    return "";
  }

  private boolean isAbstractElement(final Node element) {
    return "true".equals(getAttribute(element, "abstract"));
  }

  private String getAttribute(final Node element, final String attribute) {
    return Optional.ofNullable(element.getAttributes().getNamedItem(attribute))
        .map(Node::getNodeValue)
        .orElse(null);
  }
}
