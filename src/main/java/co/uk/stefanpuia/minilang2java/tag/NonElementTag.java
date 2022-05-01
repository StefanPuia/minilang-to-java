package co.uk.stefanpuia.minilang2java.tag;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import javax.annotation.Nullable;

public abstract class NonElementTag extends Tag {

  public NonElementTag(final ConversionContext context, @Nullable final Tag parent) {
    super(new TagInit(context, null, parent));
  }
}
