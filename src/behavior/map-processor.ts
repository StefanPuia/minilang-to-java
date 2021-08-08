export interface MapProcessorBehaviour {
    convertProcessor(mapName: string, errorListName: string): string[];
}