package co.uk.stefanpuia.minilang2java.tag.root.method;

import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.w3c.dom.NamedNodeMap;

class SimpleMethodElementTest {
  final SimpleMethodElement element = new SimpleMethodElement();

  @Test
  void shouldHaveLineNumber() {
    then(element.getUserData("lineNumber")).isEqualTo(-1);
  }

  @Test
  void shouldHaveTagName() {
    then(element.getTagName()).isEqualTo("simple-method");
  }

  @Test
  void shouldHaveAttributes() {
    then(element.getAttributes()).isNotNull();
  }

  @Nested
  class AttributeNodesTest {
    @Test
    void shouldHaveNoLength() {
      then(element.getAttributes()).extracting(NamedNodeMap::getLength).isEqualTo(0);
    }
  }
}
