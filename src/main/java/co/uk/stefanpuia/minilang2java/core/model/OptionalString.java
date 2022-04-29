package co.uk.stefanpuia.minilang2java.core.model;

import java.util.Objects;
import java.util.Optional;
import javax.annotation.Nullable;
import lombok.experimental.UtilityClass;

@SuppressWarnings({"PMD.UseUtilityClass", "PMD.ClassNamingConventions"})
@UtilityClass
public final class OptionalString {
  @SuppressWarnings("PMD.ShortMethodName")
  public static Optional<String> of(@Nullable final String value) {
    return Objects.isNull(value) ? Optional.empty() : wrapNonNullValue(value);
  }

  private static Optional<String> wrapNonNullValue(final String value) {
    return value.isBlank() ? Optional.empty() : Optional.of(value);
  }

  public static boolean isNotEmpty(@Nullable final String value) {
    return OptionalString.of(value).isPresent();
  }
}
