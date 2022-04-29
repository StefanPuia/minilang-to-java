package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.BDDAssertions.thenThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.io.IOException;
import java.util.List;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.internal.util.io.IOUtil;
import org.mockito.junit.jupiter.MockitoExtension;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@ExtendWith(MockitoExtension.class)
class PositionalXMLReaderTest {
  @Mock private PositionalParserHandler handler;
  @Mock private XMLReader reader;

  @Test
  void shouldReadXml() throws IOException, SAXException {
    // Given
    final var positionalXMLReader = new PositionalXMLReader(handler, reader);
    final IOException exception = new IOException();
    doThrow(exception).when(reader).parse(any(InputSource.class));

    // When - Then
    thenThrownBy(() -> positionalXMLReader.readXML("")).getCause().isEqualTo(exception);
  }

  @Test
  void shouldWrapException() throws MinilangConversionException {
    // Given
    final var mockTag = mock(Tag.class);
    doReturn(List.of(mockTag)).when(handler).getRootElements();
    final var positionalXMLReader = new PositionalXMLReader(handler, reader);

    // When
    final var tags = positionalXMLReader.readXML("");

    // Then
    then(tags).containsExactly(mockTag);
  }

  @Test
  void shouldWrapSource() throws MinilangConversionException, IOException, SAXException {
    // Given
    final String source = RandomString.make();
    final var positionalXMLReader = new PositionalXMLReader(handler, reader);
    final var inputSourceCaptor = ArgumentCaptor.forClass(InputSource.class);

    // When
    positionalXMLReader.readXML(source);

    // Then
    verify(reader).parse(inputSourceCaptor.capture());
    then(inputSourceCaptor.getValue())
        .extracting(InputSource::getByteStream)
        .extracting(IOUtil::readLines)
        .extracting(lines -> String.join("\n", lines))
        .matches(str -> str.contains("<xml-root>" + source + "</xml-root>"));
  }

  @Test
  void shouldRemoveXmlProlog() throws MinilangConversionException, IOException, SAXException {
    // Given
    final String source = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + RandomString.make();
    final var positionalXMLReader = new PositionalXMLReader(handler, reader);
    final var inputSourceCaptor = ArgumentCaptor.forClass(InputSource.class);

    // When
    positionalXMLReader.readXML(source);

    // Then
    verify(reader).parse(inputSourceCaptor.capture());
    then(inputSourceCaptor.getValue())
        .extracting(InputSource::getByteStream)
        .extracting(IOUtil::readLines)
        .extracting(lines -> String.join("\n", lines))
        .matches(str -> !str.contains("<?xml version"));
  }
}
