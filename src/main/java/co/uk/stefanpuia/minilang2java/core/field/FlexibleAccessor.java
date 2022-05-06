package co.uk.stefanpuia.minilang2java.core.field;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import javax.annotation.Nullable;
import org.immutables.value.Value.Parameter;

public abstract class FlexibleAccessor {

  public static FlexibleAccessor from(
      final Tag parent, final ConversionContext context, @Nullable final String nullableField) {
    return OptionalString.of(nullableField)
        .map(field -> handle(parent, context, field))
        .orElseThrow();
  }

  private static FlexibleAccessor handle(
      final Tag parent, final ConversionContext context, final String field) {
    return field.indexOf('.') > -1
        ? ImmutableMapAccessor.of(parent, context, field)
        : ImmutableFieldAccessor.of(parent, context, field);
  }

  @Parameter(order = 1)
  protected abstract Tag getParent();

  @Parameter(order = 2)
  protected abstract ConversionContext getContext();

  @Nullable
  @Parameter(order = 3)
  protected abstract String getRawField();

  public abstract List<String> makeGetter();

  public abstract List<String> makeSetter(final String assignment);
}
