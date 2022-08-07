package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static co.uk.stefanpuia.minilang2java.core.TagFactory.COMMENT_TAG_NAME;
import static java.nio.charset.StandardCharsets.UTF_8;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.Validation;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import com.sun.org.apache.xerces.internal.dom.ElementImpl;
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
import org.w3c.dom.Comment;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@SuppressWarnings("PMD")
@AllArgsConstructor
public class PositionalXmlReader {

  public static final String LINE_NUMBER_KEY_NAME = "lineNumber";
  private final ConversionContext context;
  private final PositionalParserHandler handler;
  private final XMLReader reader;
  private final TagFactory tagFactory;
  private final Validation validation;

  public List<Tag> readTags(final String source) throws MinilangConversionException {
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
        if (item instanceof Comment) {
          tag.appendChild(wrapCommentTag((Comment) item, parent));
        }
      }

      validation.validate(tag, context);
      return tag;
    };
  }

  private Tag wrapCommentTag(final Comment item, final Tag parent) {
    final ElementImpl comment =
        new ElementImpl((CoreDocumentImpl) item.getOwnerDocument(), COMMENT_TAG_NAME);
    comment.setTextContent(item.getTextContent());
    return tagFactory.createTag(COMMENT_TAG_NAME, new TagInit(context, comment, parent));
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
