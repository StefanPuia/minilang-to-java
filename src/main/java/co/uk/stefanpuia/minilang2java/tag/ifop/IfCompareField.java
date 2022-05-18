package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import co.uk.stefanpuia.minilang2java.tag.ifop.operator.Operator;
import co.uk.stefanpuia.minilang2java.util.ConvertUtil;
import java.util.List;

@MinilangTag("if-compare-field")
public class IfCompareField extends ConditionalTag implements IfOp {

  private final Attributes attributes;

  public IfCompareField(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredOneOf(List.of("field", "field-name"))
                .addRequiredOneOf(List.of("to-field", "to-field-name"))
                .addOptional("type", "operator")
                .addUnhandled("format", "type")
                .build(),
            ImmutableChildTagNameRule.builder().addUnhandled("then").build());
  }

  @Override
  protected List<String> getThenLines() {
    return ConvertUtil.convertTagsPrepend(this, getNonConditionalOpsChildren());
  }

  @Override
  public String convertCondition() {
    return attributes
        .getOperator()
        .compare(context, attributes.getField().makeGetter(), attributes.getToField().makeGetter());
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return flexibleAccessor("field", "field-name");
    }

    public FlexibleAccessor getToField() {
      return flexibleAccessor("to-field", "to-field-name");
    }

    @Override
    public Operator getOperator() {
      return super.getOperator();
    }
  }
}
