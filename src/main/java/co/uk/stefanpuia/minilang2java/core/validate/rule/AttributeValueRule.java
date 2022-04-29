package co.uk.stefanpuia.minilang2java.core.validate.rule;

import java.util.List;

public record AttributeValueRule(String name, List<String> values) implements ValidationRule {}
