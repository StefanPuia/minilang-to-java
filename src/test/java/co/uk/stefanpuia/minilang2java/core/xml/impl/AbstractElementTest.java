package co.uk.stefanpuia.minilang2java.core.xml.impl;

import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.xml.impl.AbstractElement.EmptyNodeList;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class AbstractElementTest {
  @Test
  void shouldGetEmptyElementsByTagName() {
    final var el = new AbstractElementTestImpl();
    then(el.getElementsByTagName("").getLength()).isEqualTo(0);
  }

  @Test
  void shouldGetEmptyElementsByTagNameNS() {
    final var el = new AbstractElementTestImpl();
    then(el.getElementsByTagNameNS("", "").getLength()).isEqualTo(0);
  }

  static class AbstractElementTestImpl extends AbstractElement {

    @Override
    public String getTagName() {
      return "!test-element";
    }
  }

  @Nested
  class EmptyNodeListTest {
    @Test
    void shouldReturnNullNode() {
      final var nodeList = new EmptyNodeList();
      then(nodeList.item(0)).isNull();
    }

    @Test
    void shouldHaveZeroLength() {
      final var nodeList = new EmptyNodeList();
      then(nodeList.getLength()).isEqualTo(0);
    }
  }
}
