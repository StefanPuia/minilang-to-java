package co.uk.stefanpuia.minilang2java.tag.root.method;

import static org.assertj.core.api.BDDAssertions.then;

import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SimpleMethodElementTest {
  private final CoreDocumentImpl document = new CoreDocumentImpl();
  private SimpleMethodElement element;

  @BeforeEach
  void setUp() {
    element = new SimpleMethodElement(document, "someTestMethod");
  }

  @Test
  void shouldHaveLineNumber() {
    then(element.getUserData("lineNumber")).isEqualTo(-1);
  }

  @Test
  void shouldHaveTagName() {
    then(element.getTagName()).isEqualTo("simple-method");
  }

  @Test
  void shouldHaveAttributes() {
    then(element.getAttributes()).isNotNull();
  }
}
