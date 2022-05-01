package co.uk.stefanpuia.minilang2java.core.xml.impl;

import java.util.Map;
import org.w3c.dom.Attr;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.TypeInfo;
import org.w3c.dom.UserDataHandler;

@SuppressWarnings("PMD")
public abstract class AbstractElement implements Element {

  @Override
  public String getAttribute(final String name) {
    return "";
  }

  @Override
  public void setAttribute(final String name, final String value) throws DOMException {}

  @Override
  public void removeAttribute(final String name) throws DOMException {}

  @Override
  public Attr getAttributeNode(final String name) {
    return null;
  }

  @Override
  public Attr setAttributeNode(final Attr newAttr) throws DOMException {
    return null;
  }

  @Override
  public Attr removeAttributeNode(final Attr oldAttr) throws DOMException {
    return null;
  }

  @Override
  public NodeList getElementsByTagName(final String name) {
    return getEmptyNodeList();
  }

  private NodeList getEmptyNodeList() {
    return new EmptyNodeList();
  }

  @Override
  public String getAttributeNS(final String namespaceURI, final String localName)
      throws DOMException {
    return "";
  }

  @Override
  public void setAttributeNS(
      final String namespaceURI, final String qualifiedName, final String value)
      throws DOMException {}

  @Override
  public void removeAttributeNS(final String namespaceURI, final String localName)
      throws DOMException {}

  @Override
  public Attr getAttributeNodeNS(final String namespaceURI, final String localName)
      throws DOMException {
    return null;
  }

  @Override
  public Attr setAttributeNodeNS(final Attr newAttr) throws DOMException {
    return null;
  }

  @Override
  public NodeList getElementsByTagNameNS(final String namespaceURI, final String localName)
      throws DOMException {
    return getEmptyNodeList();
  }

  @Override
  public boolean hasAttribute(final String name) {
    return false;
  }

  @Override
  public boolean hasAttributeNS(final String namespaceURI, final String localName)
      throws DOMException {
    return false;
  }

  @Override
  public TypeInfo getSchemaTypeInfo() {
    return null;
  }

  @Override
  public void setIdAttribute(final String name, final boolean isId) throws DOMException {}

  @Override
  public void setIdAttributeNS(
      final String namespaceURI, final String localName, final boolean isId) throws DOMException {}

  @Override
  public void setIdAttributeNode(final Attr idAttr, final boolean isId) throws DOMException {}

  @Override
  public String getNodeName() {
    return null;
  }

  @Override
  public String getNodeValue() throws DOMException {
    return null;
  }

  @Override
  public void setNodeValue(final String nodeValue) throws DOMException {}

  @Override
  public short getNodeType() {
    return 0;
  }

  @Override
  public Node getParentNode() {
    return null;
  }

  @Override
  public NodeList getChildNodes() {
    return null;
  }

  @Override
  public Node getFirstChild() {
    return null;
  }

  @Override
  public Node getLastChild() {
    return null;
  }

  @Override
  public Node getPreviousSibling() {
    return null;
  }

  @Override
  public Node getNextSibling() {
    return null;
  }

  @Override
  public NamedNodeMap getAttributes() {
    return null;
  }

  @Override
  public Document getOwnerDocument() {
    return null;
  }

  @Override
  public Node insertBefore(final Node newChild, final Node refChild) throws DOMException {
    return null;
  }

  @Override
  public Node replaceChild(final Node newChild, final Node oldChild) throws DOMException {
    return null;
  }

  @Override
  public Node removeChild(final Node oldChild) throws DOMException {
    return null;
  }

  @Override
  public Node appendChild(final Node newChild) throws DOMException {
    return null;
  }

  @Override
  public boolean hasChildNodes() {
    return false;
  }

  @Override
  public Node cloneNode(final boolean deep) {
    return null;
  }

  @Override
  public void normalize() {}

  @Override
  public boolean isSupported(final String feature, final String version) {
    return false;
  }

  @Override
  public String getNamespaceURI() {
    return null;
  }

  @Override
  public String getPrefix() {
    return null;
  }

  @Override
  public void setPrefix(final String prefix) throws DOMException {}

  @Override
  public String getLocalName() {
    return null;
  }

  @Override
  public boolean hasAttributes() {
    return false;
  }

  @Override
  public String getBaseURI() {
    return null;
  }

  @Override
  public short compareDocumentPosition(final Node other) throws DOMException {
    return 0;
  }

  @Override
  public String getTextContent() throws DOMException {
    return null;
  }

  @Override
  public void setTextContent(final String textContent) throws DOMException {}

  @Override
  public boolean isSameNode(final Node other) {
    return false;
  }

  @Override
  public String lookupPrefix(final String namespaceURI) {
    return null;
  }

  @Override
  public boolean isDefaultNamespace(final String namespaceURI) {
    return false;
  }

  @Override
  public String lookupNamespaceURI(final String prefix) {
    return null;
  }

  @Override
  public boolean isEqualNode(final Node arg) {
    return false;
  }

  @Override
  public Object getFeature(final String feature, final String version) {
    return null;
  }

  @Override
  public Object setUserData(final String key, final Object data, final UserDataHandler handler) {
    return null;
  }

  @Override
  public Object getUserData(final String key) {
    return getUserData().get(key);
  }

  protected Map<String, Object> getUserData() {
    return Map.of();
  }

  protected static class EmptyNodeList implements NodeList {
    @Override
    public Node item(final int index) {
      return null;
    }

    @Override
    public int getLength() {
      return 0;
    }
  }
}
