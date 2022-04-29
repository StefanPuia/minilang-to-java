package co.uk.stefanpuia.minilang2java.core.handler.error;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.RequestAttribute.VAR_REQUEST_ERROR_MESSAGE;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest.VAR_REQUEST;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;

public class EventErrorHandler extends ErrorHandler {

  protected EventErrorHandler(final ConversionContext context) {
    super(context);
  }

  @Override
  public List<String> returnError(final String value) {
    context.addStaticImport(VariableType.from("ServiceUtil"), "returnError");
    return List.of(
        String.format(
            "%s.setAttribute(\"%s\", %s);", VAR_REQUEST, VAR_REQUEST_ERROR_MESSAGE, value),
        "return \"error\";");
  }
}
