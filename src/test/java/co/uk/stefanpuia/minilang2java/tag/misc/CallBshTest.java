package co.uk.stefanpuia.minilang2java.tag.misc;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import co.uk.stefanpuia.minilang2java.tag.root.XmlRoot;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;

@ExtendWith(MockitoExtension.class)
class CallBshTest {
  @Mock private Element element;

  @Test
  void shouldAddMethodToRoot() {
    doReturn(make()).when(element).getTextContent();
    final var root = mock(XmlRoot.class);
    new CallBsh(tagInit(element, root));
    verify(root).appendChild(any(SimpleMethod.class));
  }

  @Test
  void shouldConvertToMethodCall() {
    doReturn(make() + "\n" + make() + "\n" + make()).when(element).getTextContent();
    final var callBsh = new CallBsh(tagInit(element, mock(XmlRoot.class)));
    then(callBsh.convert())
        .allMatch(str -> str.contains("generatedMethod_"), "name prefix")
        .allMatch(str -> str.contains("();"), "call");
  }
}
