package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import java.util.List;

@MinilangTag(value = "refresh-value", optimised = true)
public class RefreshValueOptimised extends RefreshValue {

  public RefreshValueOptimised(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return List.of("%s.refresh();".formatted(getField().makeGetter()));
  }
}
