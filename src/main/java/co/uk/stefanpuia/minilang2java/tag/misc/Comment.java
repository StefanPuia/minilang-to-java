package co.uk.stefanpuia.minilang2java.tag.misc;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@MinilangTag("!comment")
public class Comment extends Tag {
  public Comment(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convert() {
    final var lines = this.element.getTextContent().split("\n");
    return lines.length > 1
        ? multiLineComment(lines)
        : List.of(String.format("// %s", this.element.getTextContent()));
  }

  private List<String> multiLineComment(final String... lines) {
    final List<String> converted = new ArrayList<>();
    converted.add("/*");
    Arrays.stream(lines)
        .map(String::trim)
        .filter(OptionalString::isNotEmpty)
        .map(line -> String.format(" * %s", line))
        .forEach(converted::add);
    converted.add("*/");
    return converted;
  }
}
