package co.uk.stefanpuia.minilang2java.tag.entityop;

import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.entityop.MakeValue.Attributes;
import java.util.List;
import java.util.Optional;

@MinilangTag("make-value")
public class MakeValue extends EntityOperation<Attributes> {

  private final Attributes attributes;

  public MakeValue(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("value-field", "entity-name")
                .addOptional("map")
                .build());
  }

  @Override
  public List<String> convertSelf() {
    context.addImport(GENERIC_VALUE);
    return combine(
        super.convertSelf(),
        attributes
            .getValueField()
            .makeSetter(
                GENERIC_VALUE,
                "%s.makeValidValue(%s)".formatted(getDelegatorName(), getArguments())));
  }

  private String getArguments() {
    return String.join(
        ", ",
        combine(attributes.getEntityName(), attributes.getMap().map(FlexibleAccessor::makeGetter)));
  }

  protected static class Attributes extends EntityOpAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getValueField() {
      return flexibleAccessor("value-field");
    }

    public FlexibleStringExpander getEntityName() {
      return stringExpander("entity-name");
    }

    public Optional<FlexibleAccessor> getMap() {
      return optionalFlexibleAccessor("map");
    }
  }
}
