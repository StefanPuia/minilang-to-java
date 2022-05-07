package co.uk.stefanpuia.minilang2java.core.value;

import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import javax.annotation.Nullable;

public record StringBoolean(@Nullable String value) {

  public static final List<String> TRUTHY_LIST = List.of("true", "y");

  @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
  public static boolean parse(final Optional<String> value) {
    return value.map(StringBoolean::new).map(StringBoolean::get).orElse(false);
  }

  public static boolean parse(@Nullable final String value) {
    return new StringBoolean(value).get();
  }

  @SuppressWarnings("PMD.BooleanGetMethodName")
  public boolean get() {
    return OptionalString.of(value()).map(this::parseBooleanString).orElse(false);
  }

  private boolean parseBooleanString(final String value) {
    return TRUTHY_LIST.contains(value.toLowerCase(Locale.ROOT));
  }
}
