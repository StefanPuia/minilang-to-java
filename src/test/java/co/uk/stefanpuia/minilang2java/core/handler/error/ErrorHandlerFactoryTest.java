package co.uk.stefanpuia.minilang2java.core.handler.error;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import java.util.stream.Stream;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ErrorHandlerFactoryTest {
  @Mock private ConversionContext context;

  public static Stream<Arguments> errorHandlerTypes() {
    return Stream.of(
        Arguments.of(MethodMode.SERVICE, ServiceErrorHandler.class),
        Arguments.of(MethodMode.EVENT, EventErrorHandler.class),
        Arguments.of(MethodMode.UTIL, UtilErrorHandler.class),
        Arguments.of(MethodMode.ANY, UtilErrorHandler.class));
  }

  @ParameterizedTest
  @MethodSource("errorHandlerTypes")
  void shouldBeCorrectInstance(final MethodMode mode, final Class<ErrorHandler> handlerClass) {
    doReturn(mode).when(context).getMethodMode();
    final var handler = ErrorHandlerFactory.newInstance(context);
    assertEquals(handlerClass, handler.getClass());
  }
}
