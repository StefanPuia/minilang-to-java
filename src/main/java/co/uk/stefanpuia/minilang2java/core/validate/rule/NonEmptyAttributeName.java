package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.core.model.MessageType;

public interface NonEmptyAttributeName extends ValidationRule {
  String name();

  MessageType messageType();
}
