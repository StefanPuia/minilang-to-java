package co.uk.stefanpuia.minilang2java.core.handler.error;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import java.util.List;
import org.junit.jupiter.api.Test;

class UtilErrorHandlerTest {
  @Test
  void shouldReturnError() {
    final var context = conversionContext();
    final var handler = new UtilErrorHandler(context);
    final List<String> strings = handler.returnError("\"some message\"");
    then(strings).hasSize(1).containsExactly("throw new Exception(\"some message\");");
  }
}
