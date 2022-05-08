<#-- @ftlvariable name="tagsDto" type="co.uk.stefanpuia.minilang2java.controller.dto.TagsDto" -->
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/static/style.css"/>
    <link rel="stylesheet" href="/static/tags.css"/>
    <title>OFBiz Minilang to Java - Unhandled Tags</title>
</head>
<body>
<div id="container">
    <div id="search">
        <a href="/">Back</a>
        <input type="text" id="search-input" placeholder="Search..."/>
    </div>
    <div>
        Handled: ${tagsDto.getHandled()} / ${tagsDto.tags()?size}
    </div>
    <div id="tags">
        <#list tagsDto.tags() as tag>
            <div class="tag ${tag.handled?string("", "unhandled")}"
                 title="${tag.tooltip()}">${tag.name()}</div>
        </#list>
    </div>
</div>

<div id="tag-display-wrapper">
    <div id="tag-display">
        <h3 id="tag-display-title"></h3>
        <p id="tag-display-description"></p>
        <#--<ul id="tag-display-attributes"></ul>-->
    </div>
</div>

<script src="/static/tags.js" type="module" async defer></script>
</body>
</html>