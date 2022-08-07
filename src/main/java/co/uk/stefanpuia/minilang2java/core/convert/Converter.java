package co.uk.stefanpuia.minilang2java.core.convert;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.TIMING;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.DefaultConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.Message;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalParserHandler;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXmlReader;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.Validation;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.web.context.annotation.RequestScope;
import org.xml.sax.XMLReader;

@Component
@RequestScope
@Slf4j
@AllArgsConstructor
public class Converter {
  private PositionalParserHandler positionalParserHandler;
  private XMLReader xmlReader;
  private TagFactory tagFactory;
  private Validation validation;

  public String convert(final ConversionInit config) {
    final var context = getConversionContext(config);
    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    String output;
    try {
      final var tags = getReader(context).readTags(config.source());
      output = String.join("\n", convertElements(tags));
    } catch (MinilangConversionException e) {
      LOGGER.trace("Conversion exception", e);
      output = e.getMessage();
    }

    stopWatch.stop();
    context.addMessage(
        TIMING,
        String.format(
            "Finished parsing %s lines in %.3f seconds",
            config.lines(), stopWatch.getTotalTimeMillis() / 1000.0));
    return (output + "\n\n" + renderMessages(context, config)).replaceAll("\\n{3,}", "\n\n");
  }

  // FIXME
  protected PositionalXmlReader getReader(final ConversionContext context) {
    return new PositionalXmlReader(
        context, positionalParserHandler, xmlReader, tagFactory, validation);
  }

  private ConversionContext getConversionContext(final ConversionInit config) {
    return new DefaultConversionContext(config);
  }

  private String renderMessages(final ConversionContext context, final ConversionInit config) {
    return context.getMessages().stream()
        .filter(message -> message.messageType().isEnabled(config.logging()))
        .map(Message::render)
        .map(line -> "// " + line)
        .collect(Collectors.joining("\n"));
  }

  private List<String> convertElements(final List<Tag> tags) {
    return tags.stream().map(Tag::convert).flatMap(List::stream).toList();
  }
}
