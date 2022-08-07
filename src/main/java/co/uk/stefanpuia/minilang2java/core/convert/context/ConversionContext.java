package co.uk.stefanpuia.minilang2java.core.convert.context;

import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;
import java.util.Set;

public interface ConversionContext {

  String getClassName();

  String getBaseIndentation();

  void addStaticImport(VariableType className, String field);

  void addImport(VariableType type);

  Set<String> getImports();

  Set<String> getStaticImports();

  MethodMode getMethodMode();

  void addMessage(MessageType type, String message);

  void addMessage(MessageType type, String message, Position position);

  List<Message> getMessages();

  String getPackageName();

  boolean isOptimised();
}
