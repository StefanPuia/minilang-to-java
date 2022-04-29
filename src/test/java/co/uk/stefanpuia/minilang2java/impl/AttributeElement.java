package co.uk.stefanpuia.minilang2java.impl;

import co.uk.stefanpuia.minilang2java.core.xml.AbstractElement;
import java.util.Map;
import org.w3c.dom.NamedNodeMap;

public class AttributeElement extends AbstractElement {

  private final NamedNodeMap attributes;

  public AttributeElement(final Map<String, String> attributes) {
    this.attributes = TestNamedNodeMap.of(attributes);
  }

  @Override
  public String getTagName() {
    return "!test-attributes";
  }

  @Override
  public NamedNodeMap getAttributes() {
    return attributes;
  }

  @Override
  public String getAttribute(final String name) {
    return getAttributes().getNamedItem(name).getNodeValue();
  }
}
