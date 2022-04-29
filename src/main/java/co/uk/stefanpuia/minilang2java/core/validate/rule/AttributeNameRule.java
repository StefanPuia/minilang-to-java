package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
public abstract class AttributeNameRule implements ValidationRule {
  public abstract List<String> getRequiredAll();

  public abstract List<String> getRequiredOneOf();

  public abstract List<String> getOptional();

  public Set<String> getAllAttributes() {
    final var set = new HashSet<String>();
    set.addAll(getRequiredAll());
    set.addAll(getRequiredOneOf());
    set.addAll(getOptional());
    return set;
  }
}
