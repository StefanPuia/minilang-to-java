package co.uk.stefanpuia.minilang2java;

import co.uk.stefanpuia.minilang2java.controller.dto.ConversionRequestOptions;
import co.uk.stefanpuia.minilang2java.controller.dto.ImmutableConversionRequestOptions;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.DefaultConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.model.ConverterOptions;
import co.uk.stefanpuia.minilang2java.core.model.ImmutableConverterOptions;
import co.uk.stefanpuia.minilang2java.core.model.LoggingConfig;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Map;
import org.springframework.beans.factory.BeanFactory;
import org.w3c.dom.Element;

public class TestObjects {

  public static ConversionInit conversionInit() {
    return conversionInit(MethodMode.UTIL, converterOptions());
  }

  public static ConversionInit conversionInit(
      final MethodMode methodMode, final ConverterOptions converterOptions) {
    return new ConversionInit(
        "", 0, methodMode, "test.minilang.TestClass", loggingConfig(), converterOptions);
  }

  public static ConversionInit conversionInit(final MethodMode methodMode, final String className) {
    return new ConversionInit("", 0, methodMode, className, loggingConfig(), converterOptions());
  }

  public static ConverterOptions converterOptions() {
    return ImmutableConverterOptions.builder().build();
  }

  public static LoggingConfig loggingConfig() {
    return new LoggingConfig(true, true, true, true, true, true, true);
  }

  public static ConversionRequestOptions conversionRequestOptions() {
    return ImmutableConversionRequestOptions.builder().build();
  }

  public static ConversionContext conversionContext() {
    return new DefaultConversionContext(conversionInit(), null);
  }

  public static ConversionContext conversionContext(final ConversionInit conversionInit) {
    return new DefaultConversionContext(conversionInit, null);
  }

  public static ConversionContext conversionContext(
      final ConversionInit conversionInit, final BeanFactory beanFactory) {
    return new DefaultConversionContext(conversionInit(), beanFactory);
  }

  private static AttributeElement attributeElement() {
    return new AttributeElement(Map.of());
  }

  public static TagInit tagInit() {
    return tagInit(conversionContext(), attributeElement(), null);
  }

  public static TagInit tagInit(final ConversionContext context) {
    return tagInit(context, attributeElement(), null);
  }

  public static TagInit tagInit(final Element element) {
    return tagInit(conversionContext(), element, null);
  }

  public static TagInit tagInit(final Tag parent) {
    return tagInit(conversionContext(), attributeElement(), parent);
  }

  public static TagInit tagInit(final Element element, final Tag parent) {
    return tagInit(conversionContext(), element, parent);
  }

  public static TagInit tagInit(final ConversionContext context, final Element element) {
    return tagInit(context, element, null);
  }

  public static TagInit tagInit(final ConversionContext context, final Tag parent) {
    return tagInit(context, attributeElement(), parent);
  }

  public static TagInit tagInit(
      final ConversionContext context, final Element element, final Tag parent) {
    return new TagInit(context, element, parent);
  }
}
