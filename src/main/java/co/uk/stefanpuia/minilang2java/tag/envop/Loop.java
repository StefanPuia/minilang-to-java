package co.uk.stefanpuia.minilang2java.tag.envop;

import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.convertTagsPrepend;
import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.indent;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.List;
import java.util.Optional;

@MinilangTag("loop")
public class Loop extends Tag {

  private final Attributes attributes;

  public Loop(final TagInit tagInit) {
    super(tagInit);
    attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("count")
                .addOptional("field")
                .build());
  }

  @Override
  public List<String> convertSelf() {
    final String iterator = "i" + getIteratorCounter();
    setVariable(new ContextVariable(iterator, 1, VariableType.from("int")));

    return combine(
        getForHeader(iterator),
        getFieldAssignment(iterator),
        convertTagsPrepend(this, children),
        "}");
  }

  private String getForHeader(final String iterator) {
    return format(
        "for (int %s = 0; %s < %s; %s++) {",
        iterator, iterator, attributes.getCount().toString(), iterator);
  }

  private List<String> getFieldAssignment(final String iterator) {
    return this.attributes
        .getField()
        .map(flexibleAccessor -> indent(this, flexibleAccessor.makeSetter(iterator)))
        .orElse(List.of());
  }

  @Override
  protected boolean hasOwnContext() {
    return true;
  }

  protected int getIteratorCounter() {
    return getParent(Loop.class).map(loop -> loop.getIteratorCounter() + 1).orElse(0);
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getCount() {
      return stringExpander("count");
    }

    public Optional<FlexibleAccessor> getField() {
      return optionalFlexibleAccessor("field");
    }
  }
}
