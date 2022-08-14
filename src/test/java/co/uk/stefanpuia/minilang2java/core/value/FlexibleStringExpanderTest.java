package co.uk.stefanpuia.minilang2java.core.value;

import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FlexibleStringExpanderTest {
  @Mock private Tag tag;

  @Test
  void shouldConvertEmptyValue() {
    then(new FlexibleStringExpander(tag, "").toString()).isEqualTo("null");
  }

  @Test
  void shouldConvertNonEmptyValue() {
    then(new FlexibleStringExpander(tag, "someValue").toString()).isEqualTo("someValue");
  }

  @Test
  void shouldConvertNumbers() {
    then(new FlexibleStringExpander(tag, "123").toString()).isEqualTo("123");
  }

  @Test
  void shouldConvertFloatingNumbers() {
    then(new FlexibleStringExpander(tag, "123.23").toString()).isEqualTo("123.23");
  }

  @Test
  void shouldConvertVariable() {
    doReturn(Optional.of(new ContextVariable("someVar", 1, null))).when(tag).getVariable("someVar");
    then(new FlexibleStringExpander(tag, "someVar").toString()).isEqualTo("someVar");
  }

  @Test
  void shouldConvertMapVariable() {
    doReturn(Optional.of(new ContextVariable("someMap", 1, null))).when(tag).getVariable("someMap");
    then(new FlexibleStringExpander(tag, "someMap.someProp").toString())
        .isEqualTo("someMap.get(\"someProp\")");
  }

  @Test
  void shouldConvertScript() {
    then(new FlexibleStringExpander(tag, "${groovy: getSomeStuff()}").toString())
        .isEqualTo("${groovy: getSomeStuff()}");
  }
}
