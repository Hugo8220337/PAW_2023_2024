export interface Condition {
    _id: String|undefined;
    condition: String | undefined // Condição do item (ex: "Novo", "Usado", etc.)
    pointsPerKg:  Number | undefined // Pontos por grama baseado na condição do item
}