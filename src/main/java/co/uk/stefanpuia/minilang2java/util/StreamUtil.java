package co.uk.stefanpuia.minilang2java.util;

import static java.util.function.Predicate.not;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import lombok.experimental.UtilityClass;

@UtilityClass
public class StreamUtil {

  @SuppressWarnings("unchecked")
  public static <SourceT, TargetT> Stream<TargetT> filterTypes(
      final Stream<SourceT> stream, final Class<TargetT> type) {
    return stream.filter(obj -> type.isAssignableFrom(obj.getClass())).map(obj -> (TargetT) obj);
  }

  public static <T> Stream<T> filterOutTypes(final Stream<T> stream, final Class<?>... types) {
    final List<Class<?>> typeList = Arrays.asList(types);
    return stream.filter(
        not(obj -> typeList.stream().anyMatch(type -> type.isAssignableFrom(obj.getClass()))));
  }

  @SafeVarargs
  public static <T> Optional<T> firstPresent(final Optional<T>... optionals) {
    return Stream.of(optionals).filter(Optional::isPresent).flatMap(Optional::stream).findFirst();
  }
}
