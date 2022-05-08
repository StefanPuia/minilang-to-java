package co.uk.stefanpuia.minilang2java.impl;

import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import com.sun.org.apache.xerces.internal.dom.ElementImpl;
import java.util.Map;
import java.util.Optional;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

public class AttributeElement extends ElementImpl {

  public static final String TEST_ATTRIBUTES = "!test-attributes";
  private final NamedNodeMap attributes;

  public AttributeElement(final Map<String, String> attributes) {
    super(mock(CoreDocumentImpl.class, RETURNS_DEEP_STUBS), TEST_ATTRIBUTES);
    this.attributes = TestNamedNodeMap.of(attributes);
  }

  @Override
  public String getTagName() {
    return TEST_ATTRIBUTES;
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
