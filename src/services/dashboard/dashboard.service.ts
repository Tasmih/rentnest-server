import prisma from "../../lib/prisma";

// Admin Dashboard Stats
const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalLandlords,
    totalTenants,
    totalAdmins,
    totalProperties,
    availableProperties,
    rentedProperties,
    totalRentalRequests,
    flatCount,
    roomCount,
    seatCount,
    subletCount,
    hostelCount,
    pendingRequests,
    acceptedRequests,
    rejectedRequests,
    recentRequests,
  ] = await Promise.all([
    prisma.user.count({
      where: { isDeleted: false },
    }),
    prisma.user.count({
      where: { role: "LANDLORD", isDeleted: false },
    }),
    prisma.user.count({
      where: { role: "TENANT", isDeleted: false },
    }),
    prisma.user.count({
      where: { role: "ADMIN", isDeleted: false },
    }),
    prisma.property.count({
      where: { isDeleted: false },
    }),
    prisma.property.count({
      where: { status: "AVAILABLE", isDeleted: false },
    }),
    prisma.property.count({
      where: { status: "RENTED", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { isDeleted: false },
    }),
    // Property Type Counts
    prisma.property.count({
      where: { propertyType: "FLAT", isDeleted: false },
    }),
    prisma.property.count({
      where: { propertyType: "ROOM", isDeleted: false },
    }),
    prisma.property.count({
      where: { propertyType: "SEAT", isDeleted: false },
    }),
    prisma.property.count({
      where: { propertyType: "SUBLET", isDeleted: false },
    }),
    prisma.property.count({
      where: { propertyType: "HOSTEL", isDeleted: false },
    }),
    // Rental Request Status Counts
    prisma.rentalRequest.count({
      where: { status: "PENDING", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { status: "ACCEPTED", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { status: "REJECTED", isDeleted: false },
    }),
    // Recent Activity
    prisma.rentalRequest.findMany({
      where: { isDeleted: false },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        tenant: {
          select: { name: true, email: true },
        },
        property: {
          select: { title: true },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalLandlords,
    totalTenants,
    totalAdmins,
    totalProperties,
    availableProperties,
    rentedProperties,
    totalRentalRequests,
    propertyTypeDistribution: {
      FLAT: flatCount,
      ROOM: roomCount,
      SEAT: seatCount,
      SUBLET: subletCount,
      HOSTEL: hostelCount,
    },
    requestStatusDistribution: {
      PENDING: pendingRequests,
      ACCEPTED: acceptedRequests,
      REJECTED: rejectedRequests,
    },
    recentActivity: recentRequests,
  };
};

// Landlord Dashboard Stats
const getLandlordDashboard = async (userId: string) => {
  const [
    totalPropertiesOwned,
    availableProperties,
    rentedProperties,
    pendingRentalRequests,
    acceptedRentalRequests,
  ] = await Promise.all([
    prisma.property.count({
      where: { landlordId: userId, isDeleted: false },
    }),
    prisma.property.count({
      where: { landlordId: userId, status: "AVAILABLE", isDeleted: false },
    }),
    prisma.property.count({
      where: { landlordId: userId, status: "RENTED", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: {
        isDeleted: false,
        status: "PENDING",
        property: { landlordId: userId, isDeleted: false },
      },
    }),
    prisma.rentalRequest.count({
      where: {
        isDeleted: false,
        status: "ACCEPTED",
        property: { landlordId: userId, isDeleted: false },
      },
    }),
  ]);

  return {
    totalPropertiesOwned,
    availableProperties,
    rentedProperties,
    pendingRentalRequests,
    acceptedRentalRequests,
  };
};

// Tenant Dashboard Stats
const getTenantDashboard = async (userId: string) => {
  const [
    totalRentalRequests,
    pendingRequests,
    acceptedRequests,
    totalFavorites,
  ] = await Promise.all([
    prisma.rentalRequest.count({
      where: { tenantId: userId, isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: "PENDING", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: "ACCEPTED", isDeleted: false },
    }),
    prisma.favorite.count({
      where: { userId, status: "ACTIVE", isDeleted: false },
    }),
  ]);

  return {
    totalRentalRequests,
    pendingRequests,
    acceptedRequests,
    totalFavorites,
  };
};

export const DashboardService = {
  getAdminDashboard,
  getLandlordDashboard,
  getTenantDashboard,
};
