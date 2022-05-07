package co.uk.stefanpuia.minilang2java.core.value;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Optional;
import javax.annotation.Nullable;

public record FlexibleStringExpander(Tag tag, @Nullable String value) {

  public static String wrapQuotes(final String value) {
    return format("\"%s\"", value);
  }

  @Override
  public String toString() {
    return OptionalString.of(value())
        .map(String::trim)
        .map(this::getScriptOrVariableOrString)
        .orElse("null");
  }

  private String getScriptOrVariableOrString(final String value) {
    return getScript(value).orElseGet(() -> getVariableOrString(value));
  }

  private Optional<String> getScript(final String value) {
    return value.contains("$") ? Optional.of(wrapQuotes(value)) : Optional.empty();
  }

  private String getVariableOrString(final String value) {
    final var accessor = FlexibleAccessor.from(tag(), value);
    return tag()
        .getVariable(accessor.getField())
        .map(str -> accessor.makeGetter())
        .orElse(wrapQuotes(value));
  }
}
