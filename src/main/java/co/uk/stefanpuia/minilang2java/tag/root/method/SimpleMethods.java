package co.uk.stefanpuia.minilang2java.tag.root.method;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

/** "simple-methods" is optional, this works as a wrapper only */
@MinilangTag("simple-methods")
public class SimpleMethods extends Tag {

  public SimpleMethods(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return convertChildren();
  }
}
