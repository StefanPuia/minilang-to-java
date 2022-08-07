package co.uk.stefanpuia.minilang2java.controller;

import co.uk.stefanpuia.minilang2java.controller.dto.TagDto;
import co.uk.stefanpuia.minilang2java.controller.dto.TagsDto;
import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagFactory.HandledTag;
import co.uk.stefanpuia.minilang2java.core.convert.reader.PositionalParserHandler;
import co.uk.stefanpuia.minilang2java.core.convert.reader.SimpleMethodsXmlReader;
import co.uk.stefanpuia.minilang2java.core.model.SimpleMethodsElement;
import co.uk.stefanpuia.minilang2java.core.model.exception.SimpleMethodsElementsReadException;
import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.xml.sax.XMLReader;

@Controller
@AllArgsConstructor
public class MvcController {
  private final TagFactory tagFactory;
  private final SimpleMethodsXmlReader methodsXmlReader;

  private final PositionalParserHandler handler;
  private final XMLReader xmlReader;

  @GetMapping("/")
  public String getIndex() {
    return "index";
  }

  @GetMapping("/tags")
  public String getUnhandled(final Model model) throws SimpleMethodsElementsReadException {
    final Collection<HandledTag> handledTags = tagFactory.getHandledTags();
    final List<SimpleMethodsElement> elements = methodsXmlReader.getElements(handler, xmlReader);

    model.addAttribute(
        "tagsDto",
        new TagsDto(
            elements.stream()
                .map(
                    element ->
                        handledTags.stream()
                            .filter(tag -> element.name().equals(tag.tagName()))
                            .findFirst()
                            .map(
                                tag ->
                                    new TagDto(
                                        true,
                                        tag.tagName(),
                                        element.description(),
                                        tag.optimised()))
                            .orElse(
                                new TagDto(false, element.name(), element.description(), false)))
                .toList()));
    return "tags";
  }
}
