package co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventDispatcherTest {
  @Mock private SimpleMethod method;

  @Test
  void shouldConvert() {
    final EventDispatcher dispatcher = new EventDispatcher(conversionContext(), method);
    then(dispatcher.getConverted())
        .isEqualTo(
            "final LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute(\"dispatcher\");");
  }
}
