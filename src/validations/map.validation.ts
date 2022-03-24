import joi from 'joi';

export type NewMapType = {
    name: string,
    type: string,
    address: string,
    latitude: number,
    longitude: number
}

