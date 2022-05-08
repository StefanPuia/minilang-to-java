package co.uk.stefanpuia.minilang2java.core.model;

public record LoggingConfig(
    boolean deprecated,
    boolean info,
    boolean warning,
    boolean validationWarning,
    boolean validationError,
    boolean validationDeprecate) {}