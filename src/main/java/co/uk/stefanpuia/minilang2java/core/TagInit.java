package co.uk.stefanpuia.minilang2java.core;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import javax.annotation.Nullable;
import org.w3c.dom.Element;

public record TagInit(
    ConversionContext conversionContext, @Nullable Element element, @Nullable Tag parent) {
  public Position getPosition() {
    return Position.makePosition(element());
  }
}
