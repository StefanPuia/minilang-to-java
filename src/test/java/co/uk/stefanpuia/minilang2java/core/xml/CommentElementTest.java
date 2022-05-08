package co.uk.stefanpuia.minilang2java.core.xml;

import static org.assertj.core.api.BDDAssertions.then;

import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CommentElementTest {
  @Mock private CoreDocumentImpl document;

  @Test
  void shouldGetComment() {
    final var text = RandomString.make();
    final var comment = new CommentElement(text, document);
    then(comment.getTextContent()).isEqualTo(text);
  }

  @Test
  void shouldHaveTagName() {
    final var comment = new CommentElement(RandomString.make(), document);
    then(comment.getTagName()).isEqualTo("!comment");
  }
}
