package co.uk.stefanpuia.minilang2java.core.model;

import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
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

  @Nested
  class IsDeclaredTest {
    @Mock private Tag tag;

    @Test
    void shouldBeFalseWhenVariableDoesNotExist() {
      doReturn(Optional.empty()).when(tag).getVariable(anyString());
      then(ContextVariable.isDeclared(tag, "someVar")).isFalse();
    }

    @Test
    void shouldBeFalseWhenVariableHasNoCalls() {
      doReturn(Optional.of(new ContextVariable("someVar", 0, null)))
          .when(tag)
          .getVariable(anyString());
      then(ContextVariable.isDeclared(tag, "someVar")).isFalse();
    }

    @Test
    void shouldBeTrueWhenVariableExists() {
      doReturn(Optional.of(new ContextVariable("someVar", 1, null)))
          .when(tag)
          .getVariable(anyString());
      then(ContextVariable.isDeclared(tag, "someVar")).isTrue();
    }
  }
}
