package co.uk.stefanpuia.minilang2java.tag.callop.returnop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import java.util.List;

@MinilangTag(value = "return", mode = MethodMode.EVENT)
public class EventReturn extends Return {

  public EventReturn(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return List.of(String.format("return %s;", getResponseCode()));
  }
}
