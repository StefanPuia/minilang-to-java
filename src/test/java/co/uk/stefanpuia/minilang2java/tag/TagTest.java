package co.uk.stefanpuia.minilang2java.tag;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static net.bytebuddy.utility.RandomString.make;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.impl.TagTestImpl;
import co.uk.stefanpuia.minilang2java.impl.TagTestImpl.TagWithContextTestImpl;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Element;

@ExtendWith(MockitoExtension.class)
class TagTest {
  @Mock private ConversionContext context;
  @Mock private Element element;

  @Test
  void shouldConvertChildren() {
    final var converted = make();
    final var tag = new TagTestImpl(tagInit(context, element));
    tag.appendChild(new TagTestImpl(tagInit(context, element), List.of(converted)));
    then(tag.convertChildren()).containsExactly(converted);
  }

  @Test
  void shouldPrependIndentation() {
    final var prepend = make();
    final var line = make();
    doReturn(prepend).when(context).getBaseIndentation();
    final var tag = new TagTestImpl(tagInit(context, element));
    then(tag.prependIndentation(line)).isEqualTo(prepend + line);
  }

  @Test
  void shouldGetPosition() {
    doReturn(5).when(element).getUserData("lineNumber");
    final var tag = new TagTestImpl(tagInit(context, element));
    then(tag.getPosition()).extracting(Position::line).isNotNull().isEqualTo(5);
  }

  @Test
  void shouldNotGetVariableWhenNoParent() {
    final var tag = new TagTestImpl(tagInit(context, element));
    then(tag.getVariable("abc")).isEqualTo(Optional.empty());
  }

  @Test
  void shouldSetVariableToOwnContext() {
    final var tag = new TagWithContextTestImpl(tagInit(context, element));
    tag.setVariable("someVar");
    then(tag.getVariable("someVar"))
        .isEqualTo(Optional.of(new ContextVariable("someVar", 1, VariableType.DEFAULT_TYPE)));
  }

  @Test
  void shouldSetVariableWithTypeToOwnContext() {
    final var tag = new TagWithContextTestImpl(tagInit(context, element));
    final VariableType someClass = VariableType.from("SomeClass");
    tag.setVariable(new ContextVariable("someVar", 1, someClass));
    then(tag.getVariable("someVar"))
        .isEqualTo(Optional.of(new ContextVariable("someVar", 1, someClass)));
  }

  @Test
  void shouldNotGetVariableToParentContextWhenNotExists() {
    final var parent = new TagWithContextTestImpl(tagInit(context, element));
    parent.setVariable("someVar");
    final var tag = new TagTestImpl(tagInit(parent));
    then(tag.getVariable("abc")).isEqualTo(Optional.empty());
  }

  @Test
  void shouldGetVariableToParentContext() {
    final var parent = new TagWithContextTestImpl(tagInit(context, element));
    parent.setVariable("someVar");
    final var tag = new TagTestImpl(tagInit(parent));
    then(tag.getVariable("someVar"))
        .isEqualTo(Optional.of(new ContextVariable("someVar", 1, VariableType.DEFAULT_TYPE)));
  }

  @Test
  void shouldGetVariableWithTypeToParentContext() {
    final var parent = new TagWithContextTestImpl(tagInit(context, element));
    final VariableType someClass = VariableType.from("SomeClass");
    parent.setVariable(new ContextVariable("someVar", 2, someClass));
    final var tag = new TagTestImpl(tagInit(parent));
    then(tag.getVariable("someVar"))
        .isEqualTo(Optional.of(new ContextVariable("someVar", 2, someClass)));
  }

  @Test
  void shouldAddCountToVariableWithTypeOfParentContext() {
    final var parent = new TagWithContextTestImpl(tagInit(context, element));
    final VariableType someClass = VariableType.from("SomeClass");
    parent.setVariable(new ContextVariable("someVar", 2, someClass));
    final var tag = new TagTestImpl(tagInit(parent));
    tag.setVariable("someVar");
    then(tag.getVariable("someVar"))
        .isEqualTo(Optional.of(new ContextVariable("someVar", 3, someClass)));
  }

  @Test
  void shouldHaveEmptyRules() {
    final var tag = new TagTestImpl(tagInit(context, element));
    then(tag.getRules()).isEmpty();
  }

  @Test
  void shouldGetElement() {
    final var tag = new TagTestImpl(tagInit(element));
    then(tag.getElement()).isSameAs(element);
  }
}
