package co.uk.stefanpuia.minilang2java.core.handler.error;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ErrorHandlerFactory {
  public static ErrorHandler newInstance(final ConversionContext context) {
    return switch (context.getMethodMode()) {
      case SERVICE -> new ServiceErrorHandler(context);
      case EVENT -> new EventErrorHandler(context);
      default -> new UtilErrorHandler(context);
    };
  }
}
