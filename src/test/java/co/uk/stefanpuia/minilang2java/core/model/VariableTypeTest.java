package co.uk.stefanpuia.minilang2java.core.model;

import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.InstanceOfAssertFactories.list;

import co.uk.stefanpuia.minilang2java.core.qualify.QualifiedClass;
import org.junit.jupiter.api.Test;

class VariableTypeTest {
  @Test
  void shouldExtractForSimpleType() {
    // When
    final var type = VariableType.from("SomeType");

    // Then
    then(type).isNotNull();
    then(type).extracting(VariableType::getType).isEqualTo(QualifiedClass.from("SomeType"));
    then(type)
        .extracting(VariableType::getParameters)
        .asInstanceOf(list(VariableType.class))
        .isEmpty();
  }

  @Test
  void shouldExtractForParameterisedType() {
    // When
    final var type = VariableType.from("SomeType<String>");

    // Then
    then(type).isNotNull();
    then(type).extracting(VariableType::getType).isEqualTo(QualifiedClass.from("SomeType"));
    then(type)
        .extracting(VariableType::getParameters)
        .asInstanceOf(list(VariableType.class))
        .containsExactly(VariableType.from("String"));
  }

  @Test
  void shouldExtractForMultipleParameterisedType() {
    // When
    final var type = VariableType.from("SomeType<String, Object>");

    // Then
    then(type).isNotNull();
    then(type).extracting(VariableType::getType).isEqualTo(QualifiedClass.from("SomeType"));
    then(type)
        .extracting(VariableType::getParameters)
        .asInstanceOf(list(VariableType.class))
        .hasSize(2)
        .containsExactly(VariableType.from("String"), VariableType.from("Object"));
  }

  @Test
  void shouldExtractForQualifiedSimpleType() {
    // When
    final var type = VariableType.from("com.test.SomeType");

    // Then
    then(type).isNotNull();
    then(type)
        .extracting(VariableType::getType)
        .isEqualTo(QualifiedClass.from("com.test.SomeType"));
    then(type)
        .extracting(VariableType::getParameters)
        .asInstanceOf(list(VariableType.class))
        .isEmpty();
  }

  @Test
  void shouldExtractForQualifiedParameterisedType() {
    // When
    final var type = VariableType.from("com.test.SomeType<java.lang.String, java.util.SubType>");

    // Then
    then(type).isNotNull();
    then(type)
        .extracting(VariableType::getType)
        .isEqualTo(QualifiedClass.from("com.test.SomeType"));
    then(type)
        .extracting(VariableType::getParameters)
        .asInstanceOf(list(VariableType.class))
        .hasSize(2)
        .containsExactly(
            VariableType.from("java.lang.String"), VariableType.from("java.util.SubType"));
  }

  @Test
  void shouldReturnEmptyClass() {
    // When
    final var type = VariableType.from("");

    // Then
    then(type).isNotNull();
    then(type).extracting(VariableType::getType).isEqualTo(QualifiedClass.from(""));
  }

  @Test
  void shouldReturnEmptyParameters() {
    // When
    final var type = VariableType.from("SomeClass<>");

    // Then
    then(type).isNotNull();
    then(type).extracting(VariableType::getType).isEqualTo(QualifiedClass.from("SomeClass"));
    then(type)
        .extracting(VariableType::getParameters)
        .asInstanceOf(list(VariableType.class))
        .isEmpty();
  }
}
