package co.uk.stefanpuia.minilang2java.core.field;

import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import javax.annotation.Nullable;
import org.immutables.value.Value.Parameter;

public abstract class FlexibleAccessor {

  public static FlexibleAccessor from(final Tag parent, @Nullable final String nullableField) {
    return OptionalString.of(nullableField).map(field -> handle(parent, field)).orElseThrow();
  }

  private static FlexibleAccessor handle(final Tag parent, final String field) {
    return field.indexOf('.') > -1
        ? ImmutableMapAccessor.of(parent, field)
        : ImmutableFieldAccessor.of(parent, field);
  }

  @Parameter(order = 1)
  protected abstract Tag getParent();

  @Nullable
  @Parameter(order = 2)
  protected abstract String getRawField();

  public abstract String makeGetter();

  public abstract String getField();

  public abstract List<String> makeSetter(final String assignment);
}
