package co.uk.stefanpuia.minilang2java.core.model;

import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Test;

class ContextVariableTest {
  @Test
  void shouldAddCount() {
    // Given
    final String name = make();
    final var variable = new ContextVariable(name, 5, null);

    // When
    final var added = variable.addCount(1);

    // Then
    then(added).isNotSameAs(variable).extracting(ContextVariable::count).isEqualTo(6);
  }

  @Test
  void shouldSetCount() {
    // Given
    final String name = make();
    final var variable = new ContextVariable(name, 5, null);

    // When
    final var added = variable.withCount(10);

    // Then
    then(added).isNotSameAs(variable).extracting(ContextVariable::count).isEqualTo(10);
  }
}
