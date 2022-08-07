package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("condition")
public class Condition extends ConditionGroup {

  public Condition(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getConditionalOperator() {
    return "&&";
  }
}