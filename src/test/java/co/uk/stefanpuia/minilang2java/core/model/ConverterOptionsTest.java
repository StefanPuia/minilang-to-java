package co.uk.stefanpuia.minilang2java.core.model;

import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Test;

class ConverterOptionsTest {
  @Test
  void shouldGetIndentationSize() {
    final var options = ImmutableConverterOptions.builder().setTabSize(5).build();
    then(options.getIndentationSize()).isEqualTo(5);
  }

  @Test
  void shouldGetAtLeastTwoIndentationSize() {
    final var options = ImmutableConverterOptions.builder().setTabSize(1).build();
    then(options.getIndentationSize()).isEqualTo(2);
  }
}
