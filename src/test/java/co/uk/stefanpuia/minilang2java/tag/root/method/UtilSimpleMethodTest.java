package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UtilSimpleMethodTest extends AbstractSimpleMethodTest {
  @Test
  void shouldSetParameters() {
    final var method = new UtilSimpleMethod(tagInit(context, element));
    then(method.convert()).anyMatch(str -> str.equals("public void someTestMethod() {"));
  }

  @Test
  void shouldAddContext() {
    final var method = new UtilSimpleMethod(tagInit(context, element));
    method.setVariable("delegator");
    then(method.convert())
        .anyMatch(str -> str.equals("public void someTestMethod(final Delegator delegator) {"));
  }

  @Test
  void shouldAddContextWhenVariablePassedUpwards() {
    final var method = accessDelegatorInInnerTag(UtilSimpleMethod::new);
    then(method.convert())
        .anyMatch(str -> str.equals("public void someTestMethod(final Delegator delegator) {"));
  }
}
