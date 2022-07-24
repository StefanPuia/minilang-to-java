package co.uk.stefanpuia.minilang2java.tag.entityop;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.Delegator.TYPE_DELEGATOR;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.Delegator.VAR_DELEGATOR;
import static co.uk.stefanpuia.minilang2java.util.FieldUtil.makeName;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

public abstract class EntityOperation<A extends EntityOpAttributes> extends Tag {

  public EntityOperation(final TagInit tagInit) {
    super(tagInit);
  }

  protected abstract A getAttributes();

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addOptional("delegator-name").build());
  }

  @Override
  public List<String> convert() {
    setVariable(new ContextVariable(getDelegatorName(), 0, TYPE_DELEGATOR));
    return getCustomDelegatorLines();
  }

  protected String getDelegatorName() {
    return getAttributes().getDelegatorName().map(this::makeDelegatorName).orElse(VAR_DELEGATOR);
  }

  private String makeDelegatorName(final FlexibleStringExpander delegatorName) {
    return makeName(delegatorName.toString(), VAR_DELEGATOR);
  }

  private List<String> getCustomDelegatorLines() {
    return getAttributes()
        .getDelegatorName()
        .map(
            delegatorName -> {
              context.addImport(TYPE_DELEGATOR);
              context.addImport(VariableType.from("DelegatorFactory"));
              final String delegatorField = makeDelegatorName(delegatorName);
              return FlexibleAccessor.from(this, delegatorField)
                  .makeSetter(
                      TYPE_DELEGATOR, "DelegatorFactory.getDelegator(%s)".formatted(delegatorName));
            })
        .orElse(List.of());
  }
}
