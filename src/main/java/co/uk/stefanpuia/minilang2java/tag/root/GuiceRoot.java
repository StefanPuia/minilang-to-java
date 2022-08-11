package co.uk.stefanpuia.minilang2java.tag.root;

import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.GuiceDelegator;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher.GuiceDispatcher;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale.GuiceLocale;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.security.GuiceSecurity;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone.GuiceTimeZone;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.GuiceUserLogin;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@MinilangTag(value = "xml-root", mode = MethodMode.GUICE_SERVICE)
public class GuiceRoot extends Root {

  public GuiceRoot(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected String getClassLine() {
    context.addImport(VariableType.from("AbstractGuiceService"));
    return format("public class %s extends AbstractGuiceService {", context.getClassName());
  }

  @Override
  protected List<String> getClassMembers() {
    context.addImport(VariableType.from("Inject"));
    return combine(
        super.getClassMembers(),
        "",
        getClassFields(),
        "",
        "@Inject",
        "public %s {".formatted(getConstructorSignature()),
        getInjectedFieldAssignments(),
        "}");
  }

  private List<String> getClassFields() {
    return streamUsedFields()
        .map(MethodContextVariable::convert)
        .map("private %s;"::formatted)
        .toList();
  }

  private String getConstructorSignature() {
    return "%s(%s)".formatted(context.getClassName(), getInjectedFieldsAsConstructorArguments());
  }

  private String getInjectedFieldsAsConstructorArguments() {
    return streamUsedFields().map(MethodContextVariable::convert).collect(Collectors.joining(", "));
  }

  private List<String> getInjectedFieldAssignments() {
    return streamUsedFields()
        .map(v -> "this.%s = %s;".formatted(v.getName(), v.getName()))
        .map(this::prependIndentation)
        .toList();
  }

  private Stream<MethodContextVariable> streamUsedFields() {
    return getInjectedFields().stream().filter(MethodContextVariable::isUsed);
  }

  private List<MethodContextVariable> getInjectedFields() {
    return List.of(
        new GuiceDelegator(context, this),
        new GuiceDispatcher(context, this),
        new GuiceLocale(context, this),
        new GuiceTimeZone(context, this),
        new GuiceSecurity(context, this),
        new GuiceUserLogin(context, this));
  }
}
