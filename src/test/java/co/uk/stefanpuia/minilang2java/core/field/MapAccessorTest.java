package co.uk.stefanpuia.minilang2java.core.field;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;
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
class MapAccessorTest {
  @Mock private Tag tag;

  @Test
  void shouldGetField() {
    then(ImmutableMapAccessor.of(tag, "someMap.someProperty"))
        .extracting(MapAccessor::getField)
        .isEqualTo("someMap");
  }

  @Test
  void shouldMakeGetter() {
    then(ImmutableMapAccessor.of(tag, "someMap.someProperty"))
        .extracting(MapAccessor::makeGetter)
        .isEqualTo("someMap.get(\"someProperty\")");
  }

  @Test
  void shouldMakeGetterWithEmptyProperty() {
    then(ImmutableMapAccessor.of(tag, "someMap."))
        .extracting(MapAccessor::makeGetter)
        .isEqualTo("someMap.get(\"\")");
  }

  @Test
  void shouldMakeSetterWhenDeclared() {
    doReturn(conversionContext()).when(tag).getContext();
    doReturn(Optional.of(new ContextVariable("someMap", 1, null))).when(tag).getVariable("someMap");
    then(ImmutableMapAccessor.of(tag, "someMap.someProperty"))
        .extracting(mapAccessor -> mapAccessor.makeSetter("someVariable"))
        .isEqualTo(List.of("someMap.put(\"someProperty\", someVariable);"));
  }

  @Test
  void shouldMakeDeclarationAndSetterWhenNotDeclared() {
    doReturn(conversionContext()).when(tag).getContext();
    then(ImmutableMapAccessor.of(tag, "someMap.someProperty"))
        .extracting(mapAccessor -> mapAccessor.makeSetter("someVariable"))
        .isEqualTo(
            List.of(
                "final Map<String, Object> someMap = new HashMap<>();",
                "someMap.put(\"someProperty\", someVariable);"));
  }

  @Test
  void shouldMakeSplitDeclarationAndSetterWhenNotDeclared() {
    doReturn(conversionContext()).when(tag).getContext();
    then(ImmutableMapAccessor.of(tag, "someMap.someProperty"))
        .extracting(mapAccessor -> mapAccessor.makeSplitSetter(DEFAULT_MAP_TYPE, "someVariable"))
        .isEqualTo(
            List.of(
                "final Map<String, Object> someMap = new HashMap<>();",
                "someMap.put(\"someProperty\", someVariable);"));
  }
}
