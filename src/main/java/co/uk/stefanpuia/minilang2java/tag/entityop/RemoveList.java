package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("remove-list")
public class RemoveList extends GenericValueListMethod {

  public RemoveList(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getMethod() {
    return "removeAll";
  }
}
