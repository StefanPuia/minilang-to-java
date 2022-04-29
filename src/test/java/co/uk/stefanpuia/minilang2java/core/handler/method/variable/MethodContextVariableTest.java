package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MethodContextVariableTest {
  private final VariableType varType = VariableType.from("SomeClass");
  private final ConversionContext context = conversionContext();
  @Mock private SimpleMethod method;
  private MethodContextVariable contextVariable;

  @BeforeEach
  void beforeEach() {
    contextVariable = new MethodContextVariableImpl(context, method);
  }

  @Test
  void shouldNotConvertIfUsed() {
    final String converted = contextVariable.convertIfUsed();
    then(converted).isEqualTo("");
    then(context.getImports()).isEmpty();
  }

  @Test
  void shouldConvertIfUsed() {
    doReturn(Optional.of(new ContextVariable("", 1, null))).when(method).getVariable(anyString());
    final String converted = contextVariable.convertIfUsed();
    then(converted).isEqualTo("converted text");
    then(context.getImports()).containsExactly("SomeClass");
  }

  @Test
  void shouldConvert() {
    final String converted = contextVariable.convert();
    then(converted).isEqualTo("converted text");
    then(context.getImports()).containsExactly("SomeClass");
  }

  @Test
  void shouldGetBaseType() {
    final var baseType = contextVariable.getBaseType();
    then(baseType).isEqualTo("SomeClass");
  }

  @Test
  void shouldBuildAsUnused() {
    final var unused = contextVariable.asUnused();
    then(unused).isEqualTo(new ContextVariable("testVar", 0, varType));
  }

  class MethodContextVariableImpl extends MethodContextVariable {

    public MethodContextVariableImpl(final ConversionContext context, final SimpleMethod method) {
      super(context, method);
    }

    @Override
    public String getName() {
      return "testVar";
    }

    @Override
    protected String getConverted() {
      return "converted text";
    }

    @Override
    public VariableType getType() {
      return varType;
    }
  }
}
