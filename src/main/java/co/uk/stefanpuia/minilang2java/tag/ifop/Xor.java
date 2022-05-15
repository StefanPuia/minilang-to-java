package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("xor")
public class Xor extends ConditionGroup {

  public Xor(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getConditionalOperator() {
    return "^";
  }
}
