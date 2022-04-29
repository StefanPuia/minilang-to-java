package co.uk.stefanpuia.minilang2java.core.xml;

import static org.assertj.core.api.BDDAssertions.then;

import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;

class CommentElementTest {
  @Test
  void shouldGetComment() {
    final var text = RandomString.make();
    final var comment = new CommentElement(text);
    then(comment.getTextContent()).isEqualTo(text);
  }

  @Test
  void shouldHaveTagName() {
    final var comment = new CommentElement(RandomString.make());
    then(comment.getTagName()).isEqualTo("!comment");
  }
}
