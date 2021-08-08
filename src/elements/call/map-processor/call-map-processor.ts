import { ContextUtils } from "../../../core/context-utils";
import ConvertUtils from "../../../core/convert-utils";
import { ValidationMap } from "../../../core/validate";
import {
    FlexibleMapAccessor,
    XMLSchemaElementAttributes,
} from "../../../types";
import { SetElement } from "../../assignment/set";
import { CallerElement } from "../caller";
import { SimpleMapProcessor } from "./simple-map-processor";

export class CallMapProcessor extends CallerElement {
    public static readonly TAG = "call-map-processor";
    protected attributes = this.attributes as CallMapProcessorRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: [
                "processor-name",
                "xml-resource",
                "in-map-name",
                "out-map-name",
                "error-list-name",
            ],
            constantAttributes: [
                "processor-name",
                "xml-resource",
                "error-list-name",
            ],
            expressionAttributes: ["in-map-name", "out-map-name"],
            requiredAttributes: ["in-map-name", "out-map-name"],
            childElements: ["simple-map-processor"],
        };
    }

    private getAttributes(): CallMapProcessorAttributes {
        return {
            inMap: this.attributes["in-map-name"],
            outMap: this.attributes["out-map-name"],
            processor: this.attributes["xml-resource"]
                ? {
                      xmlResource: this.attributes["xml-resource"],
                      processorName: this.attributes["processor-name"] ?? "",
                  }
                : undefined,
            errorList: this.attributes["error-list-name"] ?? "error_list",
        };
    }

    public getType(): string {
        this.converter.addImport("Map");
        return (
            ContextUtils.getFullType(this, this.getAttributes().inMap) ??
            "Map<String, Object>"
        );
    }

    public getField(): string {
        return (
            ConvertUtils.parseFieldGetter(this.getAttributes().outMap) ??
            this.getAttributes().outMap
        );
    }

    public convert(): string[] {
        return [
            ...SetElement.getErrorMessageListDeclaration(
                this.getAttributes().errorList,
                this.converter,
                this.parent
            ),
            ...this.getExternalProcessor(),
            ...this.getInternalProcessor(),
        ];
    }

    private getExternalProcessor(): string[] {
        const { processor } = this.getAttributes();
        const inMap =
            ConvertUtils.parseFieldGetter(this.getAttributes().inMap) ??
            this.getAttributes().inMap;
        const outMap = this.getField();
        if (processor) {
            this.converter.addImport("SimpleMapProcessor");
            this.setVariableToContext({ name: "locale" });
            return [
                `SimpleMapProcessor.runSimpleMapProcessor` +
                    `("${processor.xmlResource}", "${processor.processorName}", ` +
                    +`${inMap}, ${outMap}, ${
                        this.getAttributes().errorList
                    }, ` +
                    `locale, this.getClass().getClassLoader());`,
            ];
        }
        return [];
    }

    private getInternalProcessor(): string[] {
        const processor = this.parseChildren().find(
            (tag) => tag instanceof SimpleMapProcessor
        );
        return processor
            ? (processor as SimpleMapProcessor).convertProcessor(
                  this.getAttributes().inMap,
                  this.getAttributes().errorList
              )
            : [];
    }
}

interface CallMapProcessorRawAttributes extends XMLSchemaElementAttributes {
    "in-map-name": string;
    "out-map-name": string;
    "xml-resource"?: string;
    "processor-name"?: string;
    "error-list-name"?: string;
}

interface CallMapProcessorAttributes {
    inMap: FlexibleMapAccessor;
    outMap: FlexibleMapAccessor;
    processor?: {
        processorName: string;
        xmlResource: string;
    };
    errorList: FlexibleMapAccessor;
}
