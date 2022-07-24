package co.uk.stefanpuia.minilang2java.tag.envop;

import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.convertTagsPrepend;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.List;

@MinilangTag("iterate")
public class Iterate extends Tag {

  private final Attributes attributes;

  public Iterate(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableAttributeNameRule.builder().addRequiredAll("entry", "list").build());
  }

  @Override
  public List<String> convertSelf() {
    return combine(getForHeader(), convertTagsPrepend(this, getChildren()), "}");
  }

  private String getForHeader() {
    return String.format(
        "for (%s %s : %s) {",
        getEntryType(), attributes.getEntry().getField(), attributes.getList().makeGetter());
  }

  private VariableType getEntryType() {
    return getVariable(attributes.getList().getField())
        .map(ContextVariable::type)
        .flatMap(type -> type.getParameters().stream().findFirst())
        .orElse(VariableType.DEFAULT_TYPE);
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getEntry() {
      return flexibleAccessor("entry");
    }

    public FlexibleAccessor getList() {
      return flexibleAccessor("list");
    }
  }
}
