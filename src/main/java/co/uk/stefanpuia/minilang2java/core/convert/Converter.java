package co.uk.stefanpuia.minilang2java.core.convert;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.INFO;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.Message;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalXMLReader;
import co.uk.stefanpuia.minilang2java.core.model.ConversionInit;
import co.uk.stefanpuia.minilang2java.core.model.exception.MinilangConversionException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Component
@Slf4j
@AllArgsConstructor
public class Converter {
  private final BeanFactory beanFactory;

  public String convert(final ConversionInit config) {
    final var context = getConversionContext(config);
    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    String output;
    try {
      final var tags = getReader(context).readXML(config.source());
      output = String.join("\n", convertElements(tags));
    } catch (MinilangConversionException e) {
      LOGGER.trace("Conversion exception", e);
      output = e.getMessage();
    }

    stopWatch.stop();
    context.addMessage(
        INFO,
        String.format(
            "Finished parsing %s lines in %.3f seconds",
            config.lines(), stopWatch.getTotalTimeMillis() / 1000.0));
    return (output + "\n\n" + renderMessages(context)).replaceAll("\\n{3,}", "\n\n");
  }

  private PositionalXMLReader getReader(final ConversionContext context) {
    return beanFactory.getBean(PositionalXMLReader.class, context);
  }

  private ConversionContext getConversionContext(final ConversionInit config) {
    return beanFactory.getBean(ConversionContext.class, config);
  }

  private String renderMessages(final ConversionContext context) {
    return context.getMessages().stream()
        .map(Message::render)
        .map(line -> "// " + line)
        .collect(Collectors.joining("\n"));
  }

  private List<String> convertElements(final List<Tag> tags) {
    return tags.stream().map(Tag::convert).flatMap(List::stream).toList();
  }
}
