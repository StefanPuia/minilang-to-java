package co.uk.stefanpuia.minilang2java.controller;

import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.UTIL;
import static org.assertj.core.api.BDDAssertions.then;
import static org.assertj.core.api.InstanceOfAssertFactories.type;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import co.uk.stefanpuia.minilang2java.Application;
import co.uk.stefanpuia.minilang2java.controller.dto.ConvertRequestDto;
import co.uk.stefanpuia.minilang2java.controller.dto.ConvertResponseDto;
import co.uk.stefanpuia.minilang2java.controller.dto.ImmutableConversionRequestOptions;
import java.net.URI;
import java.net.URISyntaxException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;

@SpringBootTest(
    classes = {Application.class},
    webEnvironment = WebEnvironment.RANDOM_PORT)
public class ConvertControllerIntegrationTest {
  @Autowired protected TestRestTemplate template;

  @Test
  void shouldConvert() throws URISyntaxException {
    // Given
    final var request =
        new ConvertRequestDto(
            "", UTIL, "com.test.SomeClass", ImmutableConversionRequestOptions.builder().build());

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
        .matches(str -> str.contains("package com.test;"), "package")
        .matches(str -> str.contains("public class SomeClass {"), "class name");
  }
}
