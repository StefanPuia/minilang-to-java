package co.uk.stefanpuia.minilang2java.config;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;

import org.mapstruct.MapperConfig;
import org.mapstruct.ReportingPolicy;

@MapperConfig(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR,
    injectionStrategy = CONSTRUCTOR)
public interface MapstructConfig {}
