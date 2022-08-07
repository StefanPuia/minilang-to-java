package co.uk.stefanpuia.minilang2java.config;

import static javax.xml.XMLConstants.FEATURE_SECURE_PROCESSING;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalParserHandler;
import co.uk.stefanpuia.minilang2java.core.validate.Validation;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.RequestScope;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

@Configuration
@AllArgsConstructor
public class ConvertBeans {

  @Bean
  @RequestScope
  public PositionalParserHandler positionalParserHandler() throws ParserConfigurationException {
    return new PositionalParserHandler(document());
  }

  @Bean
  public TagFactory tagFactory() {
    return new TagFactory();
  }

  @Bean
  public Validation validation() {
    return new Validation();
  }

  @Bean
  @RequestScope
  public XMLReader xmlReader() throws ParserConfigurationException, SAXException {
    final SAXParserFactory factory = SAXParserFactory.newInstance();
    factory.setFeature(FEATURE_SECURE_PROCESSING, true);
    return factory.newSAXParser().getXMLReader();
  }

  @Bean
  @RequestScope
  public Document document() throws ParserConfigurationException {
    final DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
    final DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
    return docBuilder.newDocument();
  }
}
