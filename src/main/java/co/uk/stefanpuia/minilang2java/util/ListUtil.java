package co.uk.stefanpuia.minilang2java.util;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ListUtil {

  @SuppressWarnings("unchecked")
  public static List<String> combine(final Object... parts) {
    return Arrays.stream(parts)
        .map(
            part -> {
              if (part instanceof Collection<?>) {
                return part;
              }
              if (part instanceof String) {
                return List.of(part);
              }
              if (part instanceof Optional<?>) {
                return ((Optional<?>) part).map(List::of).orElse(List.of());
              }
              return List.of(part.toString());
            })
        .flatMap(list -> ((List<String>) list).stream())
        .toList();
  }
}
