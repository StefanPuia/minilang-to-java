package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.result.ResultToRequest.Attributes;
import java.util.List;

@MinilangTag(value = "result-to-request", mode = MethodMode.EVENT)
public class ResultToRequest extends Result<Attributes> {

  private final Attributes attributes;

  public ResultToRequest(final TagInit tagInit) {
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
        .addRules(ImmutableAttributeNameRule.builder().addRequiredAll("request-name").build());
  }

  @Override
  protected List<String> convertSelf() {
    return List.of(
        "request.setAttribute(%s, %s);"
            .formatted(getAttributes().getRequestName().toSafeString(), getResult().makeGetter()));
  }

  protected static class Attributes extends ResultAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getRequestName() {
      return optionalStringExpander("request-name").orElse(getResultName());
    }
  }
}
