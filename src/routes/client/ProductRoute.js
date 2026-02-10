import express from "express";
import routeHandler from "express-async-handler";
import ProductUploadController from "../../controller/admin/Product/ProductUploadController.js";
import CollectionCreateController from "../../controller/admin/Product/CollectionCreateController.js";
const route = express.Router();
route.post("/product/upload", routeHandler(ProductUploadController));
route.post("/collection/create", routeHandler(CollectionCreateController));
export default route;
