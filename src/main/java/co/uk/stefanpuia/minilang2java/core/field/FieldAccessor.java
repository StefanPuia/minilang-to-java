package co.uk.stefanpuia.minilang2java.core.field;

import static co.uk.stefanpuia.minilang2java.core.model.ContextVariable.isDeclared;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_TYPE;
import static java.lang.String.format;
import static java.util.Objects.requireNonNull;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import java.util.List;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
public abstract class FieldAccessor extends FlexibleAccessor {

  private String getField() {
    return requireNonNull(getRawField());
  }

  @Override
  public List<String> makeGetter() {
    return List.of(getField());
  }

  @Override
  public List<String> makeSetter(final String assignment) {
    return List.of(format("%s%s = %s;", getDeclaration(), getField(), assignment));
  }

  private String getDeclaration() {
    return isDeclared(getParent(), getField()) ? "" : format("final %s ", DEFAULT_TYPE);
  }
}
