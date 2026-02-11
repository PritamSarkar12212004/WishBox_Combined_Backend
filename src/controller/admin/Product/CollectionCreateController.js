import CollectionModal from '../../../models/admin/product/CollectionModal.js'
const CollectionCreateController = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryName,
      theme: { primaryColor, secondaryColor },
      coverImages: { url, public_id },
      isActive,
    } = req.body;
    if (
      !title ||
      !description ||
      !categoryName ||
      !url ||
      !public_id ||
      !primaryColor ||
      !secondaryColor
    ) {
      return res.status(400).json({
        message:
          "Title, description, categoryName, url, public_id, primaryColor and secondaryColor are required",
        status: false,
      });
    }
    let collectionDoc = await CollectionModal.findOne({
      title: title,
    });
    if (collectionDoc) {
      return res.status(400).json({
        message: "Collection with this title already exists",
        status: false,
      });
    }
    const collection = await CollectionModal.create({
      title,
      description: description || `Collection for ${title}`,
      categoryName,
      theme: { primaryColor, secondaryColor },
      coverImages: { url, public_id },
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({
      message: "Collection created successfully",
      collection,
      status: true,
    });
  } catch (error) {
    console.error("COLLECTION CREATE ERROR:", error);
    res.status(500).json({
      message: "Error creating collection",
      error: error.message,
      status: false,
    });
  }
};
export default CollectionCreateController;
