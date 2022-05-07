package co.uk.stefanpuia.minilang2java.core.field;

import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FieldAccessorTest {
  @Mock private Tag tag;

  @Test
  void shouldMakeGetter() {
    then(ImmutableFieldAccessor.of(tag, "someField"))
        .extracting(FieldAccessor::makeGetter)
        .isEqualTo("someField");
  }

  @Test
  void shouldMakeSetterWhenDeclared() {
    doReturn(Optional.of(new ContextVariable("someField", 1, null)))
        .when(tag)
        .getVariable("someField");
    then(ImmutableFieldAccessor.of(tag, "someField"))
        .extracting(accessor -> accessor.makeSetter("someVariable"))
        .isEqualTo(List.of("someField = someVariable;"));
  }

  @Test
  void shouldMakeDeclarationAndSetterWhenNotDeclared() {
    then(ImmutableFieldAccessor.of(tag, "someField"))
        .extracting(accessor -> accessor.makeSetter("someVariable"))
        .isEqualTo(List.of("final Object someField = someVariable;"));
  }
}
