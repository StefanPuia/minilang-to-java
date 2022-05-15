package co.uk.stefanpuia.minilang2java.tag.ifop;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.util.ConvertUtil;
import java.util.List;
import lombok.AllArgsConstructor;

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

  @AllArgsConstructor
  private class Attributes {
    private final IfEmpty self;

    public FlexibleAccessor getField() {
      return getAttribute("field")
          .map(field -> FlexibleAccessor.from(self, field))
          .orElseThrow(() -> new TagInstantiationException("[field] attribute is empty"));
    }
  }
}
