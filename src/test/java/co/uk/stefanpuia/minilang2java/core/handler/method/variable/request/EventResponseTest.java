package co.uk.stefanpuia.minilang2java.core.handler.method.variable.request;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventResponseTest {
  @Mock private SimpleMethod method;

  @Test
  void shouldConvert() {
    final EventResponse response = new EventResponse(conversionContext(), method);
    then(response.getConverted()).isEqualTo("final HttpServletResponse response");
  }
}
