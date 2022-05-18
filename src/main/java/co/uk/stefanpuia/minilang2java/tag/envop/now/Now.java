package co.uk.stefanpuia.minilang2java.tag.envop.now;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;

@MinilangTag("now")
public class Now extends AbstractNow {

  private final Attributes attributes;

  public Now(final TagInit tagInit) {
    super(tagInit);
    attributes = new Attributes(this);
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addOptional("type").build());
  }
}
