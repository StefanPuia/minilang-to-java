package co.uk.stefanpuia.minilang2java.controller;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionInit;
import static co.uk.stefanpuia.minilang2java.TestObjects.conversionRequestOptions;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.controller.dto.ConvertRequestDto;
import co.uk.stefanpuia.minilang2java.controller.dto.ConvertResponseDto;
import co.uk.stefanpuia.minilang2java.core.convert.Converter;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ConvertControllerTest {
  @Mock private Converter converter;
  @Mock private ConversionService conversionService;
  @InjectMocks private ConvertController controller;

  @Test
  void shouldPostConvert() {
    // Given
    final var requestDto =
        new ConvertRequestDto("", MethodMode.UTIL, "someName", conversionRequestOptions());
    final String someOutput = RandomString.make();
    doReturn(someOutput).when(converter).convert(any(ConversionInit.class));
    doReturn(conversionInit()).when(conversionService).convert(requestDto, ConversionInit.class);

    // When
    final var response = controller.postConvert(requestDto);

    // Then
    then(response).isNotNull().extracting(ResponseEntity::getStatusCode).isEqualTo(HttpStatus.OK);
    then(response)
        .extracting(ResponseEntity::getBody)
        .isEqualTo(new ConvertResponseDto(someOutput));
  }
}
