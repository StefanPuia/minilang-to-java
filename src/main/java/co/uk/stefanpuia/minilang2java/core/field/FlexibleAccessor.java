package co.uk.stefanpuia.minilang2java.core.field;

import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import javax.annotation.Nullable;
import org.immutables.value.Value.Parameter;

public abstract class FlexibleAccessor {

  public static FlexibleAccessor from(final Tag tag, @Nullable final String nullableField) {
    return OptionalString.of(nullableField).map(field -> handle(tag, field)).orElseThrow();
  }

  private static FlexibleAccessor handle(final Tag tag, final String field) {
    return field.indexOf('.') > -1
        ? ImmutableMapAccessor.of(tag, field)
        : ImmutableFieldAccessor.of(tag, field);
  }

  @Parameter(order = 1)
  protected abstract Tag getParent();

  @Nullable
  @Parameter(order = 2)
  protected abstract String getRawField();

  public abstract String makeGetter();

  public abstract String getField();

  public abstract List<String> makeSetter(final String assignment);

  public abstract List<String> makeSetter(final VariableType type, final String assignment);

  public abstract List<String> makeSplitSetter(final VariableType type, final String assignment);
}
