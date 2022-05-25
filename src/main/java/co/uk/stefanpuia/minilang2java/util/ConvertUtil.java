package co.uk.stefanpuia.minilang2java.util;

import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ConvertUtil {
  public static List<String> convertTagsPrepend(final Tag self, final List<Tag> tags) {
    return tags.stream()
        .map(Tag::convert)
        .map(lines -> indent(self, lines))
        .flatMap(List::stream)
        .toList();
  }

  public static List<String> indent(final Tag self, final List<String> lines) {
    return lines.stream().map(self::prependIndentation).toList();
  }

  public static List<String> convertTags(final List<Tag> tags) {
    return tags.stream().map(Tag::convert).flatMap(List::stream).toList();
  }
}
