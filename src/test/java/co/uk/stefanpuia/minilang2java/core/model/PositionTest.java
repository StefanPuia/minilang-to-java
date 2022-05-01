package co.uk.stefanpuia.minilang2java.core.model;

import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.w3c.dom.Element;

class PositionTest {
  @Test
  void shouldReturnMinusOneForNullElement() {
    then(Position.makePosition(null)).isEqualTo(new Position(-1));
  }

  @Test
  void shouldReturnMinusOneForNullAttribute() {
    final var element = mock(Element.class);
    then(Position.makePosition(element)).isEqualTo(new Position(-1));
  }

  @Test
  void shouldReturnPosition() {
    final var element = mock(Element.class);
    doReturn(24).when(element).getUserData("lineNumber");
    then(Position.makePosition(element)).isEqualTo(new Position(24));
  }
}
