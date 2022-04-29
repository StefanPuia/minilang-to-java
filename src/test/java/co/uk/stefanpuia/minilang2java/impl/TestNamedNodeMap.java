package co.uk.stefanpuia.minilang2java.impl;

import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.w3c.dom.DOMException;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

public class TestNamedNodeMap implements NamedNodeMap {

  private final List<Entry<String, Node>> entries;

  public TestNamedNodeMap(final Collection<Entry<String, Node>> entries) {
    this.entries = new ArrayList<>(entries);
  }

  public static TestNamedNodeMap of(final Map<String, String> map) {
    return new TestNamedNodeMap(map.entrySet().stream().map(TestNamedNodeMap::getEntry).toList());
  }

  private static Entry<String, Node> getEntry(final Entry<String, String> entry) {
    return new SimpleEntry<>(entry.getKey(), new TestNode(entry.getKey(), entry.getValue(), null));
  }

  @Override
  public Node getNamedItem(final String name) {
    return entries.stream()
        .filter(entry -> name.equals(entry.getKey()))
        .findFirst()
        .map(Entry::getValue)
        .orElse(null);
  }

  @Override
  public Node setNamedItem(final Node arg) throws DOMException {
    throw new IllegalStateException("Method not implemented");
  }

  @Override
  public Node removeNamedItem(final String name) throws DOMException {
    throw new IllegalStateException("Method not implemented");
  }

  @Override
  public Node item(final int index) {
    return entries.get(index).getValue();
  }

  @Override
  public int getLength() {
    return entries.size();
  }

  @Override
  public Node getNamedItemNS(final String namespaceURI, final String localName)
      throws DOMException {
    throw new IllegalStateException("Method not implemented");
  }

  @Override
  public Node setNamedItemNS(final Node arg) throws DOMException {
    throw new IllegalStateException("Method not implemented");
  }

  @Override
  public Node removeNamedItemNS(final String namespaceURI, final String localName)
      throws DOMException {
    throw new IllegalStateException("Method not implemented");
  }
}
