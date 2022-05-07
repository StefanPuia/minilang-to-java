package co.uk.stefanpuia.minilang2java.core.field;

import static co.uk.stefanpuia.minilang2java.core.model.ContextVariable.isDeclared;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_TYPE;
import static java.lang.String.format;
import static java.util.Objects.requireNonNull;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
public abstract class FieldAccessor extends FlexibleAccessor {

  @Override
  public String getField() {
    return requireNonNull(getRawField());
  }

  @Override
  public String makeGetter() {
    return getField();
  }

  @Override
  public List<String> makeSetter(final String assignment) {
    return makeSetter(DEFAULT_TYPE, assignment);
  }

  @Override
  public List<String> makeSetter(final VariableType type, final String assignment) {
    getParent().getContext().addImport(type);
    return List.of(format("%s = %s;", getDeclaration(type), assignment));
  }

  @Override
  public List<String> makeSplitSetter(final VariableType type, final String assignment) {
    return List.of(format("%s;", getDeclaration(type)), format("%s = %s;", getField(), assignment));
  }

  private String getDeclaration(final VariableType type) {
    return isDeclared(getParent(), getField())
        ? getField()
        : format("final %s %s", type, getField());
  }
}
