package co.uk.stefanpuia.minilang2java.tag;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;

import java.util.List;
import org.junit.jupiter.api.Test;

class NonElementTagTest {
  @Test
  void shouldNotHaveElement() {
    final var tag =
        new NonElementTag(conversionContext(), null) {

          @Override
          public List<String> convert() {
            return null;
          }
        };

    then(tag.getElement()).isNull();
  }
}
