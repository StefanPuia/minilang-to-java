package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

@MinilangTag("remove-value")
public class RemoveValue extends Tag {

  private final Attributes attributes;

  public RemoveValue(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  protected Attributes getAttributes() {
    return attributes;
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("value-field")
                .addUnhandled("do-cache-clear")
                .build());
  }

  @Override
  public List<String> convertSelf() {
    final String field = getField().makeGetter();
    return List.of("%s.getDelegator().remove(%s);".formatted(field, field));
  }

  protected FlexibleAccessor getField() {
    return getAttributes().getField();
  }

  private static class Attributes extends EntityOpAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return flexibleAccessor("value-field");
    }
  }
}
