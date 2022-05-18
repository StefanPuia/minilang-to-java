package co.uk.stefanpuia.minilang2java.tag.ifop;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import co.uk.stefanpuia.minilang2java.util.ConvertUtil;
import java.util.List;

@MinilangTag("if-empty")
public class IfEmpty extends ConditionalTag implements IfOp {

  private final Attributes attributes;

  public IfEmpty(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> getThenLines() {
    return ConvertUtil.convertTagsPrepend(this, getNonConditionalOpsChildren());
  }

  @Override
  public String convertCondition() {
    context.addImport(VariableType.from("UtilValidate"));
    return format("UtilValidate.isEmpty(%s)", attributes.getField().makeGetter());
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addRequiredAll("field").build());
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return flexibleAccessor("field");
    }
  }
}
