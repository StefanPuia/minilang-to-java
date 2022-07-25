package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import java.util.List;

@MinilangTag(value = "store-value", optimised = true)
public class StoreValueOptimised extends StoreValue {

  public StoreValueOptimised(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return List.of("%s.store();".formatted(getField().makeGetter()));
  }
}
