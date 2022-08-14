package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.entityop.GenericValueMethod.GenericValueMethodAttributes;
import java.util.List;

public abstract class GenericValueMethod<T extends GenericValueMethodAttributes> extends Tag {

  public GenericValueMethod(final TagInit tagInit) {
    super(tagInit);
  }

  protected abstract T getAttributes();

  @Override
  public RuleList getRules() {
    return super.getRules().addRules(AttributeNameRule.requiredAll("value-field"));
  }

  @Override
  public List<String> convertSelf() {
    final String field = getField().makeGetter();
    return List.of("%s.getDelegator().%s(%s);".formatted(field, getMethod(), field));
  }

  public abstract String getMethod();

  protected FlexibleAccessor getField() {
    return getAttributes().getField();
  }

  protected static class GenericValueMethodAttributes extends EntityOpAttributes {

    protected GenericValueMethodAttributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return flexibleAccessor("value-field");
    }
  }
}
