package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static java.nio.charset.StandardCharsets.UTF_8;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.SequenceInputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import javax.annotation.Nullable;
import lombok.AllArgsConstructor;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@AllArgsConstructor
@SuppressWarnings("PMD")
public class PositionalXMLReader {

  public static final String LINE_NUMBER_KEY_NAME = "lineNumber";
  private final ConversionContext context;
  private PositionalParserHandler handler;
  private XMLReader reader;

  private TagFactory tagFactory;

  public List<Tag> readXML(final String source) throws MinilangConversionException {
    try {
      reader.setProperty("http://xml.org/sax/properties/lexical-handler", handler);
      reader.setContentHandler(handler);
      reader.parse(new InputSource(wrapSource(source)));
      return handler.getRootElements().stream().map(this.wrapMinilangTag(null)).toList();
    } catch (IOException | SAXException e) {
      throw new MinilangConversionException(e);
    }
  }

  private Function<Element, Tag> wrapMinilangTag(@Nullable final Tag parent) {
    return element -> {
      final Tag tag =
          tagFactory.createTag(element.getTagName(), new TagInit(context, element, parent));

      final NodeList childNodes = element.getChildNodes();
      for (int i = 0; i < childNodes.getLength(); i++) {
        final Node item = childNodes.item(i);
        if (item instanceof Element) {
          tag.appendChild(wrapMinilangTag(tag).apply((Element) item));
        }
      }

      return tag;
    };
  }

  private SequenceInputStream wrapSource(final String source) {
    return new SequenceInputStream(
        Collections.enumeration(
            Arrays.asList(
                new ByteArrayInputStream("<xml-root>".getBytes(UTF_8)),
                sanitizeSource(source),
                new ByteArrayInputStream("</xml-root>".getBytes(UTF_8)))));
  }

  private InputStream sanitizeSource(final String source) {
    return new ByteArrayInputStream(source.replaceFirst("<\\?.+?\\?>", "").getBytes(UTF_8));
  }
}
