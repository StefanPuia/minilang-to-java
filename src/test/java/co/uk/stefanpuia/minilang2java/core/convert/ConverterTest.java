package co.uk.stefanpuia.minilang2java.core.convert;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.conversionInit;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.BeanFactory;

@ExtendWith(MockitoExtension.class)
class ConverterTest {
  @Mock private PositionalXMLReader reader;
  @Mock private BeanFactory beanFactory;

  @BeforeEach
  void setUp() {
    doReturn(conversionContext()).when(beanFactory).getBean(eq(ConversionContext.class), any());
    doReturn(reader).when(beanFactory).getBean(eq(PositionalXMLReader.class), any());
  }

  @Test
  void shouldConvertEmptySource() throws MinilangConversionException {
    doReturn(List.of()).when(reader).readXML(any());
    final Converter converter = new Converter(beanFactory);

    final String output = converter.convert(conversionInit());

    then(output).isNotEmpty().contains("// INFO: Finished parsing");
  }

  @Test
  void shouldWrapMinilangConversionException() throws MinilangConversionException {
    final String exceptionMessage = RandomString.make();
    doThrow(new MinilangConversionException(exceptionMessage)).when(reader).readXML(any());
    final Converter converter = new Converter(beanFactory);

    final String output = converter.convert(conversionInit());

    then(output).isNotEmpty().contains(exceptionMessage).contains("// INFO: Finished parsing");
  }

  @Test
  void shouldConvertElements() throws MinilangConversionException {
    final String convertedTag = RandomString.make();
    final Tag tag = mock(Tag.class);
    doReturn(List.of(convertedTag)).when(tag).convert();
    doReturn(List.of(tag)).when(reader).readXML(any());
    final Converter converter = new Converter(beanFactory);

    final String output = converter.convert(conversionInit());

    then(output).isNotEmpty().contains(convertedTag).contains("// INFO: Finished parsing");
  }

  @Test
  void shouldTrimExtraNewlinesWhenConvertingElements() throws MinilangConversionException {
    final String convertedTag = RandomString.make();
    final Tag tag = mock(Tag.class);
    doReturn(List.of(convertedTag, "", "", "", "")).when(tag).convert();
    doReturn(List.of(tag)).when(reader).readXML(any());
    final Converter converter = new Converter(beanFactory);

    final String output = converter.convert(conversionInit());

    then(output)
        .isNotEmpty()
        .contains(convertedTag)
        .contains("// INFO: Finished parsing")
        .matches(str -> str.split("\n").length == 3, "line numbers");
  }
}
