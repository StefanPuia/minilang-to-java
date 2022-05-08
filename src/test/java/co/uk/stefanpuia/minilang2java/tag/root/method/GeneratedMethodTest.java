package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.conversionInit;
import static co.uk.stefanpuia.minilang2java.TestObjects.converterOptions;
import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.BDDAssertions.thenThrownBy;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import com.sun.org.apache.xerces.internal.dom.AttrImpl;
import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GeneratedMethodTest {

  @Test
  void shouldHaveRandomName() {
    final var method = new GeneratedMethod();
    then(method.getMethodName())
        .startsWith("generatedMethod_")
        .hasSizeGreaterThan("generatedMethod_".length());
  }

  @Test
  void shouldHaveRandomNamesEveryTime() {
    final var method1 = new GeneratedMethod();
    final var method2 = new GeneratedMethod();
    then(method1.getMethodName()).isNotEqualTo(method2.getMethodName());
  }

  @Nested
  class FactoryTest {

    @Mock private Tag tag;
    @Mock private CoreDocumentImpl document;
    @Mock private AttrImpl methodNameAttr;

    @BeforeEach
    void setUp() {
      doReturn(methodNameAttr).when(document).createAttribute("method-name");
      doReturn("method-name").when(methodNameAttr).getNodeName();
    }

    @Test
    void shouldGetUtilMethod() {
      final var context = conversionContext(conversionInit(MethodMode.UTIL, converterOptions()));
      final var method = GeneratedMethod.createTag(context, tag, document);
      then(method).isInstanceOf(UtilSimpleMethod.class);
    }

    @Test
    void shouldGetEventMethod() {
      final var context = conversionContext(conversionInit(MethodMode.EVENT, converterOptions()));
      final var method = GeneratedMethod.createTag(context, tag, document);
      then(method).isInstanceOf(EventSimpleMethod.class);
    }

    @Test
    void shouldGetServiceMethod() {
      final var context = conversionContext(conversionInit(MethodMode.SERVICE, converterOptions()));
      final var method = GeneratedMethod.createTag(context, tag, document);
      then(method).isInstanceOf(ServiceSimpleMethod.class);
    }

    @Test
    void shouldThrowExceptionIfNotHandled() {
      final var context = conversionContext(conversionInit(MethodMode.ANY, converterOptions()));
      thenThrownBy(() -> GeneratedMethod.createTag(context, tag, document))
          .isInstanceOf(TagInstantiationException.class);
    }
  }
}
