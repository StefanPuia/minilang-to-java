package co.uk.stefanpuia.minilang2java.tag.callop.result;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.result.ResultToField.Attributes;
import java.util.List;

@MinilangTag("result-to-field")
public class ResultToField extends NamedResult<Attributes> {

  private final Attributes attributes;

  public ResultToField(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> convertSelf() {
    return getAttributes().getField().makeSetter(getResult().makeGetter());
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  protected static class Attributes extends ResultAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return optionalFlexibleAccessor("field")
          .orElse(FlexibleAccessor.from(self, getResultName().toString()));
    }
  }
}
