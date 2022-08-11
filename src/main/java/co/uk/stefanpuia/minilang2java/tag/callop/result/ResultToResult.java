package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.result.ResultToResult.Attributes;
import java.util.List;

@MinilangTag("result-to-result")
public class ResultToResult extends NamedResult<Attributes> {

  private final Attributes attributes;

  public ResultToResult(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> convertSelf() {
    // TODO
    setVariable("");
    return List.of(getAttributes().getSelfResultName().toSafeString());
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  protected static class Attributes extends ResultAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getSelfResultName() {
      return optionalStringExpander("service-result-name").orElse(getResultName());
    }
  }
}
