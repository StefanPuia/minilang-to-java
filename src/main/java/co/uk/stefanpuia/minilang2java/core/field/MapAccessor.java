package co.uk.stefanpuia.minilang2java.core.field;

import static co.uk.stefanpuia.minilang2java.core.model.ContextVariable.isDeclared;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;
import static java.lang.String.format;
import static java.util.Objects.requireNonNull;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.ArrayList;
import java.util.List;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
public abstract class MapAccessor extends FlexibleAccessor {

  @Derived
  protected String[] getParts() {
    return requireNonNull(getRawField()).split("\\.", 2);
  }

  @Derived
  protected String getMapName() {
    return getParts()[0];
  }

  @Derived
  protected String getProperty() {
    return getParts()[1];
  }

  @Override
  public String makeGetter() {
    return format("%s.get(\"%s\")", getMapName(), getProperty());
  }

  @Override
  public List<String> makeSetter(final String assignment) {
    final List<String> lines = new ArrayList<>(makeDeclaration());
    lines.add(format("%s.put(\"%s\", %s);", getMapName(), getProperty(), assignment));
    return lines;
  }

  private List<String> makeDeclaration() {
    return isDeclared(getParent(), getMapName()) ? List.of() : getDeclarationLineAndAddImport();
  }

  private List<String> getDeclarationLineAndAddImport() {
    getParent().getContext().addImport(VariableType.from("HashMap"));
    return List.of(format("final %s %s = new HashMap<>();", DEFAULT_MAP_TYPE, getMapName()));
  }

  @Override
  public String getField() {
    return getMapName();
  }
}
