package co.uk.stefanpuia.minilang2java.config;

import static javax.xml.XMLConstants.FEATURE_SECURE_PROCESSING;
import static org.springframework.web.context.WebApplicationContext.SCOPE_REQUEST;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.DefaultConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalParserHandler;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader;
import co.uk.stefanpuia.minilang2java.core.handler.error.ErrorHandler;
import co.uk.stefanpuia.minilang2java.core.handler.error.ErrorHandlerFactory;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@Configuration
@AllArgsConstructor
public class ConvertBeans {
  private final BeanFactory beanFactory;

  @Bean
  @Scope(SCOPE_REQUEST)
  public PositionalParserHandler buildPositionalParserHandler(final ConversionContext context)
      throws ParserConfigurationException {
    return new PositionalParserHandler(context, buildDocument());
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public ConversionContext buildConversionContext(final ConversionInit config) {
    return new DefaultConversionContext(config, beanFactory);
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public PositionalXMLReader buildPositionalXMLReader(final ConversionInit config)
      throws ParserConfigurationException, SAXException {
    return new PositionalXMLReader(
        buildPositionalParserHandler(buildConversionContext(config)), buildXmlParser());
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public XMLReader buildXmlParser() throws ParserConfigurationException, SAXException {
    final SAXParserFactory factory = SAXParserFactory.newInstance();
    factory.setFeature(FEATURE_SECURE_PROCESSING, true);
    return factory.newSAXParser().getXMLReader();
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public Document buildDocument() throws ParserConfigurationException {
    final DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
    final DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
    return docBuilder.newDocument();
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public ErrorHandler buildErrorHandler(final ConversionContext context) {
    return ErrorHandlerFactory.newInstance(context);
  }
}
