package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

@MinilangTag("else")
public class Else extends Tag implements ConditionalOp {

  public Else(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return convertChildren();
  }

  @Override
  protected boolean hasOwnContext() {
    return true;
  }
}
