package co.uk.stefanpuia.minilang2java.tag.callop.returnop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import java.util.List;

@MinilangTag(value = "return", mode = MethodMode.UTIL)
public class UtilReturn extends Return {

  public UtilReturn(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convert() {
    return List.of("return;");
  }
}
