package co.uk.stefanpuia.minilang2java.core.convert.context;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionInit;
import static co.uk.stefanpuia.minilang2java.TestObjects.converterOptions;
import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.UTIL;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import co.uk.stefanpuia.minilang2java.core.handler.error.ErrorHandler;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.model.ImmutableConverterOptions;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.EnumSource.Mode;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.BeanFactory;

@ExtendWith(MockitoExtension.class)
class DefaultConversionContextTest {

  @Mock private BeanFactory beanFactory;

  @Nested
  class GetBaseIndentation {
    @Test
    void shouldGetBaseIndentation() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      then(context.getBaseIndentation()).isNotNull().isEqualTo("  ");
    }

    @Test
    void shouldGetCustomBaseIndentation() {
      final var context =
          new DefaultConversionContext(
              new ConversionInit(
                  "", 0, UTIL, "", null, ImmutableConverterOptions.builder().setTabSize(4).build()),
              beanFactory);
      then(context.getBaseIndentation()).isNotNull().isEqualTo("    ");
    }
  }

  @Nested
  class GetClassNameTest {
    @Test
    void shouldGetClassNameWhenPresent() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      then(context.getClassName()).isNotNull().isEqualTo("TestClass");
    }

    @Test
    void shouldGetDefaultClassNameWhenNotPresent() {
      final var context = new DefaultConversionContext(conversionInit(UTIL, ""), beanFactory);
      then(context.getClassName()).isNotNull().isEqualTo("GeneratedClassName");
    }
  }

  @Nested
  class GetPackageNameTest {
    @Test
    void shouldGetPackageNameWhenPresent() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      then(context.getPackageName()).isNotNull().isEqualTo("test.minilang");
    }

    @Test
    void shouldGetDefaultPackageNameWhenNotPresent() {
      final var context = new DefaultConversionContext(conversionInit(UTIL, ""), beanFactory);
      then(context.getPackageName()).isNotNull().isEqualTo("com.minilang2java");
    }
  }

  @Nested
  class ImportsTest {
    @Test
    void shouldAddImports() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      context.addImport(VariableType.from("SomeClass"));
      then(context.getImports()).hasSize(1).containsExactly("SomeClass");
    }
  }

  @Nested
  class StaticImportsTest {
    @Test
    void shouldAddStaticImports() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      context.addStaticImport(VariableType.from("SomeClass"), "someMethod");
      then(context.getStaticImports()).hasSize(1).containsExactly("SomeClass.someMethod");
    }
  }

  @Nested
  class MessagesTest {
    @Test
    void shouldAddMessage() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      final String errorText = RandomString.make();
      final Position position = new Position(5);
      context.addMessage(MessageType.ERROR, errorText, position);
      then(context.getMessages())
          .hasSize(1)
          .containsExactly(new Message(MessageType.ERROR, errorText, position));
    }

    @Test
    void shouldAddMessageWithNoPosition() {
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      final String errorText = RandomString.make();
      context.addMessage(MessageType.ERROR, errorText);
      then(context.getMessages())
          .hasSize(1)
          .containsExactly(new Message(MessageType.ERROR, errorText, null));
    }
  }

  @Nested
  class GetErrorHandlerTest {
    @Test
    void shouldGetErrorHandler() {
      final var handler = mock(ErrorHandler.class);
      final var context = new DefaultConversionContext(conversionInit(), beanFactory);
      doReturn(handler).when(beanFactory).getBean(ErrorHandler.class, context);
      then(context.getErrorHandler()).isSameAs(handler);
    }
  }

  @Nested
  class GetMethodModeTest {
    @ParameterizedTest
    @EnumSource(value = MethodMode.class, mode = Mode.EXCLUDE, names = "ANY")
    void shouldGetMethodMode(final MethodMode mode) {
      final var context =
          new DefaultConversionContext(conversionInit(mode, converterOptions()), beanFactory);
      then(context.getMethodMode()).isEqualTo(mode);
    }
  }
}