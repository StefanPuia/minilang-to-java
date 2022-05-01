package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader.LINE_NUMBER_KEY_NAME;
import static co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod.SIMPLE_METHOD;

import co.uk.stefanpuia.minilang2java.core.xml.impl.AbstractElement;
import co.uk.stefanpuia.minilang2java.core.xml.impl.NamedNodeMapImpl;
import java.util.Map;
import org.w3c.dom.NamedNodeMap;

public class SimpleMethodElement extends AbstractElement {

  @Override
  protected Map<String, Object> getUserData() {
    return Map.of(LINE_NUMBER_KEY_NAME, -1);
  }

  @Override
  public String getTagName() {
    return SIMPLE_METHOD;
  }

  @Override
  public NamedNodeMap getAttributes() {
    return new AttributesNodes();
  }

  private static class AttributesNodes extends NamedNodeMapImpl {
    @Override
    public int getLength() {
      return 0;
    }
  }
}
