package co.uk.stefanpuia.minilang2java.core.field;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FlexibleAccessorTest {
  final ConversionContext context = conversionContext();
  @Mock private Tag tag;

  @Test
  void shouldReturnMapAccessor() {
    then(FlexibleAccessor.from(tag, context, "someMap.someProperty"))
        .isInstanceOf(MapAccessor.class);
  }

  @Test
  void shouldReturnFieldAccessor() {
    then(FlexibleAccessor.from(tag, context, "someField")).isInstanceOf(FieldAccessor.class);
  }
}
