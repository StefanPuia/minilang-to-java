package co.uk.stefanpuia.minilang2java.tag.callop.returnop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.Optional;

public abstract class Return extends Tag {

  public static final String SUCCESS_CODE = "success";

  protected final Attributes attributes;

  public Return(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ChildTagNameRule.noChildElements())
        .addRules(ImmutableAttributeNameRule.builder().addOptional("response-code").build());
  }

  protected String getResponseCode() {
    return attributes.getResponseCode().map(FlexibleStringExpander::toString).orElse("success");
  }

  protected static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public Optional<FlexibleStringExpander> getResponseCode() {
      return optionalStringExpander("response-code");
    }
  }
}
