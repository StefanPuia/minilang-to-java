package co.uk.stefanpuia.minilang2java.core.handler.error;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import java.util.List;

public class UtilErrorHandler extends ErrorHandler {

  protected UtilErrorHandler(final ConversionContext context) {
    super(context);
  }

  @Override
  public List<String> returnError(final String value) {
    return List.of(String.format("throw new Exception(%s);", value));
  }
}
