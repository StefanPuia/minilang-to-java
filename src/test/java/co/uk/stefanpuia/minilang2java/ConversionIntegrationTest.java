package co.uk.stefanpuia.minilang2java;

import static java.util.function.Predicate.not;
import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.InstanceOfAssertFactories.type;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import co.uk.stefanpuia.minilang2java.controller.dto.ConvertRequestDto;
import co.uk.stefanpuia.minilang2java.controller.dto.ConvertResponseDto;
import co.uk.stefanpuia.minilang2java.controller.dto.ImmutableConversionRequestOptions;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.internal.util.io.IOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;

@TestInstance(Lifecycle.PER_CLASS)
@SpringBootTest(
    classes = {Application.class},
    webEnvironment = WebEnvironment.RANDOM_PORT)
public class ConversionIntegrationTest {
  @Autowired protected TestRestTemplate template;
  @Autowired private ResourceLoader resourceLoader;

  public Stream<Arguments> supplyFiles() throws IOException {
    return Stream.of(loadXmlFiles())
        .map(
            xml -> {
              try {
                final var name =
                    xml.getFile()
                        .getPath()
                        .replaceAll(".*convert[\\\\/]xml[\\\\/](.+)\\.xml", "$1");
                return Arguments.of(
                    name,
                    xml,
                    resourceLoader.getResource("classpath:convert/java/" + name + ".java"));
              } catch (IOException e) {
                throw new RuntimeException(e);
              }
            });
  }

  Resource[] loadXmlFiles() throws IOException {
    return ResourcePatternUtils.getResourcePatternResolver(resourceLoader)
        .getResources("classpath:convert/xml/**/**.xml");
  }

  @ParameterizedTest(name = "convert {0}")
  @MethodSource("supplyFiles")
  void shouldHaveCorrectOutput(final String fileName, final Resource xml, final Resource java)
      throws IOException, URISyntaxException {

    // Given
    final var xmlContent = normalizeContent(xml.getInputStream());
    final var javaContent = normalizeContent(java.getInputStream());
    final var request =
        new ConvertRequestDto(
            xmlContent,
            getMode(fileName),
            "com.test.Test",
            ImmutableConversionRequestOptions.builder()
                .setLoggingTiming(false)
                .setConverterReplicateMinilang(!isOptimised(fileName))
                .build());

    // When
    final var response =
        template.exchange(
            RequestEntity.post(new URI("/convert")).contentType(APPLICATION_JSON).body(request),
            ConvertResponseDto.class);

    // Then
    then(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    then(response.getBody())
        .extracting(ConvertResponseDto::output)
        .asInstanceOf(type(String.class))
        .extracting(this::normalizeContent)
        .isEqualTo(javaContent);
  }

  private String normalizeContent(final InputStream inputStream) {
    return normalizeContent(IOUtil.readLines(inputStream).stream());
  }

  private String normalizeContent(final String content) {
    return normalizeContent(content.lines());
  }

  private String normalizeContent(final Stream<String> lines) {
    return lines.filter(not(String::isBlank)).map(String::strip).collect(Collectors.joining("\n"));
  }

  private MethodMode getMode(final String fileName) {
    final var matcher = Pattern.compile("_(?<mode>[A-Z]+)$").matcher(fileName);
    if (matcher.find()) {
      return MethodMode.valueOf(matcher.group("mode"));
    }
    return MethodMode.UTIL;
  }

  private boolean isOptimised(final String fileName) {
    return Pattern.compile("\\.optimised$").matcher(fileName).find();
  }
}
