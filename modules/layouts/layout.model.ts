import { Schema, model } from "mongoose";
import { LayoutModel, TLayout } from "./layout.interface";

const LayoutSchema = new Schema<TLayout, Record<string, unknown>>({
  type: {
    type: String,
    enum: ["banner", "faq", "categories"],
    unique: true,
  },
  faq: {
    type: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
    default: undefined,
  },
  banner: {
    type: {
      title: {
        type: String,
      }
    },
    default: undefined,
  },
  categories: {
    type: [
      {
        categoryTitle: {
          type: String,
        },
      },
    ],
    default: undefined,
  },
});

export const Layout = model<TLayout, LayoutModel>("Layout", LayoutSchema);