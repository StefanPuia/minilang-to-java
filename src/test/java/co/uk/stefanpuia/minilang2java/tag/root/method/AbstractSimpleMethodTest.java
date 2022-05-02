package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyAttributeValueRule;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import co.uk.stefanpuia.minilang2java.impl.TagTestImpl;
import java.util.Map;
import java.util.function.Function;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Element;

public abstract class AbstractSimpleMethodTest {

  protected final Element element = new AttributeElement(Map.of("method-name", "someTestMethod"));
  protected final ConversionContext context = conversionContext();

  @Test
  void shouldHaveRules() {
    final var method = new EventSimpleMethod(tagInit(context, element));
    then(method.getRules().getRules())
        .containsExactly(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("method-name")
                .addOptional("short-description")
                .build(),
            new NonEmptyAttributeValueRule("method-name", VALIDATION_WARNING));
  }

  SimpleMethod accessDelegatorInInnerTag(final Function<TagInit, SimpleMethod> instanceMethod) {
    final TagInit methodInit = tagInit(context, element);
    final var method = instanceMethod.apply(methodInit);
    final var innerTag = new TagTestImpl(tagInit(methodInit.conversionContext(), method));
    method.appendChild(innerTag);
    innerTag.setVariable("delegator");
    return method;
  }
}
