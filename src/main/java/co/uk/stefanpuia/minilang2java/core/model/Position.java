package co.uk.stefanpuia.minilang2java.core.model;

import static co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader.LINE_NUMBER_KEY_NAME;

import java.util.Optional;
import javax.annotation.Nullable;
import org.w3c.dom.Element;

public record Position(Integer line) {
  public static Position makePosition(@Nullable final Element element) {
    return new Position(
        Optional.ofNullable(element)
            .flatMap(
                nonNullElement ->
                    Optional.ofNullable((Integer) nonNullElement.getUserData(LINE_NUMBER_KEY_NAME)))
            .orElse(-1));
  }
}
