export interface ProcessBehaviour {
    convertProcessOperation(
        mapName: string,
        fieldName: string,
        errorListName: string
    ): string[];
}
