package co.uk.stefanpuia.minilang2java.core.model;

public record ConversionInit(
    String source,
    int lines,
    MethodMode methodMode,
    String className,
    LoggingConfig logging,
    ConverterOptions converterOptions) {}
