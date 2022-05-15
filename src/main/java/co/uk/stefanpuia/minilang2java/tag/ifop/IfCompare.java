package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.util.StreamUtil.firstPresent;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.ifop.operator.Operator;
import co.uk.stefanpuia.minilang2java.util.ConvertUtil;
import java.util.List;
import lombok.AllArgsConstructor;

@MinilangTag("if-compare")
public class IfCompare extends ConditionalTag implements IfOp {

  private final Attributes attributes;

  public IfCompare(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredOneOf(List.of("field", "field-name"))
                .addRequiredAll("value")
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
        .compare(context, attributes.getField().makeGetter(), attributes.getValue().toString());
  }

  @AllArgsConstructor
  private class Attributes {
    private final IfCompare self;

    public FlexibleAccessor getField() {
      return firstPresent(getAttribute("field"), getAttribute("field-name"))
          .map(field -> FlexibleAccessor.from(self, field))
          .orElseThrow(() -> new TagInstantiationException("[field] attribute missing"));
    }

    public FlexibleStringExpander getValue() {
      return getAttribute("value")
          .map(value -> new FlexibleStringExpander(self, value))
          .orElseThrow(() -> new TagInstantiationException("[value] attribute missing"));
    }

    public Operator getOperator() {
      return getAttribute("operator")
          .flatMap(Operator::find)
          .orElseGet(
              () -> {
                getAttribute("operator")
                    .ifPresent(
                        operator ->
                            context.addMessage(
                                MessageType.WARNING,
                                String.format(
                                    "[%s] is not a valid operator. Defaulting to [equals]",
                                    operator),
                                getPosition()));
                return Operator.EQUALS;
              });
    }
  }
}
