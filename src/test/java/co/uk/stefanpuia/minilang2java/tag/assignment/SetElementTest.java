package co.uk.stefanpuia.minilang2java.tag.assignment;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.BDDAssertions.thenThrownBy;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagConversionException;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import co.uk.stefanpuia.minilang2java.impl.TagTestImpl.TagWithContextTestImpl;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Map;
import org.junit.jupiter.api.Test;

class SetElementTest {
  private ConversionContext context = conversionContext();
  private Tag parentWithContext = new TagWithContextTestImpl(tagInit(context));

  @Test
  void shouldThrowExceptionWhenNoField() {
    final var set =
        new SetElement(tagInit(context, new AttributeElement(Map.of()), parentWithContext));
    thenThrownBy(set::convert)
        .isInstanceOf(TagConversionException.class)
        .hasMessage("Field is empty");
  }

  @Test
  void shouldConvertWithNoValue() {
    final var set =
        new SetElement(
            tagInit(
                context, new AttributeElement(Map.of("field", "someField")), parentWithContext));
    then(set.convert()).containsExactly("final Object someField = null;");
  }

  @Test
  void shouldConvertWithFromField() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "from-field", "someOtherField")),
                parentWithContext));
    then(set.convert()).containsExactly("final Object someField = someOtherField;");
  }

  @Test
  void shouldConvertWithFrom() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "from", "someOtherField"))));
    then(set.convert()).containsExactly("final Object someField = someOtherField;");
  }

  @Test
  void shouldConvertWithValue() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "value", "someValue")),
                parentWithContext));
    then(set.convert()).containsExactly("final Object someField = \"someValue\";");
  }

  @Test
  void shouldConvertWithDefault() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "default", "someValue")),
                parentWithContext));
    then(set.convert())
        .containsExactly(
            "final Object someField = null;",
            "if (UtilValidate.isEmpty(someField)) {",
            "  someField = \"someValue\";",
            "}");
  }

  @Test
  void shouldConvertWithDefaultValue() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "default-value", "someValue")),
                parentWithContext));
    then(set.convert())
        .containsExactly(
            "final Object someField = null;",
            "if (UtilValidate.isEmpty(someField)) {",
            "  someField = \"someValue\";",
            "}");
  }

  @Test
  void shouldConvertWithDefaultAndFrom() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(
                    Map.of("field", "someField", "from", "someOtherField", "default", "someValue")),
                parentWithContext));
    then(set.convert())
        .containsExactly(
            "final Object someField = someOtherField;",
            "if (UtilValidate.isEmpty(someField)) {",
            "  someField = \"someValue\";",
            "}");
  }

  @Test
  void shouldConvertIfEmpty() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "set-if-empty", "true")),
                parentWithContext));
    then(set.convert())
        .containsExactly(
            "final Object someField;",
            "if (UtilValidate.isEmpty(someField)) {",
            "  someField = null;",
            "}");
  }

  @Test
  void shouldConvertIfNull() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(Map.of("field", "someField", "set-if-null", "true")),
                parentWithContext));
    then(set.convert())
        .containsExactly(
            "final Object someField;", "if (someField == null) {", "  someField = null;", "}");
  }

  @Test
  void shouldConvertIfNullOrEmpty() {
    final var set =
        new SetElement(
            tagInit(
                context,
                new AttributeElement(
                    Map.of("field", "someField", "set-if-empty", "true", "set-if-null", "true")),
                parentWithContext));
    then(set.convert())
        .containsExactly(
            "final Object someField;",
            "if (UtilValidate.isEmpty(someField) || someField == null) {",
            "  someField = null;",
            "}");
  }

  @Test
  void shouldHaveRules() {
    then(new SetElement(tagInit()).getRules().getRules()).isNotEmpty();
  }
}
