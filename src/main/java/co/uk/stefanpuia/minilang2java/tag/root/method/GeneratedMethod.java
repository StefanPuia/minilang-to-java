package co.uk.stefanpuia.minilang2java.tag.root.method;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import net.bytebuddy.utility.RandomString;
import org.w3c.dom.Document;

public class GeneratedMethod {

  private final String methodName;

  public GeneratedMethod() {
    methodName = "generatedMethod_" + RandomString.make();
  }

  public static SimpleMethod createTag(
      final ConversionContext conversionContext, final Tag parent, final Document document) {
    final var generatedMethod = new GeneratedMethod();
    final var tagInit =
        new TagInit(
            conversionContext,
            new SimpleMethodElement(document, generatedMethod.getMethodName()),
            parent);
    return switch (conversionContext.getMethodMode()) {
      case UTIL -> new UtilSimpleMethod(tagInit);
      case EVENT -> new EventSimpleMethod(tagInit);
      case SERVICE -> new ServiceSimpleMethod(tagInit);
      default -> throw new TagInstantiationException("Wrong method mode");
    };
  }

  public String getMethodName() {
    return methodName;
  }
}
