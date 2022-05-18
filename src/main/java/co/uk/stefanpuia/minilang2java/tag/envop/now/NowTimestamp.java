package co.uk.stefanpuia.minilang2java.tag.envop.now;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

@MinilangTag("now-timestamp")
public class NowTimestamp extends AbstractNow {

  private final Attributes attributes;

  public NowTimestamp(final TagInit tagInit) {
    super(tagInit);
    attributes = new NowTimestampAttributes(this);
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  protected static class NowTimestampAttributes extends Attributes {

    protected NowTimestampAttributes(final Tag self) {
      super(self);
    }

    @Override
    public VariableType getType() {
      return VariableType.from("java.sql.Timestamp");
    }
  }
}
