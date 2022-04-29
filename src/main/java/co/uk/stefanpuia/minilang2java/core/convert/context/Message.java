package co.uk.stefanpuia.minilang2java.core.convert.context;

import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import java.util.Objects;
import javax.annotation.Nullable;

public record Message(MessageType messageType, String message, @Nullable Position position) {
  public String render() {
    return position == null ? renderWithoutPosition() : renderWithPosition();
  }

  private String renderWithPosition() {
    return String.format(
        "%s: %s (line %s)", messageType, message, Objects.requireNonNull(position).line());
  }

  private String renderWithoutPosition() {
    return String.format("%s: %s", messageType, message);
  }
}
