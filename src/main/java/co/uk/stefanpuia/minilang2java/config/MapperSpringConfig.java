package co.uk.stefanpuia.minilang2java.config;

import org.mapstruct.extensions.spring.SpringMapperConfig;

@SpringMapperConfig(conversionServiceAdapterClassName = "ConversionServiceAdapter")
public interface MapperSpringConfig {}
