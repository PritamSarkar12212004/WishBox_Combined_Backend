import ProductModal from "../../../models/product/ProductModal.js";
import CollectionModal from "../../../models/product/CollectionModal.js";

const ProductUploadController = async (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload) {
      return res.status(400).json({ message: "Payload missing" });
    }
    const {
      title,
      description,
      category,
      pricing,
      stock,
      stockStatus,
      offers,
      images,
      collection,
    } = payload;
    if (
      !title ||
      !description ||
      !category ||
      !pricing?.originalPrice ||
      !pricing?.salePrice ||
      !images?.primary?.length ||
      !images?.lifestyle?.length ||
      !collection
    ) {
      return res.status(400).json({
        message: "Product Creation requires all fields to be filled",
        status: false,
      });
    }

    let collectionDoc = await CollectionModal.findOne({
      title: collection,
    });

    if (!collectionDoc) {
      collectionDoc = await CollectionModal.create({
        title: collection,
        description: `Collection for ${collection} products`,
        categoryName: category,
        isActive: true,
      });
    }
    const product = await ProductModal.create({
      title,
      description,
      category,
      pricing: {
        originalPrice: pricing.originalPrice,
        salePrice: pricing.salePrice,
        totalSaving: pricing.originalPrice - pricing.salePrice,
      },
      stock: stock ?? 0,
      stockStatus: stockStatus ?? "in_stock",
      offers,
      images: {
        primary: images.primary,
        lifestyle: images.lifestyle,
      },
      collection: collectionDoc._id,
    });
    res.status(201).json({
      message: "Product created successfully",
      product,
      status: true,
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
      status: false,
    });
  }
};

export default ProductUploadController;
