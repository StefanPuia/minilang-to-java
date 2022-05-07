package co.uk.stefanpuia.minilang2java.core.value;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class StringBooleanTest {

  public static Stream<Arguments> stringBooleanSource() {
    return Stream.of(
        Arguments.of(null, false),
        Arguments.of("", false),
        Arguments.of(" ", false),
        Arguments.of("null", false),
        Arguments.of("false", false),
        Arguments.of("some string", false),
        Arguments.of("Y", true),
        Arguments.of("y", true),
        Arguments.of("true", true),
        Arguments.of("True", true),
        Arguments.of("TRUE", true));
  }

  @ParameterizedTest
  @MethodSource("stringBooleanSource")
  void shouldParseEmptyString(final String value, final boolean expected) {
    then(StringBoolean.parse(value)).isEqualTo(expected);
  }

  @Test
  void shouldParseOptional() {
    then(StringBoolean.parse(Optional.of("true"))).isTrue();
  }
}
