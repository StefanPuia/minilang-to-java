package co.uk.stefanpuia.minilang2java.controller;

import co.uk.stefanpuia.minilang2java.controller.dto.ConvertResponseDto;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class ExceptionController {
  @ExceptionHandler(TagInstantiationException.class)
  public ResponseEntity<ConvertResponseDto> handleTagInstantiationException(
      final TagInstantiationException exception) {
    return ResponseEntity.internalServerError()
        .body(new ConvertResponseDto(exception.getMessage()));
  }
}
