import Order from "../../models/admin/odars/OrderModal.js";
import Product from "../../models/admin/product/ProductModal.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    /* =========================
       TOTAL REVENUE + GROWTH
    ========================== */

    const revenueStats = await Order.aggregate([
      { $match: { "payment.paymentStatus": "success" } },
      {
        $facet: {
          total: [{ $group: { _id: null, total: { $sum: "$totalAmount" } } }],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfThisMonth } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          lastMonth: [
            {
              $match: {
                createdAt: {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth,
                },
              },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
        },
      },
    ]);

    const totalRevenue = revenueStats[0].total[0]?.total || 0;
    const thisMonthRevenue = revenueStats[0].thisMonth[0]?.total || 0;
    const lastMonthRevenue = revenueStats[0].lastMonth[0]?.total || 0;

    const revenueGrowth =
      lastMonthRevenue === 0
        ? 100
        : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    /* =========================
       TOTAL ORDERS
    ========================== */

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Order.distinct("customer").then(
      (res) => res.length,
    );

    /* =========================
       RECENT ORDERS
    ========================== */

    const recentOrders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    /* =========================
       TOP PRODUCTS
    ========================== */

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          title: { $first: "$items.title" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    /* =========================
       CATEGORY DISTRIBUTION
    ========================== */

    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        revenueGrowth: revenueGrowth.toFixed(1),
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders,
        topProducts,
        categoryDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
