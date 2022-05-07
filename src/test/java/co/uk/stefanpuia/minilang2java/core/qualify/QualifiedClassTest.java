package co.uk.stefanpuia.minilang2java.core.qualify;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Optional;
import org.junit.jupiter.api.Test;

class QualifiedClassTest {
  @Test
  void shouldExtractForUnqualifiedClass() {
    // When
    final var qualified = QualifiedClass.from("SomeClass");

    // Then
    then(qualified).isNotNull();
    then(qualified).extracting(QualifiedClass::getClassName).isEqualTo(Optional.of("SomeClass"));
    then(qualified).extracting(QualifiedClass::getPackageName).isEqualTo(Optional.empty());
  }

  @Test
  void shouldExtractForEmptyClass() {
    // When
    final var qualified = QualifiedClass.from("");

    // Then
    then(qualified).isNotNull();
    then(qualified).extracting(QualifiedClass::getClassName).isEqualTo(Optional.empty());
    then(qualified).extracting(QualifiedClass::getPackageName).isEqualTo(Optional.empty());
  }

  @Test
  void shouldExtractForQualifiedClass() {
    // When
    final var qualified = QualifiedClass.from("com.test.SomeClass");

    // Then
    then(qualified).isNotNull();
    then(qualified).extracting(QualifiedClass::getClassName).isEqualTo(Optional.of("SomeClass"));
    then(qualified).extracting(QualifiedClass::getPackageName).isEqualTo(Optional.of("com.test"));
  }

  @Test
  void shouldQualifyJustClass() {
    // When
    final var qualified = ImmutableQualifiedClass.of("", "SomeClass");

    // Then
    then(qualified).isNotNull().extracting(QualifiedClass::qualify).isEqualTo("SomeClass");
  }

  @Test
  void shouldQualifyClassWithPackage() {
    // When
    final var qualified = ImmutableQualifiedClass.of("com.test", "SomeClass");

    // Then
    then(qualified).isNotNull().extracting(QualifiedClass::qualify).isEqualTo("com.test.SomeClass");
  }

  @Test
  void shouldQualifyClassWithPackageForDefinedQualifications() {
    // When
    final var qualified = QualifiedClass.from("Map");

    // Then
    then(qualified).isNotNull().extracting(QualifiedClass::qualify).isEqualTo("java.util.Map");
  }

  @Test
  void shouldNotRequireImportIfDefault() {
    then(QualifiedClass.from("java.lang.Object").isRequiresImport("")).isFalse();
  }

  @Test
  void shouldNotRequireImportIfSamePackage() {
    then(QualifiedClass.from("com.test.SomeClass").isRequiresImport("com.test")).isFalse();
  }

  @Test
  void shouldRequireImport() {
    then(QualifiedClass.from("com.test.SomeClass").isRequiresImport("com.other.test")).isTrue();
  }
}
