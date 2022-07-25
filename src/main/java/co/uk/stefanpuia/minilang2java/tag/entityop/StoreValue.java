package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.entityop.GenericValueMethod.GenericValueMethodAttributes;

@MinilangTag("store-value")
public class StoreValue extends GenericValueMethod<GenericValueMethodAttributes> {

  private final GenericValueMethodAttributes attributes;

  public StoreValue(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new GenericValueMethodAttributes(this);
  }

  @Override
  protected GenericValueMethodAttributes getAttributes() {
    return attributes;
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addUnhandled("do-cache-clear").build());
  }

  @Override
  public String getMethod() {
    return "store";
  }
}
