import { OutputData } from "@editorjs/editorjs";

export const productDescription: OutputData = {
  time: Date.now(),
  blocks: [
    {
      id: "1",
      type: "header",
      data: {
        text: "Men's Slim Fit Cotton Casual Shirt",
        level: 2,
      },
    },
    {
      id: "2",
      type: "paragraph",
      data: {
        text: "Elevate your everyday style with this classic slim fit cotton shirt. Designed for comfort and made from premium breathable fabric, it's perfect for casual outings and office wear.",
      },
    },
    {
      id: "3",
      type: "header",
      data: {
        text: "Key Features",
        level: 3,
      },
    },
    {
      id: "4",
      type: "list",
      data: {
        style: "unordered",
        items: [
          "100% Cotton – Soft & breathable",
          "Slim fit – Tailored cut for a sleek look",
          "Full sleeves with button cuffs",
          "Curved hem – Can be tucked or untucked",
          "Available in multiple colors",
        ],
      },
    },
    {
      id: "5",
      type: "header",
      data: {
        text: "Fabric & Fit",
        level: 3,
      },
    },
    {
      id: "6",
      type: "paragraph",
      data: {
        text: "This shirt is crafted from 100% combed cotton for a soft feel and excellent breathability. Slim fit offers a modern silhouette that works well for casual and semi-formal settings.",
      },
    },
    {
      id: "7",
      type: "header",
      data: {
        text: "Size Guide",
        level: 3,
      },
    },
    {
      id: "8",
      type: "table",
      data: {
        content: [
          ["Size", "Chest (in)", "Length (in)", "Sleeve (in)"],
          ["S", "38", "27", "24"],
          ["M", "40", "28", "24.5"],
          ["L", "42", "29", "25"],
          ["XL", "44", "30", "25.5"],
        ],
      },
    },
    {
      id: "9",
      type: "header",
      data: {
        text: "Care Instructions",
        level: 3,
      },
    },
    {
      id: "10",

      type: "list",
      data: {
        style: "ordered",
        items: [
          "Machine wash cold with similar colors",
          "Do not bleach",
          "Tumble dry low or hang dry",
          "Warm iron if needed",
        ],
      },
    },
    {
      id: "11",
      type: "paragraph",
      data: {
        text: "Style Tip: Pair this shirt with dark denim jeans and loafers for a crisp, relaxed look.",
      },
    },
  ],
  version: "2.29.1",
};
