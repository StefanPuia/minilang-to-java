package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("store-list")
public class StoreList extends GenericValueListMethod {

  public StoreList(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getMethod() {
    return "storeAll";
  }
}
