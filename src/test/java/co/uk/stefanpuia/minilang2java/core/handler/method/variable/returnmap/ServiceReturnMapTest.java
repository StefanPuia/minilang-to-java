package co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ServiceReturnMapTest {
  @Mock private SimpleMethod method;

  @Test
  void shouldConvert() {
    final var context = conversionContext();
    final ServiceReturnMap returnMap = new ServiceReturnMap(context, method);
    then(returnMap.getConverted())
        .isEqualTo("final Map<String, Object> _returnMap = returnSuccess();");
    then(context.getStaticImports()).hasSize(1);
  }
}
