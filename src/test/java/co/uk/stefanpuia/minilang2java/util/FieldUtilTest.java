package co.uk.stefanpuia.minilang2java.util;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.stream.Stream;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class FieldUtilTest {

  public static Stream<Arguments> makeNameSupplier() {
    return Stream.of(
        Arguments.of("hr_delegator", new Object[] {"\"hr\"", "delegator"}),
        Arguments.of("hr_delegator", new Object[] {"hr", "delegator"}));
  }

  @ParameterizedTest
  @MethodSource("makeNameSupplier")
  void shouldMakeName(final String expected, final Object... parts) {
    then(FieldUtil.makeName(parts)).isEqualTo(expected);
  }
}
