import mongoose, { Schema, model, models } from 'mongoose';

export type MedicineType = 'tablet' | 'syrup' | 'injection' | 'other';

export interface IMedicine {
  name: string;
  mrp: number;
  purchaseRate: number;
  type: MedicineType;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the medicine'],
      trim: true,
      index: true,
    },
    mrp: {
      type: Number,
      required: [true, 'Please provide the Maximum Retail Price (MRP)'],
    },
    purchaseRate: {
      type: Number,
      required: [true, 'Please provide the Purchase Rate'],
    },
    type: {
      type: String,
      enum: ['tablet', 'syrup', 'injection', 'other'],
      default: 'tablet',
    },
  },
  {
    timestamps: true,
  }
);

// Clear existing model if it exists to force schema update in development
if (process.env.NODE_ENV !== 'production' && models.Medicine) {
  delete (mongoose as any).models.Medicine;
}

export default models.Medicine || model<IMedicine>('Medicine', MedicineSchema);
