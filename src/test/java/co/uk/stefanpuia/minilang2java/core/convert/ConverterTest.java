package co.uk.stefanpuia.minilang2java.core.convert;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionInit;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXmlReader;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.BeanFactory;

@ExtendWith(MockitoExtension.class)
class ConverterTest {
  @Mock private PositionalXmlReader reader;
  @Mock private BeanFactory beanFactory;

  @InjectMocks @Spy private Converter converter;

  @BeforeEach
  void setUp() {
    doReturn(reader).when(converter).getReader(any(ConversionContext.class));
  }

  @Test
  void shouldConvertEmptySource() throws MinilangConversionException {
    doReturn(List.of()).when(reader).readTags(any());
    final String output = converter.convert(conversionInit());
    then(output).isNotEmpty().contains("// INFO: Finished parsing");
  }

  @Test
  void shouldWrapMinilangConversionException() throws MinilangConversionException {
    final String exceptionMessage = RandomString.make();
    doThrow(new MinilangConversionException(exceptionMessage)).when(reader).readTags(any());

    final String output = converter.convert(conversionInit());

    then(output).isNotEmpty().contains(exceptionMessage).contains("// INFO: Finished parsing");
  }

  @Test
  void shouldConvertElements() throws MinilangConversionException {
    final String convertedTag = RandomString.make();
    final Tag tag = mock(Tag.class);
    doReturn(List.of(convertedTag)).when(tag).convert();
    doReturn(List.of(tag)).when(reader).readTags(any());

    final String output = converter.convert(conversionInit());

    then(output).isNotEmpty().contains(convertedTag).contains("// INFO: Finished parsing");
  }

  @Test
  void shouldTrimExtraNewlinesWhenConvertingElements() throws MinilangConversionException {
    final String convertedTag = RandomString.make();
    final Tag tag = mock(Tag.class);
    doReturn(List.of(convertedTag, "", "", "", "")).when(tag).convert();
    doReturn(List.of(tag)).when(reader).readTags(any());

    final String output = converter.convert(conversionInit());

    then(output)
        .isNotEmpty()
        .contains(convertedTag)
        .contains("// INFO: Finished parsing")
        .matches(str -> str.split("\n").length == 3, "line numbers");
  }
}
