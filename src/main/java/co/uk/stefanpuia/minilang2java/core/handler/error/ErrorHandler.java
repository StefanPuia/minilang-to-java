package co.uk.stefanpuia.minilang2java.core.handler.error;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import java.util.List;

public abstract class ErrorHandler {
  protected final ConversionContext context;

  protected ErrorHandler(final ConversionContext context) {
    this.context = context;
  }

  public abstract List<String> returnError(String value);
}
