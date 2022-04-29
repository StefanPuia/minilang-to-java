package co.uk.stefanpuia.minilang2java.core.handler.error;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;

public class ServiceErrorHandler extends ErrorHandler {

  protected ServiceErrorHandler(final ConversionContext context) {
    super(context);
  }

  @Override
  public List<String> returnError(final String value) {
    context.addStaticImport(VariableType.from("ServiceUtil"), "returnError");
    return List.of(String.format("return returnError(%s);", value));
  }
}
