import { Item } from './item.model'

export interface Donation {
    _id: String|undefined;
    donorId: String|undefined;
    entityId: String|undefined;
    donor: {
        _id: String|undefined;
        name: String|undefined;
    };
    entity: {
        _id: String|undefined;
        name: String|undefined;
    };
    numberOfItems: Number|undefined;
    pointsGiven: Number|undefined;
    status: String|undefined;
    recieved_at: Date|undefined;
    items: Item[] | undefined;
}