package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.UTIL;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.UtilDelegator;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher.UtilDispatcher;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale.UtilLocale;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.UtilParameters;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap.UtilReturnMap;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.security.UtilSecurity;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone.UtilTimeZone;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.UtilUserLogin;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.List;
import java.util.stream.Collectors;

@MinilangTag(value = "simple-method", mode = UTIL)
public class UtilSimpleMethod extends SimpleMethod {

  public UtilSimpleMethod(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getParameters() {
    return methodContextVariables.stream()
        .map(MethodContextVariable::convertIfUsed)
        .filter(OptionalString::isNotEmpty)
        .collect(Collectors.joining(", "));
  }

  @Override
  protected void addMethodVariablesToContext() {
    methodContextVariables.add(new UtilDelegator(context, this));
    methodContextVariables.add(new UtilDispatcher(context, this));
    methodContextVariables.add(new UtilParameters(context, this));
    methodContextVariables.add(new UtilUserLogin(context, this));
    methodContextVariables.add(new UtilLocale(context, this));
    methodContextVariables.add(new UtilTimeZone(context, this));
    methodContextVariables.add(new UtilReturnMap(context, this));
    methodContextVariables.add(new UtilSecurity(context, this));
    methodContextVariables.stream().map(MethodContextVariable::asUnused).forEach(this::setVariable);
  }

  @Override
  protected String getReturnType() {
    return "void";
  }

  @Override
  protected List<String> getDefaultAssignments() {
    return List.of();
  }
}
