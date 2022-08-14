package co.uk.stefanpuia.minilang2java.tag.callop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;

@MinilangTag("call-service")
public class CallService extends AbstractCallService {

  public CallService(final TagInit tagInit) {
    super(tagInit);
  }
}
