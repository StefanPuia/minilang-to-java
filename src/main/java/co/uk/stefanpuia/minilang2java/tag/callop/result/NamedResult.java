package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import co.uk.stefanpuia.minilang2java.tag.callop.result.NamedResult.ResultAttributes;

public abstract class NamedResult<T extends ResultAttributes> extends Result {

  public NamedResult(final TagInit tagInit) {
    super(tagInit);
  }

  protected FlexibleAccessor getResult() {
    return FlexibleAccessor.from(
        this, "%s.%s".formatted(getServiceResultMapName(), getAttributes().getResultName()));
  }

  protected abstract T getAttributes();

  @Override
  public RuleList getRules() {
    return super.getRules().addRules(AttributeNameRule.requiredAll("result-name"));
  }

  protected static class ResultAttributes extends TagAttributes {

    protected ResultAttributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getResultName() {
      return stringExpander("result-name");
    }
  }
}
