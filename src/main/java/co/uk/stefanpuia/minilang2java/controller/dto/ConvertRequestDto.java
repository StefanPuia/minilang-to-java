package co.uk.stefanpuia.minilang2java.controller.dto;

import co.uk.stefanpuia.minilang2java.core.model.MethodMode;

public record ConvertRequestDto(
    String input, MethodMode methodMode, String className, ConversionRequestOptions options) {}
