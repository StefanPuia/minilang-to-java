package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("not")
public class Not extends ConditionGroup {

  public Not(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getConditionalOperator() {
    return "&&";
  }

  @Override
  public String convertCondition() {
    return String.format("!%s", super.convertCondition());
  }
}
