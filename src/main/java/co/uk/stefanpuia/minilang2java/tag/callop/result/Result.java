package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableParentTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.CallService;
import java.util.List;

public abstract class Result extends Tag {

  public Result(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableParentTagNameRule.builder().addRequiredOneOf(List.of("call-service")).build());
  }

  public String getServiceResultMapName() {
    return getParent(CallService.class)
        .orElseThrow(() -> new TagConversionException("Tag not a child of call-service"))
        .getResultName();
  }
}
