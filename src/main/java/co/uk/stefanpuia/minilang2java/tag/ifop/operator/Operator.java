package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;
import javax.annotation.Nullable;

public enum Operator {
  EQUALS("equals"),
  NOT_EQUALS("not-equals"),
  LESS("less"),
  LESS_EQUALS("less-equals"),
  GREATER("greater"),
  GREATER_EQUALS("greater-equals"),
  CONTAINS("contains"),
  IS_NULL("is-null"),
  IS_NOT_NULL("is-not-null"),
  IS_EMPTY("is-empty");

  private final String value;

  Operator(final String value) {
    this.value = value;
  }

  public static Optional<Operator> find(@Nullable final String findValue) {
    return OptionalString.of(findValue)
        .map(
            value ->
                Arrays.stream(values())
                    .filter(
                        enumValue -> enumValue.getValue().equals(value.toLowerCase(Locale.ROOT)))
                    .findFirst())
        .filter(Optional::isPresent)
        .map(Optional::get);
  }

  public String getValue() {
    return value;
  }

  public String compare(
      final ConversionContext context, final String left, @Nullable final String right) {
    return OperatorFactory.compare(context, this, left, right);
  }
}
