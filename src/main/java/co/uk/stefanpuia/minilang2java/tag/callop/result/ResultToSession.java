package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.result.ResultToSession.Attributes;
import java.util.List;

@MinilangTag("result-to-session")
public class ResultToSession extends NamedResult<Attributes> {

  private final Attributes attributes;

  public ResultToSession(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> convertSelf() {
    // TODO
    setVariable("");
    return FlexibleAccessor.from(
            this, "session.%s".formatted(getAttributes().getSessionName().toString()))
        .makeSetter(getResult().makeGetter());
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  protected static class Attributes extends ResultAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getSessionName() {
      return optionalStringExpander("session-name").orElse(getResultName());
    }
  }
}
