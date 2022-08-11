package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
@SuppressWarnings("PMD.AbstractClassWithoutAnyMethod")
public abstract class AttributeNameRule implements PropertiesListRule {
  public static AttributeNameRule requiredAll(final String... attributes) {
    return ImmutableAttributeNameRule.builder().addRequiredAll(attributes).build();
  }
}
