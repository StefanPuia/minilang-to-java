package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("and")
public class And extends ConditionGroup {

  public And(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getConditionalOperator() {
    return "&&";
  }
}
