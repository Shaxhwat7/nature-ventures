import { Schema } from 'mongoose';
export declare const Experience: import("mongoose").Model<{
    title: string;
    location: string;
    price: number;
    image: string;
    description: string;
    about: string;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    title: string;
    location: string;
    price: number;
    image: string;
    description: string;
    about: string;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    location: string;
    price: number;
    image: string;
    description: string;
    about: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    location: string;
    price: number;
    image: string;
    description: string;
    about: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    location: string;
    price: number;
    image: string;
    description: string;
    about: string;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    title: string;
    location: string;
    price: number;
    image: string;
    description: string;
    about: string;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const TimeSlot: import("mongoose").Model<{
    date: string;
    experienceId: import("mongoose").Types.ObjectId;
    time: string;
    available: boolean;
    spotsLeft: number;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    date: string;
    experienceId: import("mongoose").Types.ObjectId;
    time: string;
    available: boolean;
    spotsLeft: number;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    date: string;
    experienceId: import("mongoose").Types.ObjectId;
    time: string;
    available: boolean;
    spotsLeft: number;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    date: string;
    experienceId: import("mongoose").Types.ObjectId;
    time: string;
    available: boolean;
    spotsLeft: number;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    date: string;
    experienceId: import("mongoose").Types.ObjectId;
    time: string;
    available: boolean;
    spotsLeft: number;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    date: string;
    experienceId: import("mongoose").Types.ObjectId;
    time: string;
    available: boolean;
    spotsLeft: number;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const Booking: import("mongoose").Model<{
    name: string;
    experienceId: import("mongoose").Types.ObjectId;
    slotId: import("mongoose").Types.ObjectId;
    email: string;
    phone: string;
    promoCode?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    experienceId: import("mongoose").Types.ObjectId;
    slotId: import("mongoose").Types.ObjectId;
    email: string;
    phone: string;
    promoCode?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    experienceId: import("mongoose").Types.ObjectId;
    slotId: import("mongoose").Types.ObjectId;
    email: string;
    phone: string;
    promoCode?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    experienceId: import("mongoose").Types.ObjectId;
    slotId: import("mongoose").Types.ObjectId;
    email: string;
    phone: string;
    promoCode?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    experienceId: import("mongoose").Types.ObjectId;
    slotId: import("mongoose").Types.ObjectId;
    email: string;
    phone: string;
    promoCode?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    experienceId: import("mongoose").Types.ObjectId;
    slotId: import("mongoose").Types.ObjectId;
    email: string;
    phone: string;
    promoCode?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=schema.d.ts.map