package co.uk.stefanpuia.minilang2java.controller.mappers;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionRequestOptions;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.controller.dto.ConvertRequestDto;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import org.junit.jupiter.api.Test;

class ConvertRequestDtoToConversionConfigTest {
  private final ConvertRequestDtoToConversionConfig converter =
      new ConvertRequestDtoToConversionConfigImpl();

  @Test
  void shouldConvertLines() {
    final var config =
        converter.convert(
            new ConvertRequestDto("abc\ndef", null, null, conversionRequestOptions()));
    then(config).isNotNull().extracting(ConversionInit::lines).isEqualTo(2);
  }
}
