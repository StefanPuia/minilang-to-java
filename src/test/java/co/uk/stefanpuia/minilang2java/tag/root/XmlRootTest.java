package co.uk.stefanpuia.minilang2java.tag.root;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;

@ExtendWith(MockitoExtension.class)
class XmlRootTest {
  @Mock private ConversionContext context;
  @Mock private Element element;

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
}
