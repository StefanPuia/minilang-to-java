package co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;

import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import org.assertj.core.api.BDDAssertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UtilUserLoginTest {
  @Mock private SimpleMethod method;

  @Test
  void shouldConvert() {
    final UtilUserLogin userLogin = new UtilUserLogin(conversionContext(), method);
    BDDAssertions.then(userLogin.getConverted()).isEqualTo("final GenericValue userLogin");
  }
}
