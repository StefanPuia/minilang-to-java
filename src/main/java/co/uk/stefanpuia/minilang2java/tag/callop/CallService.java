package co.uk.stefanpuia.minilang2java.tag.callop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

@MinilangTag("call-service")
public class CallService extends Tag {

  public CallService(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected List<String> convertSelf() {
    return convertChildren();
  }

  public String getResultName() {
    return "someMap";
  }
}
