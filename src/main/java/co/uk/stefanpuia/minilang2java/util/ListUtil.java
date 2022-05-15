package co.uk.stefanpuia.minilang2java.util;

import java.util.ArrayList;
import java.util.List;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ListUtil {
  public static <T> List<T> wrap(final List<T> before, final List<T> list, final List<T> after) {
    final List<T> newList = new ArrayList<>(before);
    newList.addAll(list);
    newList.addAll(after);
    return newList;
  }

  public static <T> List<T> wrapBefore(final List<T> before, final List<T> list) {
    return wrap(before, list, List.of());
  }

  public static <T> List<T> wrapAfter(final List<T> list, final List<T> after) {
    return wrap(List.of(), list, after);
  }
}
