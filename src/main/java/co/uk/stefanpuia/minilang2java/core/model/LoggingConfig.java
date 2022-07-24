package co.uk.stefanpuia.minilang2java.core.model;

public record LoggingConfig(
    boolean deprecated,
    boolean info,
    boolean timing,
    boolean warning,
    boolean validationWarning,
    boolean validationError,
    boolean validationDeprecate) {}
