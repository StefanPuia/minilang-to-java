package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod.SIMPLE_METHOD;

import com.sun.org.apache.xerces.internal.dom.CoreDocumentImpl;
import com.sun.org.apache.xerces.internal.dom.ElementImpl;
import org.w3c.dom.Document;

public class SimpleMethodElement extends ElementImpl {

  public SimpleMethodElement(final Document ownerDoc) {
    super((CoreDocumentImpl) ownerDoc, SIMPLE_METHOD);
    ((CoreDocumentImpl) ownerDoc).setUserData(this, "lineNumber", -1, null);
  }

  @Override
  public String getTagName() {
    return SIMPLE_METHOD;
  }
}
