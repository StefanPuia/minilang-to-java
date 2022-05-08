<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OFBiz Minilang to Java</title>

    <link rel="stylesheet" href="/static/style.css"/>
</head>
<body>
<div id="container">
    <div id="input"></div>
    <div id="output"></div>
    <div id="controls">
        Collapse editors:
        <input
            type="range"
            min="-1"
            max="1"
            step="1"
            value="0"
            id="splitSizes"
        />
        <button id="toggle_options">Options</button>
        <input
            type="text"
            id="className"
            placeholder="Fully qualified class name"
            class="padded"
        />
        <select id="mode" class="padded">
            <option value="SERVICE">Service Methods</option>
            <option value="EVENT">Events</option>
            <option value="UTIL">Utility Methods</option>
        </select>
        <button id="submit">Convert</button>
        <a href="/tags">Tags</a>
    </div>
</div>

<div id="options_wrapper">
    <div id="options">
        <div id="logging">
            <h3>Logging level:</h3>
            <label for="logging_deprecated">
                <input type="checkbox" id="logging_deprecated"/>
                Deprecated
            </label>
            <label for="logging_info">
                <input type="checkbox" id="logging_info"/>
                Info
            </label>
            <label for="logging_warning">
                <input type="checkbox" id="logging_warning"/>
                Warning
            </label>
            <label for="logging_validation_warning">
                <input type="checkbox" id="logging_validation_warning"/>
                Validation Warning
            </label>
            <label for="logging_validation_error">
                <input type="checkbox" id="logging_validation_error"/>
                Validation Error
            </label>
            <label for="logging_validation_deprecated">
                <input type="checkbox" id="logging_validation_deprecated"/>
                Validation Deprecated
            </label>
            <#--<label for="logging_error" title="Error logging cannot be disabled.">-->
            <#--    <input-->
            <#--        type="checkbox"-->
            <#--        id="logging_error"-->
            <#--        checked-->
            <#--        disabled-->
            <#--    />-->
            <#--    Error-->
            <#--</label>-->
        </div>
        <div id="converter">
            <h3>Converter options:</h3>
            <label for="converter_authServices">
                <input type="checkbox" id="converter_authServices"/>
                Authenticate services automatically
            </label>
            <label for="converter_replicateMinilang">
                <input
                    type="checkbox"
                    id="converter_replicateMinilang"
                />
                Replicate the actual minilang behaviour
            </label>
            <div>
                <input type="number" id="converter_tabSize" value="2" min="0" step="1"> Tab size
            </div>
        </div>
        <div id="options_actions">
            <button id="options_actions_reset">Reset</button>
            <button id="options_actions_save">Close</button>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js"></script>
<script type="module" src="/static/consts.js" async defer></script>
<script type="module" src="/static/storage-migrate.js" async defer></script>
<script type="module" src="/static/script.js" async defer></script>
</body>
</html>
