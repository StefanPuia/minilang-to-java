package co.uk.stefanpuia.minilang2java.controller;

import static java.util.Objects.requireNonNull;

import co.uk.stefanpuia.minilang2java.controller.dto.ConvertRequestDto;
import co.uk.stefanpuia.minilang2java.controller.dto.ConvertResponseDto;
import co.uk.stefanpuia.minilang2java.core.convert.Converter;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/convert")
@AllArgsConstructor
public class ConvertController {

  private final Converter converter;
  private final ConversionService conversionService;

  @PostMapping
  public ResponseEntity<ConvertResponseDto> postConvert(
      @RequestBody final ConvertRequestDto requestDto) {
    return ResponseEntity.ok(
        new ConvertResponseDto(
            converter.convert(
                requireNonNull(conversionService.convert(requestDto, ConversionInit.class)))));
  }
}
