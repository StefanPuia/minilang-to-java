package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.EVENT;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.EventDelegator;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher.EventDispatcher;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale.EventLocale;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.EventParameters;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventResponse;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone.EventTimeZone;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.EventUserLogin;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.List;
import java.util.stream.Collectors;

@MinilangTag(value = "simple-method", mode = EVENT)
public class EventSimpleMethod extends SimpleMethod {

  private final List<MethodContextVariable> parameters =
      List.of(
          new EventRequest(conversionContext, this), new EventResponse(conversionContext, this));

  public EventSimpleMethod(final TagInit tagInit) {
    super(tagInit);
    parameters.forEach(
        variable -> setVariable(new ContextVariable(variable.getName(), 0, variable.getType())));
  }

  @Override
  protected String getReturnType() {
    return "String";
  }

  @Override
  protected void addMethodVariablesToContext() {
    methodContextVariables.add(new EventDelegator(conversionContext, this));
    methodContextVariables.add(new EventDispatcher(conversionContext, this));
    methodContextVariables.add(new EventParameters(conversionContext, this));
    methodContextVariables.add(new EventUserLogin(conversionContext, this));
    methodContextVariables.add(new EventLocale(conversionContext, this));
    methodContextVariables.add(new EventTimeZone(conversionContext, this));
    methodContextVariables.stream().map(MethodContextVariable::asUnused).forEach(this::setVariable);
  }

  @Override
  protected String getParameters() {
    return parameters.stream()
        .map(MethodContextVariable::convert)
        .collect(Collectors.joining(", "));
  }

  @Override
  protected List<String> getDefaultAssignments() {
    return methodContextVariables.stream()
        .map(MethodContextVariable::convertIfUsed)
        .filter(OptionalString::isNotEmpty)
        .toList();
  }
}
