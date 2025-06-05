import { VariantAttribute } from "./db/models/attribute";
import connectToDatabase from "./db/mongoose";

const seedVariantAttributes = async () => {
  const count = await VariantAttribute.countDocuments();
  if (count === 0) {
    await VariantAttribute.insertMany([
      {
        name: "color",
        label: "Color",
        values: [
          "Red",
          "Blue",
          "Green",
          "Black",
          "White",
          "Gray",
          "Yellow",
          "Pink",
          "Purple",
          "Orange",
        ],
      },
      {
        name: "size",
        label: "Size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "XXXL",
          "4XL",
          "5XL",
          "6XL",
          "7XL",
          "28",
          "30",
          "32",
          "34",
          "36",
          "38",
          "40",
          "42",
          "44",
          "46",
          "48",
          "50",
        ],
      },
      {
        name: "material",
        label: "Material",
        values: [
          "Cotton",
          "Polyester",
          "Wool",
          "Silk",
          "Leather",
          "Denim",
          "Linen",
          "Rayon",
          "Acrylic",
          "Nylon",
        ],
      },
    ]);
  }
};

// Automatically run once when the app connects to DB
export const initializeApp = async () => {
  await connectToDatabase();
  await seedVariantAttributes();
};
