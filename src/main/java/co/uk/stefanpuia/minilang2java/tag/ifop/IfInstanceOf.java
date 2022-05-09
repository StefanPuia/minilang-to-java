package co.uk.stefanpuia.minilang2java.tag.ifop;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.ConvertUtil;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import java.util.List;
import lombok.AllArgsConstructor;

@MinilangTag("if-instance-of")
public class IfInstanceOf extends ConditionalTag implements IfOp {

  private final Attributes attributes;

  public IfInstanceOf(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> getThenLines() {
    return ConvertUtil.convertTagsPrepend(this, getNonConditionalOpsChildren());
  }

  @Override
  public String convertCondition() {
    final var type = attributes.getClassName();
    context.addImport(type);
    return format("%s instanceof %s.class", attributes.getField().makeGetter(), type.toString());
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addRequiredAll("field", "class").build());
  }

  @AllArgsConstructor
  private class Attributes {
    private final IfInstanceOf self;

    public FlexibleAccessor getField() {
      return getAttribute("field")
          .map(field -> FlexibleAccessor.from(self, field))
          .orElseThrow(() -> new TagInstantiationException("[field] attribute is empty"));
    }

    public VariableType getClassName() {
      return getAttribute("class")
          .map(VariableType::from)
          .orElseThrow(() -> new TagInstantiationException("[class] attribute is empty"));
    }
  }
}
