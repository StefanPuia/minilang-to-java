package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import org.immutables.value.Value.Default;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
@SuppressWarnings("PMD.AbstractClassWithoutAnyMethod")
public abstract class ChildTagNameRule implements PropertiesListRule {
  @Default
  public boolean isRequireNoChildrenElements() {
    return false;
  }
}
