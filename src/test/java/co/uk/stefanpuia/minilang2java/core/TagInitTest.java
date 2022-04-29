package co.uk.stefanpuia.minilang2java.core;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.model.Position;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;

@ExtendWith(MockitoExtension.class)
class TagInitTest {
  @Mock private Element element;

  @Test
  void shouldGetPosition() {
    // Given
    final TagInit tagInit = new TagInit(conversionContext(), element, null);
    doReturn(5).when(element).getUserData("lineNumber");

    // When
    final Position position = tagInit.getPosition();

    // Then
    then(position).extracting(Position::line).isEqualTo(5);
  }
}
