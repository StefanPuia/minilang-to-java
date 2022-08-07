package co.uk.stefanpuia.minilang2java.tag.root;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.TagIdentifier;
import co.uk.stefanpuia.minilang2java.impl.TagTestImpl;
import co.uk.stefanpuia.minilang2java.tag.root.method.UtilSimpleMethod;
import com.sun.org.apache.xerces.internal.dom.AttrImpl;
import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import com.sun.org.apache.xerces.internal.dom.ElementImpl;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class XmlRootTest {
  @Spy private ConversionContext context = conversionContext();

  @Mock private CoreDocumentImpl document;
  @Mock private ElementImpl element;
  @Mock private AttrImpl methodNameAttr;

  @BeforeEach
  void setUp() throws NoSuchMethodException {
    TagFactory.register(
        new TagIdentifier("simple-method", context.getMethodMode(), false),
        UtilSimpleMethod.class.getConstructor(TagInit.class));
  }

  @Test
  void shouldHaveOwnContext() {
    final var xmlRoot = new XmlRoot(tagInit(context, element));
    then(xmlRoot.hasOwnContext()).isTrue();
  }

  @Test
  void shouldAddPackage() {
    final var packageName = make();
    doReturn(packageName).when(context).getPackageName();
    final var xmlRoot = new XmlRoot(tagInit(context, element));

    then(xmlRoot.convert())
        .anyMatch(str -> str.contains(String.format("package %s;", packageName)));
  }

  @Test
  void shouldAddImports() {
    final var importName = make();
    doReturn(Set.of(importName)).when(context).getImports();
    final var xmlRoot = new XmlRoot(tagInit(context, element));

    then(xmlRoot.convert()).anyMatch(str -> str.contains(String.format("import %s;", importName)));
  }

  @Test
  void shouldAddStaticImports() {
    final var importName = make();
    doReturn(Set.of(importName)).when(context).getStaticImports();
    final var xmlRoot = new XmlRoot(tagInit(context, element));

    then(xmlRoot.convert())
        .anyMatch(str -> str.contains(String.format("import static %s;", importName)));
  }

  @Test
  void shouldAddClassName() {
    final var className = make();
    doReturn(className).when(context).getClassName();
    final var xmlRoot = new XmlRoot(tagInit(context, element));

    then(xmlRoot.convert())
        .anyMatch(str -> str.contains(String.format("public class %s {", className)));
  }

  @Test
  void shouldNotAddSimpleMethodWrapperIfNoChildren() {
    final var xmlRoot = new XmlRoot(tagInit(context, element));
    then(xmlRoot.convert()).noneMatch(str -> str.contains("() {"));
  }

  @Test
  void shouldAddSimpleMethodWrapperIfMissing() {
    doReturn(methodNameAttr).when(document).createAttribute("method-name");
    doReturn("method-name").when(methodNameAttr).getNodeName();
    final String generatedMethodName = "generatedMethod_" + make();
    doReturn(generatedMethodName).when(methodNameAttr).getValue();
    doReturn(document).when(element).getOwnerDocument();
    final var xmlRoot = new XmlRoot(tagInit(context, element));
    xmlRoot.appendChild(new TagTestImpl(tagInit(context, xmlRoot), List.of("converted")));
    then(xmlRoot.convert())
        .anyMatch(str -> str.contains("public void " + generatedMethodName + "() {"));
  }
}