package co.uk.stefanpuia.minilang2java.tag.callop;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import co.uk.stefanpuia.minilang2java.tag.root.Root;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import com.sun.org.apache.xerces.internal.dom.AttrImpl;
import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import com.sun.org.apache.xerces.internal.dom.ElementImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CallBshTest {

  @Mock private CoreDocumentImpl document;
  @Mock private ElementImpl element;
  @Mock private AttrImpl methodNameAttr;

  @BeforeEach
  void setUp() {
    doReturn(document).when(element).getOwnerDocument();
    doReturn(methodNameAttr).when(document).createAttribute("method-name");
    doReturn("method-name").when(methodNameAttr).getNodeName();
  }

  @Test
  void shouldAddMethodToRoot() {
    doReturn(make()).when(element).getTextContent();
    final var root = mock(Root.class);
    new CallBsh(tagInit(element, root));
    verify(root).appendChild(any(SimpleMethod.class));
  }

  @Test
  void shouldConvertToMethodCall() {
    final String generatedMethodName = "generatedMethod_" + make();
    doReturn(generatedMethodName).when(methodNameAttr).getValue();
    doReturn(make() + "\n" + make() + "\n" + make()).when(element).getTextContent();
    final var callBsh = new CallBsh(tagInit(element, mock(Root.class)));
    then(callBsh.convert())
        .allMatch(str -> str.contains(generatedMethodName + "();"), "method call");
  }
}
