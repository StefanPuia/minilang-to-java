package co.uk.stefanpuia.minilang2java.config;

import static javax.xml.XMLConstants.FEATURE_SECURE_PROCESSING;
import static org.springframework.web.context.WebApplicationContext.SCOPE_APPLICATION;
import static org.springframework.web.context.WebApplicationContext.SCOPE_REQUEST;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.DefaultConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalParserHandler;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader;
import co.uk.stefanpuia.minilang2java.core.handler.error.ErrorHandler;
import co.uk.stefanpuia.minilang2java.core.handler.error.ErrorHandlerFactory;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.validate.Validation;
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
  public PositionalParserHandler positionalParserHandler() throws ParserConfigurationException {
    return new PositionalParserHandler(document());
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public ConversionContext conversionContext(final ConversionInit config) {
    return new DefaultConversionContext(config, beanFactory);
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public PositionalXMLReader positionalXMLReader(final ConversionContext context)
      throws ParserConfigurationException, SAXException {
    return new PositionalXMLReader(
        context, positionalParserHandler(), xmlParser(), tagFactory(), validation());
  }

  @Bean
  @Scope(SCOPE_APPLICATION)
  public TagFactory tagFactory() {
    return new TagFactory();
  }

  @Bean
  @Scope(SCOPE_APPLICATION)
  public Validation validation() {
    return new Validation();
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public XMLReader xmlParser() throws ParserConfigurationException, SAXException {
    final SAXParserFactory factory = SAXParserFactory.newInstance();
    factory.setFeature(FEATURE_SECURE_PROCESSING, true);
    return factory.newSAXParser().getXMLReader();
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public Document document() throws ParserConfigurationException {
    final DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
    final DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
    return docBuilder.newDocument();
  }

  @Bean
  @Scope(SCOPE_REQUEST)
  public ErrorHandler errorHandler(final ConversionContext context) {
    return ErrorHandlerFactory.newInstance(context);
  }
}
