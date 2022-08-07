package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableParentTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import co.uk.stefanpuia.minilang2java.tag.callop.CallService;
import co.uk.stefanpuia.minilang2java.tag.callop.result.Result.ResultAttributes;
import java.util.List;

public abstract class Result<T extends ResultAttributes> extends Tag {

  public Result(final TagInit tagInit) {
    super(tagInit);
  }

  protected abstract T getAttributes();

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableParentTagNameRule.builder().addRequiredOneOf(List.of("call-service")).build())
        .addRules(ImmutableAttributeNameRule.builder().addRequiredAll("result-name").build());
  }

  protected FlexibleAccessor getResult() {
    return FlexibleAccessor.from(
        this, "%s.%s".formatted(getServiceResultMapName(), getAttributes().getResultName()));
  }

  private String getServiceResultMapName() {
    return getParent(CallService.class)
        .orElseThrow(() -> new TagConversionException("Tag not a child of call-service"))
        .getResultName();
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
