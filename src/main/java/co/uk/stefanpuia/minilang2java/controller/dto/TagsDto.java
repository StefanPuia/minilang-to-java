package co.uk.stefanpuia.minilang2java.controller.dto;

import java.util.Collection;

public record TagsDto(Collection<TagDto> tags) {
  public long getHandled() {
    return tags.stream().filter(TagDto::handled).count();
  }

  public long getOptimised() {
    return tags.stream().filter(TagDto::optimised).count();
  }
}
