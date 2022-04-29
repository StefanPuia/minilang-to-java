package co.uk.stefanpuia.minilang2java.core.handler.error;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import java.util.List;
import org.junit.jupiter.api.Test;

class ServiceErrorHandlerTest {
  @Test
  void shouldReturnError() {
    final var context = conversionContext();
    final var handler = new ServiceErrorHandler(context);
    final List<String> strings = handler.returnError("\"some message\"");
    then(strings).hasSize(1).containsExactly("return returnError(\"some message\");");
    then(context.getStaticImports()).hasSize(1).containsExactly("ServiceUtil.returnError");
  }
}
