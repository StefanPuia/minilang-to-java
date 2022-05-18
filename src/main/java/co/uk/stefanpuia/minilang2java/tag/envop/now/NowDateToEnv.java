package co.uk.stefanpuia.minilang2java.tag.envop.now;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

@MinilangTag("now-date-to-env")
public class NowDateToEnv extends AbstractNow {

  private final Attributes attributes;

  public NowDateToEnv(final TagInit tagInit) {
    super(tagInit);
    attributes = new NowDateToEnvAttributes(this);
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  protected static class NowDateToEnvAttributes extends Attributes {

    protected NowDateToEnvAttributes(final Tag self) {
      super(self);
    }

    @Override
    public VariableType getType() {
      return VariableType.from("java.sql.Date");
    }
  }
}
