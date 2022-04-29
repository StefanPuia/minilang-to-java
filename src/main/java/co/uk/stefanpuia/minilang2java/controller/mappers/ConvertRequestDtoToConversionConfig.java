package co.uk.stefanpuia.minilang2java.controller.mappers;

import co.uk.stefanpuia.minilang2java.config.MapstructConfig;
import co.uk.stefanpuia.minilang2java.controller.dto.ConvertRequestDto;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.core.convert.converter.Converter;

@Mapper(config = MapstructConfig.class)
public interface ConvertRequestDtoToConversionConfig
    extends Converter<ConvertRequestDto, ConversionInit> {

  @Override
  @Mapping(target = "source", source = "input")
  @Mapping(target = "lines", source = "input")
  ConversionInit convert(ConvertRequestDto source);

  default int getInputLinesCount(final String value) {
    return value.split("\n").length;
  }
}
