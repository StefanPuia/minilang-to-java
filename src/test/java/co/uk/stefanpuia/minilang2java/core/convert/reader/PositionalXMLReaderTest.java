package co.uk.stefanpuia.minilang2java.core.convert.reader;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.BDDAssertions.thenThrownBy;
import static org.mockito.Answers.RETURNS_MOCKS;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.Validation;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.io.IOUtil;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@ExtendWith(MockitoExtension.class)
class PositionalXMLReaderTest {
  private final ConversionContext context = conversionContext();
  @Mock private PositionalParserHandler handler;
  @Mock private XMLReader reader;
  @Mock private TagFactory tagFactory;
  @Mock private Validation validation;

  @InjectMocks private PositionalXMLReader positionalXMLReader;

  @Test
  void shouldWrapException() throws IOException, SAXException {
    // Given
    final IOException exception = new IOException();
    doThrow(exception).when(reader).parse(any(InputSource.class));

    // When - Then
    thenThrownBy(() -> positionalXMLReader.readXML("")).getCause().isEqualTo(exception);
  }

  @Test
  void shouldReadXml() throws MinilangConversionException {
    // Given
    final String tagName = make();
    final var mockElement = mock(Element.class);
    final var mockTag = mock(Tag.class);
    doReturn(tagName).when(mockElement).getTagName();
    doReturn(mock(NodeList.class)).when(mockElement).getChildNodes();
    doReturn(mockTag).when(tagFactory).createTag(tagName, new TagInit(context, mockElement, null));
    doReturn(List.of(mockElement)).when(handler).getRootElements();
    final var positionalXMLReader =
        new PositionalXMLReader(context, handler, reader, tagFactory, validation);

    // When
    final var tags = positionalXMLReader.readXML("");

    // Then
    then(tags).containsExactly(mockTag);
  }

  @Test
  void shouldReadXmlWithChildren() throws MinilangConversionException {
    // Given
    final String tagName = make();
    final var mockElement = mock(Element.class);
    final var mockTag = mock(Tag.class);
    doReturn(tagName).when(mockElement).getTagName();
    final NodeList childNodesMock = mock(NodeList.class);
    doReturn(2).when(childNodesMock).getLength();
    doReturn(mock(Node.class)).when(childNodesMock).item(0);
    doReturn(mock(Element.class, RETURNS_MOCKS)).when(childNodesMock).item(1);
    doReturn(childNodesMock).when(mockElement).getChildNodes();
    doReturn(mockTag).when(tagFactory).createTag(tagName, new TagInit(context, mockElement, null));
    doReturn(List.of(mockElement)).when(handler).getRootElements();
    final var positionalXMLReader =
        new PositionalXMLReader(context, handler, reader, tagFactory, validation);

    // When
    final var tags = positionalXMLReader.readXML("");

    // Then
    then(tags).containsExactly(mockTag);
  }

  @Test
  void shouldWrapSource() throws MinilangConversionException, IOException, SAXException {
    // Given
    final String source = make();
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
    final String source = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + make();
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
