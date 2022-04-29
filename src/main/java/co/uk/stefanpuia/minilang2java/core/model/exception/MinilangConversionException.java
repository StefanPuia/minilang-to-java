package co.uk.stefanpuia.minilang2java.core.model.exception;

public class MinilangConversionException extends Exception {

  public MinilangConversionException(final Throwable cause) {
    super(cause);
  }

  public MinilangConversionException(final String message) {
    super(message);
  }
}
