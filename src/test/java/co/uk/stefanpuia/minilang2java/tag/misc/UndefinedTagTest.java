package co.uk.stefanpuia.minilang2java.tag.misc;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;

@ExtendWith(MockitoExtension.class)
class UndefinedTagTest {
  private final ConversionContext context = conversionContext();
  @Mock private Element element;

  @Test
  void shouldConvertSingleLine() {
    // Given
    doReturn("some-tag").when(element).getTagName();
    doReturn(5).when(element).getUserData("lineNumber");
    final UndefinedTag undefinedTag = new UndefinedTag(tagInit(context, element));

    // When - Then
    then(undefinedTag.convert())
        .hasSize(1)
        .allMatch(str -> str.contains("// Unparsed tag [some-tag]:5"));
  }

  @Test
  void shouldConvertMultipleLines() {
    // Given
    doReturn("some-tag").when(element).getTagName();
    doReturn(5).when(element).getUserData("lineNumber");
    final var child = mock(Tag.class);
    doReturn(List.of("mock tag")).when(child).convert();
    final UndefinedTag undefinedTag = new UndefinedTag(tagInit(context, element));
    undefinedTag.appendChild(child);

    // When - Then
    then(undefinedTag.convert())
        .hasSize(3)
        .containsExactly(
            "// Begin unparsed tag [some-tag]:5", "  mock tag", "// End unparsed tag [some-tag]");
  }
}
