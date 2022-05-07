package co.uk.stefanpuia.minilang2java.core.field;

import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.tag.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FlexibleAccessorTest {
  @Mock private Tag tag;

  @Test
  void shouldReturnMapAccessor() {
    then(FlexibleAccessor.from(tag, "someMap.someProperty")).isInstanceOf(MapAccessor.class);
  }

  @Test
  void shouldReturnFieldAccessor() {
    then(FlexibleAccessor.from(tag, "someField")).isInstanceOf(FieldAccessor.class);
  }
}
