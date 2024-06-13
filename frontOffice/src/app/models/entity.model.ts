export interface Entity {
    _id: String | undefined;
    name: String | undefined;
    contact: {
        email: String | undefined;
        phoneNumber: String | undefined;
        address: String | undefined;
    };
    description: String | undefined;
    password: String | undefined;
    country: String | undefined;
    aditionalInfo:String | undefined;
    isActive: Boolean | undefined; // Indica se a entidade está ativa ou desativada
}