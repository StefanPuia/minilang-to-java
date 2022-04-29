package co.uk.stefanpuia.minilang2java.core.handler.error;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Test;

class EventErrorHandlerTest {
  @Test
  void shouldErrorReturn() {
    final var handler = new EventErrorHandler(conversionContext());
    final String errorValue = String.format("\"%s\"", make());
    final var errorLines = handler.returnError(errorValue);

    then(errorLines)
        .isNotEmpty()
        .containsExactly(
            String.format("request.setAttribute(\"_ERROR_MESSAGE_\", %s);", errorValue),
            "return \"error\";");
  }
}
