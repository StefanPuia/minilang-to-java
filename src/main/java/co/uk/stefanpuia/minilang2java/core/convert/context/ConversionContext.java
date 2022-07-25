package co.uk.stefanpuia.minilang2java.core.convert.context;

import co.uk.stefanpuia.minilang2java.core.handler.error.ErrorHandler;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ConversionContext {

  String getClassName();

  String getBaseIndentation();

  void addStaticImport(VariableType className, String field);

  void addImport(VariableType type);

  Set<String> getImports();

  Set<String> getStaticImports();

  ErrorHandler getErrorHandler();

  MethodMode getMethodMode();

  String getReturnVariable();

  String parseValue(String value);

  Optional<String> parseValueOrInitialize(String type, String value);

  void addMessage(MessageType type, String message);

  void addMessage(MessageType type, String message, Position position);

  List<Message> getMessages();

  String getPackageName();

  boolean isOptimised();
}
