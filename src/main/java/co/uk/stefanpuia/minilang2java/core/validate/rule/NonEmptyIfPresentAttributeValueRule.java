package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.core.model.MessageType;

public record NonEmptyIfPresentAttributeValueRule(String name, MessageType messageType)
    implements NonEmptyAttributeName {}
