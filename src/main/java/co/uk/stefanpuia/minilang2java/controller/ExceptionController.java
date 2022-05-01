package co.uk.stefanpuia.minilang2java.controller;

import co.uk.stefanpuia.minilang2java.controller.dto.ConvertErrorResponseDto;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class ExceptionController {
  @ExceptionHandler(TagInstantiationException.class)
  public ResponseEntity<ConvertErrorResponseDto> handleTagInstantiationException(
      final TagInstantiationException exception) {
    return ResponseEntity.internalServerError()
        .body(new ConvertErrorResponseDto(exception.getMessage()));
  }
}
