package co.uk.stefanpuia.minilang2java.tag.envop;

import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_TYPE;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.STRING_TYPE;
import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.convertTagsPrepend;
import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.indent;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.ImmutableVariableType;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.qualify.QualifiedClass;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.ArrayList;
import java.util.List;

@MinilangTag("iterate-map")
public class IterateMap extends Tag {

  private final Attributes attributes;

  public IterateMap(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder().addRequiredAll("key", "value", "map").build());
  }

  @Override
  public List<String> convert() {
    return combine(
        getForHeader(),
        indent(this, getKeySetter()),
        indent(this, getValueSetter()),
        convertTagsPrepend(this, getChildren()),
        "}");
  }

  private List<String> getKeySetter() {
    return FlexibleAccessor.from(this, attributes.getKey().getField())
        .makeSetter(
            getEntryType().getParameters().get(0), String.format("%s.getKey()", getEntryName()));
  }

  private List<String> getValueSetter() {
    return FlexibleAccessor.from(this, attributes.getValue().getField())
        .makeSetter(
            getEntryType().getParameters().get(1), String.format("%s.getValue()", getEntryName()));
  }

  private String getEntryName() {
    return String.format("%sEntry", attributes.getMap().getField());
  }

  private String getForHeader() {
    return String.format(
        "for (%s %s : %s.entrySet()) {",
        getEntryType(), getEntryName(), attributes.getMap().makeGetter());
  }

  @SuppressWarnings("PMD.AvoidLiteralsInIfCondition")
  private VariableType getEntryType() {
    final List<VariableType> parameters =
        new ArrayList<>(
            getVariable(attributes.getMap().getField())
                .map(ContextVariable::type)
                .map(VariableType::getParameters)
                .orElse(List.of()));

    if (parameters.isEmpty()) {
      parameters.add(STRING_TYPE);
    }
    if (parameters.size() == 1) {
      parameters.add(DEFAULT_TYPE);
    }

    context.addImport(VariableType.from("Entry"));
    return ImmutableVariableType.builder()
        .setType(QualifiedClass.from("Entry"))
        .setParameters(parameters)
        .build();
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getKey() {
      return flexibleAccessor("key");
    }

    public FlexibleAccessor getMap() {
      return flexibleAccessor("map");
    }

    public FlexibleAccessor getValue() {
      return flexibleAccessor("value");
    }
  }
}
