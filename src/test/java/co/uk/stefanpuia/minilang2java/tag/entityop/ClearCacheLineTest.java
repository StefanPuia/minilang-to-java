package co.uk.stefanpuia.minilang2java.tag.entityop;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.BDDAssertions.thenThrownBy;

import co.uk.stefanpuia.minilang2java.core.model.exception.TagConversionException;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ClearCacheLineTest {
  @Test
  void shouldHaveRules() {
    final var clearCacheLine = new ClearCacheLine(tagInit());
    then(clearCacheLine.getRules().getRules()).isNotEmpty();
  }

  @Test
  void shouldThrowExceptionForEmptyEntity() {
    final var clearCacheLine =
        new ClearCacheLine(tagInit(new AttributeElement(Map.of("entity-name", ""))));
    thenThrownBy(clearCacheLine::convert)
        .isInstanceOf(TagConversionException.class)
        .hasMessage("[entity-name] is empty");
  }

  @Test
  void shouldConvertWithoutMap() {
    final var clearCacheLine =
        new ClearCacheLine(tagInit(new AttributeElement(Map.of("entity-name", "SomeEntity"))));
    then(clearCacheLine.convert()).containsExactly("delegator.clearCacheLine(\"SomeEntity\");");
  }

  @Test
  void shouldConvertWithMap() {
    final var clearCacheLine =
        new ClearCacheLine(
            tagInit(new AttributeElement(Map.of("entity-name", "SomeEntity", "map", "someMap"))));
    then(clearCacheLine.convert())
        .containsExactly("delegator.clearCacheLine(\"SomeEntity\", someMap);");
  }
}
