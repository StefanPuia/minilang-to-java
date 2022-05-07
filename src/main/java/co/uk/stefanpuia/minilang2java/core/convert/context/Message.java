package co.uk.stefanpuia.minilang2java.core.convert.context;

import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import java.util.Optional;
import javax.annotation.Nullable;

public record Message(MessageType messageType, String message, @Nullable Position position) {
  public String render() {
    return Optional.ofNullable(position())
        .map(this::renderWithPosition)
        .orElseGet(this::renderWithoutPosition);
  }

  private String renderWithPosition(final Position nonNullPosition) {
    return String.format("%s: %s (%s)", messageType(), message(), nonNullPosition);
  }

  private String renderWithoutPosition() {
    return String.format("%s: %s", messageType(), message());
  }
}
