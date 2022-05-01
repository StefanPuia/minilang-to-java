package co.uk.stefanpuia.minilang2java.tag.misc;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.tag.NonElementTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nullable;

public class JavaCode extends NonElementTag {

  private final List<String> code;

  public JavaCode(
      final ConversionContext context, @Nullable final Tag parent, final List<String> code) {
    super(context, parent);
    this.code = code;
  }

  @Override
  public List<String> convert() {
    return code.stream()
        .map(line -> line.replaceFirst(getIndentationString(), ""))
        .map(this::asComment)
        .toList();
  }

  private String asComment(final String line) {
    return line.matches("^\\s*import.+") ? "// " + line : line;
  }

  private String getIndentationString() {
    return " ".repeat(getIndentationSize(code.get(0)));
  }

  private int getIndentationSize(final String line) {
    final Matcher matcher = Pattern.compile("^(\\s+)").matcher(line);
    return matcher.find() ? matcher.group(0).length() : 0;
  }
}
