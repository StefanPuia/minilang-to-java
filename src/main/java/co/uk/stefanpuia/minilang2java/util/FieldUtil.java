package co.uk.stefanpuia.minilang2java.util;

import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.experimental.UtilityClass;

@UtilityClass
public class FieldUtil {
  public static String makeName(final Object... parts) {
    return Stream.of(parts)
        .map(Object::toString)
        .collect(Collectors.joining("_"))
        .replaceAll("\\W+", "_")
        .replaceAll("^_+|_+$", "")
        .replaceAll("_+", "_");
  }
}
