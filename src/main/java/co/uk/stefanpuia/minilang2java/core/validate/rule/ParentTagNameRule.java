package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import java.util.List;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
@SuppressWarnings("PMD.AbstractClassWithoutAnyMethod")
public abstract class ParentTagNameRule implements PropertiesListRule {

  @Override
  @Derived
  public List<String> getRequiredAll() {
    return List.of();
  }

  @Override
  @Derived
  public List<String> getOptional() {
    return List.of();
  }
}
