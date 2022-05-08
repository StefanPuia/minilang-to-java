package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventSimpleMethodTest extends AbstractSimpleMethodTest {
  @Test
  void shouldSetParameters() {
    final var method = new EventSimpleMethod(tagInit(context, element));
    then(method.convert())
        .anyMatch(
            str ->
                str.contains(
                    "public String someTestMethod("
                        + "final HttpServletRequest request, "
                        + "final HttpServletResponse response) {"));
  }

  @Test
  void shouldAddContext() {
    final var method = new EventSimpleMethod(tagInit(context, element));
    method.setVariable("delegator");
    then(method.convert())
        .anyMatch(
            str ->
                str.contains(
                    "final Delegator delegator = (Delegator) "
                        + "request.getAttribute(\"delegator\");"));
  }

  @Test
  void shouldAddContextWhenVariablePassedUpwards() {
    final var method = accessDelegatorInInnerTag(EventSimpleMethod::new);
    then(method.convert())
        .anyMatch(
            str ->
                str.contains(
                    "final Delegator delegator = (Delegator) "
                        + "request.getAttribute(\"delegator\");"));
  }
}
