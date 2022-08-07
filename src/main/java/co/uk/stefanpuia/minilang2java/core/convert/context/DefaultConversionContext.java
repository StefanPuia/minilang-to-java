package co.uk.stefanpuia.minilang2java.core.convert.context;

import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.qualify.ImmutableQualifiedStaticField;
import co.uk.stefanpuia.minilang2java.core.qualify.QualifiedClass;
import co.uk.stefanpuia.minilang2java.core.qualify.QualifiedStaticField;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DefaultConversionContext implements ConversionContext {
  private final List<Message> messages = new ArrayList<>();
  private final List<QualifiedClass> imports = new ArrayList<>();
  private final List<QualifiedStaticField> staticImports = new ArrayList<>();

  private final ConversionInit config;

  @Override
  public String getClassName() {
    return QualifiedClass.from(config.className()).getClassName().orElse("GeneratedClassName");
  }

  @Override
  public String getBaseIndentation() {
    return " ".repeat(config.converterOptions().getIndentationSize());
  }

  @Override
  public void addStaticImport(final VariableType type, final String field) {
    staticImports.add(ImmutableQualifiedStaticField.of(type.getType(), field));
    type.getParameters().forEach(this::addImport);
  }

  @Override
  public void addImport(final VariableType type) {
    if (type.getType().isRequiresImport(getPackageName())) {
      imports.add(type.getType());
    }
  }

  @Override
  public Set<String> getImports() {
    return imports.stream().map(QualifiedClass::qualify).collect(Collectors.toSet());
  }

  @Override
  public Set<String> getStaticImports() {
    return staticImports.stream().map(QualifiedStaticField::qualify).collect(Collectors.toSet());
  }

  @Override
  public MethodMode getMethodMode() {
    return config.methodMode();
  }

  @Override
  public void addMessage(final MessageType type, final String message) {
    addMessage(type, message, null);
  }

  @Override
  public void addMessage(final MessageType type, final String message, final Position position) {
    messages.add(new Message(type, message, position));
  }

  @Override
  public List<Message> getMessages() {
    return messages;
  }

  @Override
  public String getPackageName() {
    return QualifiedClass.from(config.className()).getPackageName().orElse("com.minilang2java");
  }

  @Override
  public boolean isOptimised() {
    return !config.converterOptions().isReplicateMinilang();
  }
}
