const OdrsController = async (req, res) => {
  const {
    orderId,
    customer,
    items: { product, title, price, quantity },
    image: { url, public_id },
    shippingAddress: {
      fullNfullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
    },
    totalAmount,
    payment: { paymentType, transactionId, paymentGateway, paymentStatus },
    orderStatus,
  } = req.body.payload;
  if (
    !orderId ||
    !customer ||
    !product ||
    !title ||
    !price ||
    !quantity ||
    !url ||
    !public_id ||
    !fullNfullName ||
    !phone ||
    !addressLine1 ||
    !addressLine2 ||
    !city ||
    !state ||
    !pincode ||
    !country ||
    !totalAmount ||
    !paymentType ||
    !transactionId ||
    !paymentGateway ||
    !paymentStatus ||
    !orderStatus
  ) {
    return res.status(400).json({
      message: "Ordar Placed requires all fields to be filled",
      status: false,
    });
  }
  
};
export default OdrsController;
