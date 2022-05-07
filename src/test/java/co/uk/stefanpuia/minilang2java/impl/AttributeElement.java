package co.uk.stefanpuia.minilang2java.impl;

import co.uk.stefanpuia.minilang2java.core.xml.impl.AbstractElement;
import java.util.Map;
import java.util.Optional;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

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
  @SuppressWarnings("ConstantConditions")
  public String getAttribute(final String name) {
    return Optional.ofNullable(getAttributes().getNamedItem(name))
        .map(Node::getNodeValue)
        .orElse(null);
  }
}
