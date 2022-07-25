package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import java.util.List;

@MinilangTag(value = "remove-value", optimised = true)
public class RemoveValueOptimised extends RemoveValue {

  public RemoveValueOptimised(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return List.of("%s.remove();".formatted(getField().makeGetter()));
  }
}
