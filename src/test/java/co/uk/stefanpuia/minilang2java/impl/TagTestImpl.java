package co.uk.stefanpuia.minilang2java.impl;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

public class TagTestImpl extends Tag {
  private final List<String> convert;

  public TagTestImpl(final TagInit tagInit) {
    this(tagInit, List.of());
  }

  public TagTestImpl(final TagInit tagInit, final List<String> convert) {
    super(tagInit);
    this.convert = convert;
  }

  @Override
  public List<String> convertSelf() {
    return convert;
  }

  public static class TagWithContextTestImpl extends TagTestImpl {

    public TagWithContextTestImpl(final TagInit tagInit) {
      super(tagInit);
    }

    @Override
    protected boolean hasOwnContext() {
      return true;
    }
  }
}
