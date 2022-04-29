package co.uk.stefanpuia.minilang2java.core.model;

import static net.bytebuddy.utility.RandomString.make;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class OptionalStringTest {
  @Nested
  class WrapTest {
    @Test
    void shouldWrapNullString() {
      assertEquals(Optional.empty(), OptionalString.of(null));
    }

    @Test
    void shouldWrapEmptyString() {
      assertEquals(Optional.empty(), OptionalString.of(""));
    }

    @Test
    void shouldWrapBlankString() {
      assertEquals(Optional.empty(), OptionalString.of(" "));
    }

    @Test
    void shouldWrapBlankStringWithNewline() {
      assertEquals(Optional.empty(), OptionalString.of("\n"));
    }

    @Test
    void shouldWrapString() {
      final String text = make();
      assertEquals(Optional.of(text), OptionalString.of(text));
    }
  }

  @Nested
  class IsNotEmptyTest {
    @Test
    void shouldBeTrue() {
      assertTrue(OptionalString.isNotEmpty(make()));
    }

    @Test
    void shouldBeFalse() {
      assertFalse(OptionalString.isNotEmpty(""));
    }
  }
}
