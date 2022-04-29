package co.uk.stefanpuia.minilang2java.impl;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.UserDataHandler;

public class TestNode implements Node {

  private final String name;
  private final String value;
  private final NamedNodeMap attributes;

  public TestNode(final String name, final String value, final NamedNodeMap attributes) {
    this.name = name;
    this.value = value;
    this.attributes = attributes;
  }

  @Override
  public String getNodeName() {
    return name;
  }

  @Override
  public String getNodeValue() throws DOMException {
    return value;
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
    return attributes;
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
    return null;
  }
}
