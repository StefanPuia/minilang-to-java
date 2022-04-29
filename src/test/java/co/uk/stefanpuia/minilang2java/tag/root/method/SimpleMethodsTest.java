package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.TestObjects.tagInit;
import static org.assertj.core.api.BDDAssertions.then;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.impl.TagTestImpl;
import java.util.List;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;

class SimpleMethodsTest {
  @Test
  void shouldConvertChildrenWhenConvert() {
    final String converted = RandomString.make();
    final TagInit tagInit = tagInit();
    final var methods = new SimpleMethods(tagInit);
    methods.appendChild(
        new TagTestImpl(tagInit(tagInit.conversionContext(), methods), List.of(converted)));
    then(methods.convert()).containsExactly(converted);
  }
}
