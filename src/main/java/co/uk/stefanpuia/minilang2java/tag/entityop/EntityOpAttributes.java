package co.uk.stefanpuia.minilang2java.tag.entityop;

import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.Optional;

abstract class EntityOpAttributes extends TagAttributes {

  protected EntityOpAttributes(final Tag self) {
    super(self);
  }

  public Optional<FlexibleStringExpander> getDelegatorName() {
    return optionalStringExpander("delegator-name");
  }
}
