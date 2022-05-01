package co.uk.stefanpuia.minilang2java.tag.misc;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static java.lang.String.format;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import java.util.List;
import org.junit.jupiter.api.Test;

class JavaCodeTest {
  private final ConversionContext context = conversionContext();

  @Test
  void shouldReplaceIndentationBasedOnFirstLine() {
    final var strings = List.of(make(), make(), make(), make(), make(), make(), make());
    final var lines =
        List.of(
            format("    %s", strings.get(0)),
            format("      %s", strings.get(1)),
            format("   %s", strings.get(2)),
            format("       %s", strings.get(3)),
            format("     %s", strings.get(4)),
            format("         %s", strings.get(5)),
            format("%s", strings.get(6)));
    final var tag = new JavaCode(context, null, lines);
    then(tag.convert())
        .containsExactly(
            format("%s", strings.get(0)),
            format("  %s", strings.get(1)),
            format("   %s", strings.get(2)),
            format("   %s", strings.get(3)),
            format(" %s", strings.get(4)),
            format("     %s", strings.get(5)),
            format("%s", strings.get(6)));
  }

  @Test
  void shouldCommentImportStatements() {
    final var tag = new JavaCode(context, null, List.of("  import someclass;"));
    then(tag.convert()).containsExactly("// import someclass;");
  }

  @Test
  void shouldConvertEmptyList() {
    final var tag = new JavaCode(context, null, List.of());
    then(tag.convert()).isEmpty();
  }

  @Test
  void shouldNotReplaceIndentationIfFirstLineNotIndented() {
    final var lines =
        List.of(format("%s", make()), format("      %s", make()), format("   %s", make()));
    final var tag = new JavaCode(context, null, lines);
    then(tag.convert()).containsExactlyElementsOf(lines);
  }
}
