package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static java.nio.charset.StandardCharsets.UTF_8;

import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.SequenceInputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@AllArgsConstructor
@SuppressWarnings("PMD")
public class PositionalXMLReader {

  public static final String LINE_NUMBER_KEY_NAME = "lineNumber";

  private PositionalParserHandler handler;
  private XMLReader reader;

  public List<Tag> readXML(final String source) throws MinilangConversionException {
    try {
      reader.setProperty("http://xml.org/sax/properties/lexical-handler", handler);
      reader.setContentHandler(handler);
      reader.parse(new InputSource(wrapSource(source)));
      return handler.getRootElements();
    } catch (IOException | SAXException e) {
      throw new MinilangConversionException(e);
    }
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
