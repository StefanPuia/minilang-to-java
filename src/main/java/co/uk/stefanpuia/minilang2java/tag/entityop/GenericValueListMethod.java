package co.uk.stefanpuia.minilang2java.tag.entityop;

import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.entityop.GenericValueListMethod.Attributes;
import java.util.List;

public abstract class GenericValueListMethod extends EntityOperation<Attributes> {
  private final Attributes attributes;

  public GenericValueListMethod(final TagInit tagInit) {
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
                .addRequiredAll("list")
                .addUnhandled("do-cache-clear")
                .build());
  }

  @Override
  public List<String> convertSelf() {
    return combine(
        super.convertSelf(),
        "%s.%s(%s);"
            .formatted(getDelegatorName(), getMethod(), getAttributes().getList().makeGetter()));
  }

  protected abstract String getMethod();

  protected static class Attributes extends EntityOpAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getList() {
      return flexibleAccessor("list");
    }
  }
}
