package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.util.StreamUtil.firstPresent;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.util.ConvertUtil;
import java.util.List;
import lombok.AllArgsConstructor;

@MinilangTag("if-regexp")
public class IfRegexp extends ConditionalTag implements IfOp {

  private final Attributes attributes;

  public IfRegexp(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> getThenLines() {
    return ConvertUtil.convertTagsPrepend(this, getNonConditionalOpsChildren());
  }

  @Override
  public String convertCondition() {
    context.addImport(VariableType.from("Pattern"));
    return format(
        "Pattern.compile(%s).matcher(%s).matches()",
        attributes.getExpr(), attributes.getField().makeGetter());
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredOneOf(List.of("field", "field-name"))
                .addRequiredAll("expr")
                .build());
  }

  @AllArgsConstructor
  private class Attributes {
    private final IfRegexp self;

    public FlexibleAccessor getField() {
      return firstPresent(getAttribute("field"), getAttribute("field-name"))
          .map(field -> FlexibleAccessor.from(self, field))
          .orElseThrow(() -> new TagInstantiationException("[field] attribute missing"));
    }

    public FlexibleStringExpander getExpr() {
      return getAttribute("expr")
          .map(expr -> new FlexibleStringExpander(self, expr))
          .orElseThrow(() -> new TagInstantiationException("[expr] attribute missing"));
    }
  }
}
