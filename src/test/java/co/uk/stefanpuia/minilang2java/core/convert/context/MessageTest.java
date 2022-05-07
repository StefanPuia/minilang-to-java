package co.uk.stefanpuia.minilang2java.core.convert.context;

import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import org.junit.jupiter.api.Test;

class MessageTest {
  @Test
  void shouldRenderWithPosition() {

    // Given
    final String messageText = make();
    final var message = new Message(MessageType.DEPRECATE, messageText, new Position(10));

    // When - Then
    then(message.render()).isNotNull().isEqualTo("DEPRECATE: " + messageText + " (line: 10)");
  }

  @Test
  void shouldRenderWithoutPosition() {

    // Given
    final String messageText = make();
    final var message = new Message(MessageType.ERROR, messageText, null);

    // When - Then
    then(message.render()).isNotNull().isEqualTo("ERROR: " + messageText);
  }
}
