package co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventLocaleTest {

  private final ConversionContext context = conversionContext();
  @Mock private SimpleMethod method;

  @Test
  void shouldConvertIfUsed() {
    final String converted = new EventLocale(context, method).getConverted();

    then(converted).isEqualTo("final Locale locale = (Locale) request.getAttribute(\"locale\");");
  }
}
