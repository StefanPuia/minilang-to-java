package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.SERVICE;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.ServiceDelegator;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher.ServiceDispatcher;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale.ServiceLocale;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.ServiceParameters;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap.ServiceReturnMap;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.service.DispatchContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone.ServiceTimeZone;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.ServiceUserLogin;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.List;
import java.util.stream.Collectors;

@MinilangTag(value = "simple-method", mode = SERVICE)
public class ServiceSimpleMethod extends SimpleMethod {
  private final List<MethodContextVariable> parameters =
      List.of(
          new DispatchContext(conversionContext, this),
          new ServiceParameters(conversionContext, this));

  public ServiceSimpleMethod(final TagInit tagInit) {
    super(tagInit);
    parameters.stream().map(MethodContextVariable::asUnused).forEach(this::setVariable);
  }

  @Override
  protected String getReturnType() {
    conversionContext.addImport(DEFAULT_MAP_TYPE);
    return DEFAULT_MAP_TYPE.toString();
  }

  @Override
  protected void addMethodVariablesToContext() {
    methodContextVariables.add(new ServiceDelegator(conversionContext, this));
    methodContextVariables.add(new ServiceDispatcher(conversionContext, this));
    methodContextVariables.add(new ServiceUserLogin(conversionContext, this));
    methodContextVariables.add(new ServiceLocale(conversionContext, this));
    methodContextVariables.add(new ServiceTimeZone(conversionContext, this));
    methodContextVariables.add(new ServiceReturnMap(conversionContext, this));
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
