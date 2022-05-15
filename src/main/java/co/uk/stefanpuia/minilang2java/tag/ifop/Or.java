package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("or")
public class Or extends ConditionGroup {

  public Or(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getConditionalOperator() {
    return "||";
  }
}
