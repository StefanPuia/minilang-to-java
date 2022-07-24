package co.uk.stefanpuia.minilang2java.tag.callop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.misc.JavaCode;
import co.uk.stefanpuia.minilang2java.tag.root.XmlRoot;
import co.uk.stefanpuia.minilang2java.tag.root.method.GeneratedMethod;
import java.util.Arrays;
import java.util.List;

@MinilangTag("call-bsh")
public class CallBsh extends Tag {

  private String methodName;

  public CallBsh(final TagInit tagInit) {
    super(tagInit);
    addMethodToRoot();
  }

  @Override
  public List<String> convertSelf() {
    return List.of(String.format("%s();", methodName));
  }

  private void addMethodToRoot() {
    final var root = getParent(XmlRoot.class).orElseThrow();
    final var method = GeneratedMethod.createTag(context, root, getElement().getOwnerDocument());
    this.methodName = method.getMethodName();
    method.appendChild(new JavaCode(context, method, getCode()));
    root.appendChild(method);
  }

  private List<String> getCode() {
    return Arrays.asList(
        element.getTextContent().replaceAll("^(\\s*\\n)*", "").stripTrailing().split("\n"));
  }
}
