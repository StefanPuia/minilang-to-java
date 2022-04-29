package co.uk.stefanpuia.minilang2java.tag.misc;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;

@ExtendWith(MockitoExtension.class)
class CommentTest {
  private final ConversionContext context = conversionContext();
  @Mock private Element element;
  private Comment comment;

  @BeforeEach
  void setUp() {
    comment = new Comment(tagInit(context, element));
  }

  @Test
  void shouldConvertSingleLine() {
    final String message = make();
    doReturn(message).when(element).getTextContent();
    then(comment.convert()).hasSize(1).containsExactly("// " + message);
  }

  @Test
  void shouldConvertMultipleLines() {
    final String messageLine1 = make();
    final String messageLine2 = make();
    final String messageLine3 = make();
    doReturn(messageLine1 + "\n" + messageLine2 + "\n" + messageLine3)
        .when(element)
        .getTextContent();
    then(comment.convert())
        .hasSize(5)
        .containsExactly(
            "/*", " * " + messageLine1, " * " + messageLine2, " * " + messageLine3, "*/");
  }
}
