package co.uk.stefanpuia.minilang2java.tag.callop.result;

import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.result.NamedResult.ResultAttributes;
import java.util.List;

@MinilangTag("result-to-map")
public class ResultToMap extends Result {

  private final Attributes attributes;

  public ResultToMap(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules().addRules(AttributeNameRule.requiredAll("map-name"));
  }

  @Override
  protected List<String> convertSelf() {
    context.addImport(VariableType.from("HashMap"));
    return FlexibleAccessor.from(this, attributes.getMapName())
        .makeSetter(DEFAULT_MAP_TYPE, "new HashMap<>(%s)".formatted(getServiceResultMapName()));
  }

  protected static class Attributes extends ResultAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public String getMapName() {
      return string("map-name");
    }
  }
}
