package co.uk.stefanpuia.minilang2java.tag.envop.now;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.List;

public abstract class AbstractNow extends Tag {

  public AbstractNow(final TagInit tagInit) {
    super(tagInit);
  }

  protected abstract Attributes getAttributes();

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addRequiredAll("field").build());
  }

  @Override
  public List<String> convert() {
    context.addImport(VariableType.from("UtilDateTime"));
    final List<String> lines =
        getAttributes()
            .getField()
            .makeSetter(getAttributes().getType(), "UtilDateTime.nowTimestamp()");
    setVariable(
        new ContextVariable(getAttributes().getField().getField(), 1, getAttributes().getType()));
    return lines;
  }

  protected static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return flexibleAccessor("field");
    }

    public VariableType getType() {
      return optionalVariableType("type").orElse(VariableType.from("Timestamp"));
    }
  }
}
