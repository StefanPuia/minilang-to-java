package co.uk.stefanpuia.minilang2java.core;

import static co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader.LINE_NUMBER_KEY_NAME;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import javax.annotation.Nullable;
import org.w3c.dom.Element;

public record TagInit(ConversionContext conversionContext, Element element, @Nullable Tag parent) {
  public Position getPosition() {
    return new Position((Integer) this.element.getUserData(LINE_NUMBER_KEY_NAME));
  }
}
