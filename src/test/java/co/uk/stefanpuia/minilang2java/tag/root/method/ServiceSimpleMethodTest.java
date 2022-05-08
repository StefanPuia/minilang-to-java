package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Test;

public class ServiceSimpleMethodTest extends AbstractSimpleMethodTest {
  @Test
  void shouldSetParameters() {
    final var method = new ServiceSimpleMethod(tagInit(context, element));
    then(method.convert())
        .anyMatch(
            str ->
                str.contains(
                    "public Map<String, Object> someTestMethod("
                        + "final DispatchContext dctx, "
                        + "final Map<String, Object> parameters) {"));
  }

  @Test
  void shouldAddContext() {
    final var method = new ServiceSimpleMethod(tagInit(context, element));
    method.setVariable("delegator");
    then(method.convert())
        .anyMatch(str -> str.contains("final Delegator delegator = dctx.getDelegator();"));
  }

  @Test
  void shouldAddContextWhenVariablePassedUpwards() {
    final var method = accessDelegatorInInnerTag(ServiceSimpleMethod::new);
    then(method.convert())
        .anyMatch(str -> str.contains("final Delegator delegator = dctx.getDelegator();"));
  }
}
