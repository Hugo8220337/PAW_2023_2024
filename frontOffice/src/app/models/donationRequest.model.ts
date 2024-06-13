import { Item } from "./item.model";

export interface DonationRequest {
    _id: String|undefined;
    donor: {
        _id: String|undefined;
        name: String|undefined;
    };
    entity: {
        _id: String|undefined;
        name: String|undefined;
    };
    numberOfItems: Number|undefined;
    expectedPoints: Number|undefined;
    status: String|undefined;
    created_at: Date|undefined;
    items: Item[] | undefined;
}